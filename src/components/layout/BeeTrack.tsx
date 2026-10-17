"use client";

import { useBuddy } from "@/context/BuddyProvider";
import { BeeMascot } from "./BeeMascot";

/**
 * Progress bar fixed to the bottom of lesson screens: Buzz flies along a
 * honeycomb track toward a flower as each word is finished.
 * The bee's move is a short slide (switched off by "Less movement").
 */
export function BeeTrack({ done, total, label = "words" }: { done: number; total: number; label?: string }) {
  const { beeColor, wearing } = useBuddy();
  const safeTotal = Math.max(total, 1);
  const pct = Math.min(100, Math.round((done / safeTotal) * 100));
  const finished = done >= total;
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-black bg-white">
      <div
        className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2 sm:gap-5 sm:px-8"
        role="progressbar"
        aria-label="Lesson progress"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        aria-valuetext={`${done} of ${total} ${label} done`}
      >
        <p className="hidden w-28 shrink-0 text-base font-bold leading-tight text-ink sm:block" aria-hidden="true">
          {finished ? "All done!" : `${done} of ${total} ${label}`}
        </p>

        {/* Track with one honeycomb cell per word */}
        <div className="relative h-16 flex-1">
          <div className="absolute inset-x-0 top-[44px] h-3 rounded-full border-2 border-black bg-cream" />
          <div
            className="bee-track-fill absolute left-0 top-[44px] h-3 rounded-full border-2 border-black bg-gold"
            style={{ width: `${pct}%` }}
          />
          {/* Cell i marks the end of word i, so the bee lands on the last finished word. */}
          {Array.from({ length: total }, (_, i) => (
            <svg
              key={i}
              viewBox="0 0 24 21"
              className="absolute top-[40px] h-5 w-5 -translate-x-1/2"
              style={{ left: `${((i + 1) / safeTotal) * 100}%` }}
              aria-hidden="true"
            >
              <polygon points="6,1 18,1 23,10.5 18,20 6,20 1,10.5" fill={i < done ? "#FDB104" : "#FFFFFF"} stroke="#00245D" strokeWidth="2" />
            </svg>
          ))}
          {/* Buzz */}
          <div className="bee-track-bee absolute top-0 -translate-x-1/2" style={{ left: `${pct}%` }} aria-hidden="true">
            <BeeMascot color={beeColor} wearing={wearing} className="h-auto w-14" />
          </div>
        </div>

        {/* Finish: a flower */}
        <svg viewBox="0 0 48 48" className="h-12 w-12 shrink-0" aria-hidden="true">
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <ellipse key={deg} cx="24" cy="12" rx="7" ry="11" fill={finished ? "#FF9EC7" : "#FFFFFF"} stroke="#00245D" strokeWidth="2" transform={`rotate(${deg} 24 24)`} />
          ))}
          <circle cx="24" cy="24" r="7" fill="#FDB104" stroke="#00245D" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}
