/**
 * Daily Words: one spelling pattern a day, with 3 words that use it (easy, medium, hard).
 * With the backend on: GET /daily?grade=&date= (the same for everyone in a grade on a date).
 * Without it: the mock picks from the local word bank.
 */
import { getPattern } from "@/data/patterns";
import { WORD_BANK } from "@/data/wordBank";
import type { BankWord, DailyChallenge, PatternTag } from "@/lib/types";
import { api, isOffline, toBankWord, toFocusArea, usingBackend, type ApiFocusArea, type ApiWord } from "./api";
import { db, delay } from "./mock/db";

/** Local calendar date as YYYY-MM-DD. */
export function todayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export async function getDailyChallenge(date = new Date()): Promise<DailyChallenge> {
  const key = todayKey(date);
  const grade = db().profile.grade ?? 3;

  if (usingBackend()) {
    try {
      const daily = await api<{ date: string; pattern: Omit<ApiFocusArea, "missed">; words: ApiWord[] }>(`/daily?grade=${grade}&date=${key}`);
      return {
        date: daily.date,
        pattern: toFocusArea({ ...daily.pattern, missed: 0 }).pattern,
        words: daily.words.map((w) => toBankWord(w, grade)),
      };
    } catch (error) {
      if (!isOffline(error)) throw error; // offline: use the local words below
    }
  }

  // MOCK: a stable pattern for the date, then its easiest, middle and hardest words.
  const byPattern = new Map<PatternTag, BankWord[]>();
  for (const word of WORD_BANK) {
    for (const tag of word.patterns) byPattern.set(tag, [...(byPattern.get(tag) ?? []), word]);
  }
  const patterns = [...byPattern.keys()].filter((tag) => (byPattern.get(tag) ?? []).length >= 3).sort();
  const dayNumber = Math.floor(new Date(`${key}T00:00:00Z`).getTime() / 86_400_000);
  const tag = patterns[dayNumber % patterns.length];
  const words = [...(byPattern.get(tag) ?? [])].sort((a, b) => a.difficulty - b.difficulty || a.gradeLevel - b.gradeLevel);
  const picks = [words[0], words[Math.floor(words.length / 2)], words[words.length - 1]];
  return delay({ date: key, pattern: getPattern(tag), words: picks });
}
