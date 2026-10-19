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
  const perfectSessions = history.filter((s) => s.attempts.length > 0 && s.attempts.every((a) => a.correct && a.tries === 1)).length;
  const hintAndRight = attempts.some((a) => a.correct && a.usedHint);
  const keptTrying = attempts.some((a) => a.correct && a.tries > 1);
  const listsDone = history.filter((s) => s.sourceKind === "personalized").length;
  const communityDone = history.filter((s) => s.sourceKind === "community").length;
  const games = hive?.gamesPlayed ?? 0;
  const honey = hive?.honey.earned ?? 0;
  return [
    { id: "hello-hive", title: "Hello, Hive!", howTo: "Finish the welcome check-in.", icon: "check", earned: assessment !== null },
    { id: "first-flight", title: "First Flight", howTo: "Finish one practice.", icon: "book", ...counted(summary.sessionsCompleted, 1) },
    { id: "busy-bee", title: "Busy Bee", howTo: "Finish 5 practices.", icon: "book", ...counted(summary.sessionsCompleted, 5) },
    { id: "word-collector", title: "Word Collector", howTo: "Practice 50 words.", icon: "book", ...counted(summary.wordsPracticed, 50) },
    { id: "sharp-speller", title: "Sharp Speller", howTo: "Spell 20 words right on the first try.", icon: "star", ...counted(firstTry, 20) },
    { id: "b-d-detective", title: "b–d Detective", howTo: "Spell 5 b, d or p words right.", icon: "bd", ...counted(lookAlikeRight, 5) },
    { id: "perfect-hive", title: "Perfect Hive", howTo: "Get every word right on the first try in one practice.", icon: "star", earned: perfectSession },
    { id: "streak-3", title: "Three Days Buzzing", howTo: "Keep a 3-day streak.", icon: "flame", ...counted(bestStreak, 3) },
    { id: "streak-7", title: "Week of Buzzing", howTo: "Keep a 7-day streak.", icon: "flame", ...counted(bestStreak, 7) },
    { id: "game-time", title: "Game Time", howTo: "Finish a word game.", icon: "game", ...counted(games, 1) },
    { id: "game-fan", title: "Game Fan", howTo: "Finish 5 word games.", icon: "game", ...counted(games, 5) },
    { id: "honey-100", title: "Honey Hoarder", howTo: "Earn 100 honey drops.", icon: "honey", ...counted(honey, 100) },
    { id: "dressed-up", title: "Dressed to Buzz", howTo: "Buy something in the honey shop.", icon: "hat", ...counted(hive?.owned.length ?? 0, 1) },
    { id: "fashion-bee", title: "Fashion Bee", howTo: "Collect 5 things from the honey shop.", icon: "hat", ...counted(hive?.owned.length ?? 0, 5) },
    { id: "super-speller", title: "Super Speller", howTo: "Finish 10 practices.", icon: "book", ...counted(summary.sessionsCompleted, 10) },
    { id: "word-wizard", title: "Word Wizard", howTo: "Practice 100 words.", icon: "book", ...counted(summary.wordsPracticed, 100) },
    { id: "spelling-star", title: "Spelling Star", howTo: "Spell 50 words right on the first try.", icon: "star", ...counted(firstTry, 50) },
    { id: "perfect-three", title: "Triple Perfect", howTo: "Get every word right on the first try in 3 practices.", icon: "star", ...counted(perfectSessions, 3) },
    { id: "hint-helper", title: "Hint Helper", howTo: "Use a hint, then spell the word right.", icon: "check", earned: hintAndRight },
    { id: "never-give-up", title: "Never Give Up", howTo: "Spell a word right after another try.", icon: "check", earned: keptTrying },
    { id: "list-starter", title: "List Starter", howTo: "Finish a “Practice for You” list.", icon: "check", ...counted(listsDone, 1) },
    { id: "list-climber", title: "List Climber", howTo: "Finish 3 “Practice for You” lists.", icon: "check", ...counted(listsDone, 3) },
    { id: "hive-explorer", title: "Hive Explorer", howTo: "Practice a Community Hive set.", icon: "book", ...counted(communityDone, 1) },
    { id: "streak-14", title: "Two-Week Wonder", howTo: "Keep a 14-day streak.", icon: "flame", ...counted(bestStreak, 14) },
    { id: "game-champ", title: "Game Champ", howTo: "Finish 15 word games.", icon: "game", ...counted(games, 15) },
  ];
}
