"use client";

import Link from "next/link";
import { useBuddy } from "@/context/BuddyProvider";
import { hello, tipOfTheDay } from "@/lib/cheers";
import { DAILY_GOAL, honeyDrops, jarProgress, JAR_SIZE, wordsToday } from "@/lib/honey";
import type { SessionResult } from "@/lib/types";
import { BuzzSays } from "../buddy/BuzzSays";
import { FlameIcon, HoneyDropIcon } from "../ui/Icons";

/** Top of Home: today's goal (with the streak) and the honey jar. */
export function HivePanel({ history }: { history: SessionResult[] }) {
  const { hive } = useBuddy();
  const today = wordsToday(history);
  // Spendable honey (earned minus what was spent in the shop).
  const drops = hive?.honey.balance ?? honeyDrops(history);
  const goalMet = today >= DAILY_GOAL;
  return (
    <section aria-label="My hive" className="grid gap-5 sm:grid-cols-2 lg:max-w-[1250px] lg:grid-cols-[auto_auto_1fr] lg:items-stretch">
      <DailyGoal today={today} goalMet={goalMet} streak={hive?.streak.current ?? 0} />
      <HoneyJar drops={drops} />
    </section>
  );
}

/** Bottom of Home: Buzz says hello with the tip of the day. */
export function HomeGreeting({ className }: { className?: string }) {
  const { name } = useBuddy();
  return <BuzzSays className={className} text={`${hello(name)} Ready to buzz? Today's tip: ${tipOfTheDay()}`} />;
}

function DailyGoal({ today, goalMet, streak }: { today: number; goalMet: boolean; streak: number }) {
  const filled = Math.min(today, DAILY_GOAL);
  return (
    <div className="flex flex-col items-center justify-center card-pop rounded-[2.5rem] bg-white px-6 py-5 text-center lg:w-[17rem]">
      <h2 className="text-xl font-bold text-ink">Today's goal</h2>
      <p className="text-lg text-ink">
        {goalMet ? "✓ Goal done! Super busy bee!" : `${filled} of ${DAILY_GOAL} words`}
      </p>
      <div className="mt-2 grid grid-cols-5 gap-1" aria-hidden="true">
        {Array.from({ length: DAILY_GOAL }, (_, i) => (
          <svg key={i} viewBox="0 0 24 21" className="h-7 w-8">
            <polygon points="6,1 18,1 23,10.5 18,20 6,20 1,10.5" fill={i < filled ? "#FDB104" : "#FFFFFF"} stroke="#00245D" strokeWidth="1.5" />
          </svg>
        ))}
      </div>
      <Link href="/streak" className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-black bg-cream px-4 text-base font-bold text-ink hover:bg-[#FFF6DA]">
        <FlameIcon size="1.5rem" />
        {streak} {streak === 1 ? "day" : "days"} in a row
      </Link>
    </div>
  );
}

function HoneyJar({ drops }: { drops: number }) {
  const { fullJars, inJar } = jarProgress(drops);
  const level = inJar / JAR_SIZE; // 0–1
  const honeyTop = 92 - level * 60; // jar inside runs from y=32 to y=92
  return (
    <div className="flex items-center gap-4 card-pop rounded-[2.5rem] bg-white px-6 py-5 lg:w-[19rem]">
      <svg viewBox="0 0 80 100" className="h-28 w-auto shrink-0" aria-hidden="true">
        <defs>
          <clipPath id="jar-inside">
            <path d="M14 30h52v52c0 8-6 12-14 12H28c-8 0-14-4-14-12z" />
          </clipPath>
        </defs>
        <rect x="14" y={honeyTop} width="52" height={100 - honeyTop} fill="#FDB104" clipPath="url(#jar-inside)" />
        <path d="M14 30h52v52c0 8-6 12-14 12H28c-8 0-14-4-14-12z" fill="none" stroke="#00245D" strokeWidth="3.5" />
        <rect x="10" y="16" width="60" height="14" rx="5" fill="#2F497B" />
        {/* Label kept well inside the jar walls (x 14–66). */}
        <rect x="21" y="52" width="38" height="17" rx="4" fill="#FFFFFF" stroke="#00245D" strokeWidth="2" />
        <text x="40" y="64.5" textAnchor="middle" fontSize="9" fontWeight="800" letterSpacing="0.5" fill="#00245D" textLength="30" lengthAdjust="spacingAndGlyphs">
          HONEY
        </text>
      </svg>
      <div>
        <h2 className="text-xl font-bold text-ink">My honey jar</h2>
        <p className="mt-1 inline-flex items-center gap-1 text-[1.6rem] font-bold text-ink">
          <HoneyDropIcon size="1.6rem" />
          {drops}
        </p>
        <p className="text-base text-ink">
          {JAR_SIZE - inJar} more to fill {fullJars > 0 ? `jar ${fullJars + 1}` : "it"}!
        </p>
        {fullJars > 0 && <p className="text-base font-bold text-ink">✓ {fullJars} full {fullJars === 1 ? "jar" : "jars"}</p>}
        <p className="sr-only">You get one honey drop for every word you spell right.</p>
        <Link href="/shop" className="mt-1 inline-flex min-h-11 items-center text-base font-bold text-ink underline underline-offset-4">
          Spend in the honey shop
        </Link>
      </div>
    </div>
  );
}
