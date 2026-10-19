"use client";

import type { ReactNode } from "react";
import { useBuddy } from "@/context/BuddyProvider";
import { useSpeech } from "@/hooks/useSpeech";
import { cn } from "@/lib/cn";
import { BeeMascot } from "../layout/BeeMascot";
import { SpeakerIcon } from "../ui/Icons";

/**
 * Buzz, the student's bee buddy, saying something in a speech bubble.
 * "Read it to me" says the bubble out loud, so a child who can't read it yet still gets the message.
 */
export function BuzzSays({
  text,
  children,
  size = "md",
  className,
}: {
  /** What Buzz says. Also what gets read aloud. */
  text: string;
  /** Optional extra content under the text (links, buttons). */
  children?: ReactNode;
  size?: "md" | "lg";
  className?: string;
}) {
  const { beeColor, wearing } = useBuddy();
  const speech = useSpeech();
  return (
    <div className={cn("flex items-center gap-3 sm:gap-5", className)}>
      {/* Buzz on a honey hexagon */}
      <div className={cn("relative grid shrink-0 place-items-center", size === "lg" ? "w-28 sm:w-36" : "w-20 sm:w-24")}>
        <svg viewBox="0 0 100 88" className="absolute inset-x-0 top-1/2 h-auto w-full -translate-y-1/2" aria-hidden="true">
          <polygon points="25,2 75,2 98,44 75,86 25,86 2,44" fill="#FDB104" fillOpacity="0.28" stroke="#FDB104" strokeWidth="3" />
        </svg>
        <BeeMascot color={beeColor} wearing={wearing} className="relative h-auto w-[86%]" />
      </div>
      <div className="relative min-w-0 flex-1 rounded-[2rem] border-2 border-black bg-white px-5 py-4 sm:px-7">
        {/* bubble tail pointing at Buzz */}
        <span
          aria-hidden="true"
          className="absolute -left-[11px] top-1/2 h-5 w-5 -translate-y-1/2 rotate-45 border-b-2 border-l-2 border-black bg-white"
        />
        <p className={cn("font-bold text-ink", size === "lg" ? "text-[1.45rem]" : "text-xl")}>
          <span className="sr-only">Buzz says: </span>
          {text}
        </p>
        {children}
        {speech.available && (
          <button
            type="button"
            onClick={() => void speech.say(text)}
            className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-base font-bold text-ink underline underline-offset-4 hover:bg-black/5"
          >
            <SpeakerIcon size="1.4rem" />
            Read It to Me
          </button>
        )}
      </div>
    </div>
  );
}
