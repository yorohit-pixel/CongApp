"use client";

import { useEffect, useRef } from "react";
import { useBuddy } from "@/context/BuddyProvider";
import type { GameKind } from "@/lib/types";
import { recordGameResult } from "@/services";
import { BuzzSays } from "../buddy/BuzzSays";
import { CelebrationBurst } from "../decor/BeeDecor";
import { HoneyDropIcon, HouseIcon } from "../ui/Icons";
import { PillButton, PillLink } from "../ui/PillButton";

/** Honeycomb cells: gold = right on the first try, white = needed another go. Text says the same for screen readers. */
export function HoneycombScore({ results, current }: { results: boolean[]; current?: number }) {
  const total = Math.max(results.length, current !== undefined ? current + 1 : 0);
  return (
    <div className="flex flex-wrap justify-center gap-1.5" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <svg key={i} viewBox="0 0 24 21" className="h-7 w-8">
          <polygon
            points="6,1 18,1 23,10.5 18,20 6,20 1,10.5"
            fill={results[i] === true ? "#FDB104" : "#FFFFFF"}
            stroke="#00245D"
            strokeWidth={i === current ? 2.5 : 1.5}
          />
          {results[i] === true && <path d="M8 11l3 3 6-7" stroke="#00245D" strokeWidth="2" fill="none" strokeLinecap="round" />}
        </svg>
      ))}
    </div>
  );
}

/** "Round 3 of 8" pill used above each game round. */
export function RoundLabel({ round, total }: { round: number; total: number }) {
  return (
    <p className="rounded-full bg-white px-4 py-1 text-base font-bold text-ink">
      Round {round} of {total}
    </p>
  );
}

/** End-of-game screen, matching the practice results ("All Done!!!"). Saves the result once, which adds honey. */
export function GameDone({ game, results, onPlayAgain }: { game: GameKind; results: boolean[]; onPlayAgain: () => void }) {
  const right = results.filter(Boolean).length;
  const { setHive } = useBuddy();
  const saved = useRef(false);
  useEffect(() => {
    if (saved.current) return;
    saved.current = true;
    void recordGameResult({ game, firstTryCorrect: right, rounds: results.length }).then(setHive);
  }, [game, right, results.length, setHive]);
  const message =
    right === results.length ? "Every word on the first try. Amazing!" : right >= results.length / 2 ? "Great work! Your hive is growing." : "Nice effort! Every game makes you stronger.";
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center card-pop rounded-[2.5rem] bg-white px-6 py-10 text-center">
      <CelebrationBurst className="-mt-4 mb-2" />
      <h2 tabIndex={-1} className="text-[2rem] font-bold text-ink">
        All Done!!!
      </h2>
      <p className="mt-2 text-2xl font-bold text-ink">
        {right} of {results.length} on the first try
      </p>
      <div className="mt-4">
        <HoneycombScore results={results} />
      </div>
      {right > 0 && (
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#FFF6DA] px-4 py-1 text-lg font-bold text-ink">
          <HoneyDropIcon size="1.6rem" />+{right} honey {right === 1 ? "drop" : "drops"} for your jar
        </p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <PillButton variant="gold" size="lg" onClick={onPlayAgain}>
          Play Again
        </PillButton>
        <PillLink href="/games" size="lg">
          More Games
        </PillLink>
        <PillLink href="/" size="lg" icon={<HouseIcon size="2rem" className="text-navy" />}>
          Home
        </PillLink>
      </div>
      <BuzzSays className="mt-10 w-full text-left" text={message} />
    </div>
  );
}
