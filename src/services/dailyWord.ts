/**
 * Daily Word service.
 * BACKEND: the server should choose the word (same word for everyone on a date).
 */
import { WORD_BANK } from "@/data/wordBank";
import type { DailyWord } from "@/lib/types";
import { delay } from "./mock/db";

/** Local calendar date as YYYY-MM-DD. */
export function todayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** MOCK: picks a stable English word from the bank for the given date. */
export async function getDailyWord(date = new Date()): Promise<DailyWord> {
  const key = todayKey(date);
  const candidates = WORD_BANK.filter((w) => w.language === "en" && w.difficulty >= 2);
  const dayNumber = Math.floor(new Date(`${key}T00:00:00Z`).getTime() / 86_400_000);
  const word = candidates[dayNumber % candidates.length];
  return delay({ date: key, word });
}
