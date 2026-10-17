import type { SessionResult } from "./types";

/** Words to practise each day for the "Today's goal" honeycomb. */
export const DAILY_GOAL = 10;
/** Honey drops that fill one jar. */
export const JAR_SIZE = 25;

/** One honey drop for every word spelled right. */
export function honeyDrops(history: SessionResult[]): number {
  return history.reduce((sum, s) => sum + s.attempts.filter((a) => a.correct).length, 0);
}

/** Words practised today (local date). */
export function wordsToday(history: SessionResult[], now = new Date()): number {
  const today = now.toDateString();
  return history.filter((s) => new Date(s.completedAt).toDateString() === today).reduce((sum, s) => sum + s.attempts.length, 0);
}

export function jarProgress(drops: number) {
  return { fullJars: Math.floor(drops / JAR_SIZE), inJar: drops % JAR_SIZE };
}
