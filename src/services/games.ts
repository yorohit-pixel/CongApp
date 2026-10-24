/**
 * Word games, at the student's level.
 * With the backend on: GET /games/words picks words near the student's current
 * level (their word-list difficulty, or their grade if they have no list yet).
 * Without it: the mock picks from the small local word bank by grade.
 * Words are selected, never generated.
 */
import { WORD_BANK } from "@/data/wordBank";
import { shuffle } from "@/lib/games";
import type { BankWord, GameKind } from "@/lib/types";
import { api, isOffline, studentId, toBankWord, usingBackend, type ApiWord } from "./api";
import { db, delay } from "./mock/db";

export const GAME_ROUNDS: Record<GameKind, number> = { "missing-piece": 8, "word-builder": 6 };

export async function getGameWords(game: GameKind): Promise<BankWord[]> {
  const grade = db().profile.grade ?? 2;

  if (usingBackend()) {
    try {
      const { words } = await api<{ level: number; words: ApiWord[] }>(
        `/games/words?game=${game}&grade=${grade}&studentId=${encodeURIComponent(studentId())}`,
      );
      return words.map((w) => toBankWord(w, grade));
    } catch (error) {
      if (!isOffline(error)) throw error; // offline: use the local words below
    }
  }

  const english = WORD_BANK.filter((w) => w.language === "en");
  // Closest to the student's grade first, a little shuffled.
  const byGrade = (words: BankWord[]) =>
    shuffle(words).sort((a, b) => Math.abs(a.gradeLevel - grade) - Math.abs(b.gradeLevel - grade));
  const pool =
    game === "missing-piece"
      ? byGrade(english.filter((w) => w.syllables.length > 1 && w.syllables.join("") === w.text))
      : byGrade(english.filter((w) => w.text.length >= 3 && w.gradeLevel <= grade + 1));
  return delay(pool.slice(0, GAME_ROUNDS[game]));
}
