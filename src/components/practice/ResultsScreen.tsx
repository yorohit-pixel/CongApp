"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import type { WordAttempt } from "@/lib/types";
import { useBuddy } from "@/context/BuddyProvider";
import { BuzzSays } from "../buddy/BuzzSays";
import { CelebrationBurst } from "../decor/BeeDecor";
import { CheckIcon, CrossIcon, HoneyDropIcon, HouseIcon } from "../ui/Icons";
import { PillButton, PillLink } from "../ui/PillButton";

/**
 * "All Done!!!" screen (design 8): score box and buttons on the left,
 * a bordered, scrollable list of every word on the right.
 * Each row shows what the student typed and the correct spelling.
 */
export function ResultsScreen({
  attempts,
  onTryAgain,
  onPracticeMissed,
}: {
  attempts: WordAttempt[];
  onTryAgain: () => void;
  onPracticeMissed?: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { name } = useBuddy();
  const correct = attempts.filter((a) => a.correct).length;
  const missed = attempts.filter((a) => !a.correct);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const cheer =
    correct === attempts.length
      ? `${name ? `${name}, every` : "Every"} word right! You're a spelling superstar!`
      : correct / attempts.length >= 0.6
        ? `Great work${name ? `, ${name}` : ""}! Let's keep practicing the red words.`
        : "Good effort! Every try helps your brain learn these words. I'm proud of you!";

  return (
    <>
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,32rem)_minmax(0,45rem)] lg:justify-between lg:gap-12">
      <section aria-labelledby="results-heading" className="flex flex-col items-center lg:mt-4">
        <CelebrationBurst />
        <h2 ref={headingRef} id="results-heading" tabIndex={-1} className="text-[2rem] font-bold text-ink outline-none">
          All Done!!!
        </h2>
        <div className="mt-6 w-full rounded-[2rem] border border-black bg-white px-6 py-8 text-center">
          <p className="text-[1.6rem] font-bold text-ink">
            You spelled {correct} of {attempts.length} {attempts.length === 1 ? "word" : "words"}!
          </p>
          {correct > 0 && (
            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#FFF6DA] px-4 py-1 text-lg font-bold text-ink">
              <HoneyDropIcon size="1.6rem" />+{correct} honey {correct === 1 ? "drop" : "drops"} for your jar
            </p>
          )}
          {missed.length > 0 && (
            <p className="mt-3 text-lg text-ink">
              <span className="font-bold">Words to practice more:</span> {missed.map((m) => m.answer).join(", ")}
            </p>
          )}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-20">
          <PillButton size="lg" className="w-[11.25rem]" onClick={onTryAgain}>
            try again
          </PillButton>
          <PillLink href="/" size="lg" iconOnly className="w-24" aria-label="Go home" icon={<HouseIcon size="3.6rem" className="text-navy" />} />
        </div>
        {onPracticeMissed && missed.length > 0 && (
          <PillButton className="mt-5" onClick={onPracticeMissed}>
            Practice only the red words ({missed.length})
          </PillButton>
        )}
      </section>

      <section
        aria-labelledby="word-list-heading"
        className="rounded-[2.2rem] border-[3px] border-panel bg-cream px-4 py-5 sm:px-7"
      >
        <h2 id="word-list-heading" className="sr-only">
          Your Words
        </h2>
        <div className="mb-3 grid grid-cols-[2.5rem_1fr_1fr] gap-3 text-center text-base font-bold text-ink sm:grid-cols-[3rem_1fr_1fr] sm:gap-5" aria-hidden="true">
          <span />
          <span>You Typed</span>
          <span>Correct Spelling</span>
        </div>
        <ol className="results-scroll max-h-[34rem] space-y-4 overflow-y-auto pr-1" tabIndex={0} aria-label="Word results">
          {attempts.map((a, i) => (
            <li key={a.itemId + i} className="grid grid-cols-[2.5rem_1fr_1fr] items-center gap-3 sm:grid-cols-[3rem_1fr_1fr] sm:gap-5">
              <span className="text-[1.6rem] font-bold text-ink" aria-hidden="true">
                {i + 1}.
              </span>
              <span className="sr-only">
                Word {i + 1}: {a.correct ? "correct" : "needs practice"}. You typed {a.typed || "nothing"}. Correct spelling {a.answer}.
              </span>
              <ResultPill correct={a.correct} text={a.typed || "—"} showIcon />
              <ResultPill correct={a.correct} text={a.answer} />
            </li>
          ))}
        </ol>
      </section>
    </div>
    <BuzzSays className="mx-auto mt-12 max-w-3xl" text={cheer} />
    </>
  );
}

function ResultPill({ correct, text, showIcon }: { correct: boolean; text: string; showIcon?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex min-h-[4.2rem] items-center justify-center gap-2 break-all rounded-full border-[6px] bg-white px-3 text-center text-[1.3rem] font-bold text-ink",
        correct ? "border-correct" : "border-incorrect",
      )}
    >
      {showIcon &&
        (correct ? (
          <CheckIcon size="1.1em" className="shrink-0 text-[#2E7D32]" />
        ) : (
          <CrossIcon size="0.8em" className="shrink-0 text-[#C62828]" />
        ))}
      {text}
    </span>
  );
}
