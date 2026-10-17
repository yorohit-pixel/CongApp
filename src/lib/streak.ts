import type { StreakInfo } from "./types";

/** Local calendar day as YYYY-MM-DD. */
export function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(date: Date, n: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + n);
  return copy;
}

/**
 * Works out the streak from the times a student finished any practice or game.
 * The current streak still counts if today isn't done yet but yesterday was.
 */
export function computeStreak(activityTimes: string[], now = new Date()): StreakInfo {
  const days = new Set(activityTimes.map((t) => dayKey(new Date(t))));
  const practicedToday = days.has(dayKey(now));

  let current = 0;
  let cursor = practicedToday ? now : addDays(now, -1);
  while (days.has(dayKey(cursor))) {
    current += 1;
    cursor = addDays(cursor, -1);
  }

  let best = 0;
  for (const key of days) {
    const start = new Date(`${key}T12:00:00`);
    if (days.has(dayKey(addDays(start, -1)))) continue; // only count from the first day of each run
    let run = 0;
    while (days.has(dayKey(addDays(start, run)))) run += 1;
    best = Math.max(best, run);
  }

  const lastSevenDays = Array.from({ length: 7 }, (_, i) => {
    const date = dayKey(addDays(now, i - 6));
    return { date, active: days.has(date) };
  });

  return { current, best: Math.max(best, current), practicedToday, lastSevenDays };
}
