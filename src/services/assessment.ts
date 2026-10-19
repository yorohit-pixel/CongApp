/**
 * Onboarding "personalization test".
 * This is a practice check-in to choose words, NOT a dyslexia diagnosis.
 *
 * With the Python backend on (NEXT_PUBLIC_API_URL), the 10 spelling words come
 * from GET /quiz and the answers go to POST /students/:id/quiz, where
 * spelling_recommender.py builds the first 10-word list.
 */
import { getPattern } from "@/data/patterns";
import { ASSESSMENT_ITEMS } from "@/data/seed";
import type {
  AssessmentActivity,
  AssessmentItem,
  HearAndTypeItem,
  AssessmentResponse,
  AssessmentSummary,
  Grade,
  PatternTag,
  SpellingCheckAnswer,
} from "@/lib/types";
import { api, ApiWord, ApiWordList, studentId, toDifficulty, toFocusArea, toPatternTags, usingBackend } from "./api";
import { db, delay, persist } from "./mock/db";
import { rememberWordList } from "./recommendations";

/** Section order. */
export const ASSESSMENT_SECTIONS: AssessmentActivity[] = ["hear-and-type", "sound-match"];

const STRENGTH_LABELS: Record<AssessmentActivity, string> = {
  "hear-and-type": "Hearing a word and spelling it",
  "sound-match": "Listening for sounds in words",
};

/** The test items handed out most recently (the backend's quiz words change every time). */
let currentItems: AssessmentItem[] = ASSESSMENT_ITEMS;

function quizItem(word: ApiWord, index: number): HearAndTypeItem {
  return {
    id: `q${index + 1}-${word.word}`,
    activity: "hear-and-type",
    difficulty: toDifficulty(word.difficulty),
    answer: word.word,
    syllables: word.syllables,
    patterns: toPatternTags(word),
  };
}

/** All sections in order; within each section, easiest → hardest. Every grade gets 10 spelling words. */
export async function getAssessmentItems(grade: Grade): Promise<AssessmentItem[]> {
  let source = ASSESSMENT_ITEMS;
  if (usingBackend()) {
    // 10 random words from the dataset, getting harder, with mixed word types.
    const quiz = await api<{ words: ApiWord[] }>(`/quiz?grade=${grade}`);
    source = [...quiz.words.map(quizItem), ...ASSESSMENT_ITEMS.filter((i) => i.activity !== "hear-and-type")];
  }
  currentItems = [...source].sort(
    // Stable sort: the backend's words are already in order, easiest first.
    (a, b) => ASSESSMENT_SECTIONS.indexOf(a.activity) - ASSESSMENT_SECTIONS.indexOf(b.activity) || a.difficulty - b.difficulty,
  );
  return delay(currentItems);
}

export async function submitAssessment(grade: Grade, responses: AssessmentResponse[]): Promise<AssessmentSummary> {
  const byActivity = {
    "hear-and-type": { correct: 0, total: 0 },
    "sound-match": { correct: 0, total: 0 },
  } satisfies AssessmentSummary["byActivity"];

  const missedPatterns = new Map<PatternTag, number>();
  for (const r of responses) {
    byActivity[r.activity].total += 1;
    if (r.correct) byActivity[r.activity].correct += 1;
    else r.patterns.forEach((p) => missedPatterns.set(p, (missedPatterns.get(p) ?? 0) + 1));
  }

  const strengths = (Object.keys(byActivity) as AssessmentActivity[])
    .filter((a) => byActivity[a].total > 0 && byActivity[a].correct / byActivity[a].total >= 0.75)
    .map((a) => STRENGTH_LABELS[a]);

  // Keep every spelling answer (what was typed vs. the right word) for later use.
  const items = new Map(currentItems.map((i) => [i.id, i]));
  const spelling: SpellingCheckAnswer[] = responses
    .filter((r) => r.activity === "hear-and-type")
    .map((r) => ({
      itemId: r.itemId,
      word: r.answer,
      typed: r.response,
      correct: r.correct,
      difficulty: items.get(r.itemId)?.difficulty ?? 1,
      patterns: r.patterns,
    }));

  let practiceAreas = [...missedPatterns.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag]) => getPattern(tag));

  if (usingBackend()) {
    // The recommender learns from every typed answer and picks the first 10-word list.
    const list = await api<ApiWordList>(`/students/${encodeURIComponent(studentId())}/quiz`, {
      method: "POST",
      body: JSON.stringify({ grade, answers: spelling.map((s) => ({ word: s.word, typed: s.typed })) }),
    });
    rememberWordList(list);
    practiceAreas = list.focusAreas.map((a) => toFocusArea(a).pattern);
  }

  const summary: AssessmentSummary = {
    completedAt: new Date().toISOString(),
    grade,
    strengths: strengths.length ? strengths : ["You kept going through every question — that takes effort!"],
    practiceAreas,
    byActivity,
    spelling,
  };

  db().assessment = summary;
  db().profile = { ...db().profile, grade, onboardingComplete: true };
  persist();
  return delay(summary, 300);
}

export async function getLatestAssessment(): Promise<AssessmentSummary | null> {
  return delay(db().assessment, 60);
}
