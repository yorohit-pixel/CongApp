"use client";

import { BuzzSays } from "@/components/buddy/BuzzSays";
import { PageShell } from "@/components/layout/PageShell";
import { FlameIcon } from "@/components/ui/Icons";
import { PillLink } from "@/components/ui/PillButton";
import { LoadingState } from "@/components/ui/Status";
import { useBuddy } from "@/context/BuddyProvider";
import { cn } from "@/lib/cn";

const MILESTONES = [3, 7, 14, 30];

export default function StreakPage() {
  const { hive, name } = useBuddy();
  if (!hive) {
    return (
      <PageShell title="My Streak">
        <LoadingState />
      </PageShell>
    );
  }
  const { current, best, practicedToday, lastSevenDays } = hive.streak;
  const nextGoal = MILESTONES.find((m) => m > current) ?? current + 1;
  const message = practicedToday
    ? `You practiced today${name ? `, ${name}` : ""}! Your streak is safe. Come back tomorrow to make it ${current + 1}.`
    : current > 0
      ? `Your ${current}-day streak is waiting! Do one practice or game today to keep it going.`
      : "Start a streak today! Do one practice or one game, then come back tomorrow.";

  return (
    <PageShell title="My Streak">
      <div className="mx-auto grid max-w-5xl gap-8">
        <div className="card-pop flex flex-col items-center gap-6 rounded-[2.5rem] bg-white px-6 py-8 text-center sm:flex-row sm:justify-center sm:gap-10">
          <FlameIcon size="6rem" />
          <div>
            <p className="text-[4rem] font-bold leading-none text-ink">{current}</p>
            <p className="text-xl font-bold text-ink">{current === 1 ? "day in a row" : "days in a row"}</p>
            <p className="mt-2 text-base text-ink">Best ever: {best}</p>
          </div>
          <PillLink href="/personalized" variant="gold" size="lg">
            {practicedToday ? "Practice more" : "Practice now"}
          </PillLink>
        </div>

        <section aria-labelledby="week-heading" className="card-pop rounded-[2.5rem] bg-white p-7">
          <h2 id="week-heading" className="text-2xl font-bold text-ink">
            This Week
          </h2>
          <ol className="mt-4 grid grid-cols-7 gap-2 text-center">
            {lastSevenDays.map((day, i) => {
              const date = new Date(`${day.date}T12:00:00`);
              const isToday = i === lastSevenDays.length - 1;
              return (
                <li key={day.date} className="flex flex-col items-center gap-1">
                  <span className={cn("text-base font-bold text-ink", isToday && "underline underline-offset-4")}>
                    {isToday ? "Today" : date.toLocaleDateString(undefined, { weekday: "short" })}
                  </span>
                  <svg viewBox="0 0 48 42" className="h-auto w-full max-w-[3.6rem]" aria-hidden="true">
                    <polygon points="12,2 36,2 46,21 36,40 12,40 2,21" fill={day.active ? "#FDB104" : "#FFFFFF"} stroke="#00245D" strokeWidth="2.5" strokeDasharray={day.active ? undefined : "5 4"} />
                    {day.active && <path d="M14 22l7 7 13-14" stroke="#00245D" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
                  </svg>
                  <span className="text-sm text-ink">{day.active ? "✓ Buzzed" : "—"}</span>
                </li>
              );
            })}
          </ol>
        </section>

        <section aria-labelledby="goals-heading" className="card-pop rounded-[2.5rem] bg-white p-7">
          <h2 id="goals-heading" className="text-2xl font-bold text-ink">
            Streak Goals
          </h2>
          <p className="mt-1 text-lg text-ink">Next goal: {nextGoal} days in a row.</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {MILESTONES.map((m) => {
              const reached = best >= m;
              return (
                <li key={m} className="flex items-center gap-4 rounded-full border-2 border-black bg-cream px-5 py-3">
                  <FlameIcon size="2.2rem" className={reached ? undefined : "opacity-35 grayscale"} />
                  <span className="flex-1 text-lg font-bold text-ink">{m} days</span>
                  <span className="text-base font-bold text-ink">{reached ? "✓ Done" : `${Math.min(current, m)} of ${m}`}</span>
                </li>
              );
            })}
          </ul>
        </section>
        <BuzzSays size="lg" className="mx-auto mt-4 max-w-3xl" text={message} />
      </div>
    </PageShell>
  );
}
