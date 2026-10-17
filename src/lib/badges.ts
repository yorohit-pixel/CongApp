import type { AssessmentSummary, HiveState, ProgressSummary, SessionResult } from "./types";

export type BadgeIcon = "check" | "book" | "star" | "flame" | "honey" | "game" | "hat" | "bd";

export interface Badge {
  id: string;
  title: string;
  /** How to earn it, shown while it's still locked. */
  howTo: string;
  icon: BadgeIcon;
  earned: boolean;
  /** For locked badges with a count: how far along the student is, e.g. 3 of 5. */
  progress?: { have: number; need: number };
}

function counted(have: number, need: number) {
  return { earned: have >= need, progress: { have: Math.min(have, need), need } };
}

/**
 * Badges are worked out from progress the frontend already has, so they
 * need nothing extra from the backend.
 */
export function computeBadges(
  summary: ProgressSummary,
  history: SessionResult[],
  assessment: AssessmentSummary | null,
  hive: HiveState | null,
): Badge[] {
  const attempts = history.flatMap((s) => s.attempts);
  const firstTry = attempts.filter((a) => a.correct && a.tries === 1).length;
  const perfectSession = history.some((s) => s.attempts.length > 0 && s.attempts.every((a) => a.correct && a.tries === 1));
  const lookAlikeRight = attempts.filter((a) => a.correct && a.patterns.includes("letter-reversal")).length;
  const bestStreak = hive?.streak.best ?? summary.streakDays;
  return [
    { id: "hello-hive", title: "Hello, hive!", howTo: "Finish the welcome check-in.", icon: "check", earned: assessment !== null },
    { id: "first-flight", title: "First flight", howTo: "Finish one practice.", icon: "book", ...counted(summary.sessionsCompleted, 1) },
    { id: "busy-bee", title: "Busy bee", howTo: "Finish 5 practices.", icon: "book", ...counted(summary.sessionsCompleted, 5) },
    { id: "word-collector", title: "Word collector", howTo: "Practice 50 words.", icon: "book", ...counted(summary.wordsPracticed, 50) },
    { id: "sharp-speller", title: "Sharp speller", howTo: "Spell 20 words right on the first try.", icon: "star", ...counted(firstTry, 20) },
    { id: "b-d-detective", title: "b–d detective", howTo: "Spell 5 b, d or p words right.", icon: "bd", ...counted(lookAlikeRight, 5) },
    { id: "perfect-hive", title: "Perfect hive", howTo: "Get every word right on the first try in one practice.", icon: "star", earned: perfectSession },
    { id: "streak-3", title: "Three days buzzing", howTo: "Keep a 3-day streak.", icon: "flame", ...counted(bestStreak, 3) },
    { id: "streak-7", title: "Week of buzzing", howTo: "Keep a 7-day streak.", icon: "flame", ...counted(bestStreak, 7) },
    { id: "game-time", title: "Game time", howTo: "Finish a word game.", icon: "game", ...counted(hive?.gamesPlayed ?? 0, 1) },
    { id: "game-fan", title: "Game fan", howTo: "Finish 5 word games.", icon: "game", ...counted(hive?.gamesPlayed ?? 0, 5) },
    { id: "honey-100", title: "Honey hoarder", howTo: "Earn 100 honey drops.", icon: "honey", ...counted(hive?.honey.earned ?? 0, 100) },
    { id: "dressed-up", title: "Dressed to buzz", howTo: "Buy something in the honey shop.", icon: "hat", ...counted(hive?.owned.length ?? 0, 1) },
    { id: "fashion-bee", title: "Fashion bee", howTo: "Collect 5 things from the honey shop.", icon: "hat", ...counted(hive?.owned.length ?? 0, 5) },
  ];
}
