"use client";

import { useBuddy } from "@/context/BuddyProvider";
import { hello } from "@/lib/cheers";
import type { AssessmentSummary } from "@/lib/types";
import { BuzzSays } from "../buddy/BuzzSays";
import { CelebrationBurst } from "../decor/BeeDecor";
import { ArrowRightIcon, HouseIcon } from "../ui/Icons";
import { PillLink } from "../ui/PillButton";

export function AssessmentSummaryView({ summary }: { summary: AssessmentSummary }) {
  const { name } = useBuddy();
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
      <CelebrationBurst className="mb-2" />
      <h2 tabIndex={-1} className="text-[2rem] font-bold text-ink">
        All Done!!!
      </h2>
      <div className="mt-8 grid w-full gap-5 text-left md:grid-cols-2">
        <section className="rounded-[2.5rem] border-[5px] border-correct bg-white p-7" aria-labelledby="strengths-heading">
          <h3 id="strengths-heading" className="text-2xl font-bold text-ink">
            ✓ Things you're good at
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-lg text-ink">
            {summary.strengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-[2.5rem] border-[5px] border-gold bg-white p-7" aria-labelledby="practice-heading">
          <h3 id="practice-heading" className="text-2xl font-bold text-ink">
            ★ What we'll practice
          </h3>
          {summary.practiceAreas.length === 0 ? (
            <p className="mt-3 text-lg text-ink">Nothing stood out — we'll keep things fun and mixed!</p>
          ) : (
            <ul className="mt-3 space-y-3 text-lg text-ink">
              {summary.practiceAreas.map((p) => (
                <li key={p.tag}>
                  <span className="font-bold">{p.label}</span> — {p.tip}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      <p className="mt-6 max-w-2xl text-base text-ink/85">
        This check-in helps us choose practice words. It does not diagnose dyslexia or any other learning difference. If you have questions about reading, talk with a teacher or parent.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <PillLink href="/personalized" variant="gold" size="lg" icon={<ArrowRightIcon size="2rem" />}>
          See my practice words
        </PillLink>
        <PillLink href="/" size="lg" icon={<HouseIcon size="2rem" className="text-navy" />}>
          Home
        </PillLink>
      </div>
      <BuzzSays className="mt-12 w-full max-w-3xl text-left" text={`${hello(name)} Thank you for trying every question. Here's what we learned. Now let's go practice!`} />
    </div>
  );
}
