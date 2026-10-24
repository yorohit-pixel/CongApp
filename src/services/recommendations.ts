/**
 * Personalized Practice service ("Practice for you").
 *
 * With the Python backend on, this is the student's current 10-word list from
 * spelling_recommender.py: list 1 is built from the assessment quiz, and each
 * finished list's answers build the next one (see submitWordListAnswers).
 * Without it, the mock picks words from the small local word bank.
 */
import { WORD_BANK } from "@/data/wordBank";
import { findFocusAreas, selectWordsFromBank } from "@/lib/recommend";
import type { Recommendation, WordAttempt } from "@/lib/types";
import { api, ApiError, ApiWordList, isOffline, studentId, toBankWord, toFocusArea, usingBackend } from "./api";
import { db, delay } from "./mock/db";

/** The list the student is working on, so its answers are sent back only once. */
let openList: { setNumber: number; words: Set<string> } | null = null;

export function rememberWordList(list: ApiWordList): void {
  openList = { setNumber: list.setNumber, words: new Set(list.words.map((w) => w.word)) };
}

function fromWordList(list: ApiWordList): Recommendation {
  const focusAreas = list.focusAreas.map(toFocusArea);
  const focusTags = new Set(list.focusAreas.map((a) => a.tag));
  const grade = db().profile.grade ?? 3;
  return {
    generatedAt: new Date().toISOString(),
    setNumber: list.setNumber,
    focusAreas,
    words: list.words.map((w) => ({
      ...toBankWord(w, grade),
      matchedPattern: w.types.find((t) => focusTags.has(t)) ?? w.types[0] ?? "",
    })),
  };
}

export async function getRecommendations(): Promise<Recommendation> {
  if (usingBackend()) {
    try {
      const list = await api<ApiWordList>(`/students/${encodeURIComponent(studentId())}/word-list`);
      rememberWordList(list);
      return fromWordList(list);
    } catch (error) {
      // No quiz yet for this student: nothing to recommend.
      if (error instanceof ApiError && error.status === 404) {
        return { generatedAt: new Date().toISOString(), focusAreas: [], words: [] };
      }
      if (!isOffline(error)) throw error;
      // Offline: fall through to the demo recommendations below.
    }
  }
  const { history, assessment, profile } = db();
  const focusAreas = findFocusAreas(history, assessment);
  const words = selectWordsFromBank(WORD_BANK, focusAreas, history, profile.grade);
  return delay({ generatedAt: new Date().toISOString(), focusAreas, words }, 200);
}

/**
 * Sends a finished "Practice for you" list to the recommender, which picks the next 10 words.
 * Only the first full run of the open list counts (not "Try again" or "Practice missed words").
 * Returns the new list's number, or null if nothing was sent.
 */
export async function submitWordListAnswers(attempts: WordAttempt[]): Promise<number | null> {
  if (!usingBackend() || !openList) return null;
  const answered = new Set(attempts.map((a) => a.answer));
  if (answered.size !== openList.words.size || ![...openList.words].every((w) => answered.has(w))) return null;
  openList = null;
  const next = await api<ApiWordList>(`/students/${encodeURIComponent(studentId())}/word-list/answers`, {
    method: "POST",
    body: JSON.stringify({ answers: attempts.map((a) => ({ word: a.answer, typed: a.firstTyped ?? a.typed })) }),
  });
  rememberWordList(next);
  return next.setNumber;
}
