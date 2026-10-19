/**
 * Practice results and progress.
 * BACKEND: POST each finished session; compute summaries on the server.
 */
import { makeId } from "@/lib/id";
import { computeStreak } from "@/lib/streak";
import type { ProgressSummary, SessionResult } from "@/lib/types";
import { db, delay, persist } from "./mock/db";
import { submitWordListAnswers } from "./recommendations";

export async function submitSessionResult(result: Omit<SessionResult, "id">): Promise<SessionResult> {
  const saved: SessionResult = { ...result, id: makeId("res") };
  db().history.push(saved);
  persist();
  if (result.sourceKind === "personalized") {
    // Backend: these answers pick the next 10 words. Practice is still saved if that fails.
    await submitWordListAnswers(result.attempts).catch((error: unknown) => console.warn("Couldn't send answers to the recommender:", error));
  }
  return delay(saved, 60);
}

export async function getHistory(): Promise<SessionResult[]> {
  return delay([...db().history].sort((a, b) => b.completedAt.localeCompare(a.completedAt)));
}

export async function getProgressSummary(): Promise<ProgressSummary> {
  const { history, hive } = db();
  const attempts = history.flatMap((s) => s.attempts);
  // Practice and games both keep the streak going.
  const streak = computeStreak([...history.map((s) => s.completedAt), ...hive.games.map((g) => g.completedAt)]).current;
  return delay({
    sessionsCompleted: history.length,
    wordsPracticed: attempts.length,
    wordsCorrect: attempts.filter((a) => a.correct).length,
    streakDays: streak,
  });
}
