"use client";

import { PageShell } from "@/components/layout/PageShell";
import { HandHeading } from "@/components/ui/HandHeading";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { PillLink } from "@/components/ui/PillButton";
import { LoadingState } from "@/components/ui/Status";
import { useAsync } from "@/hooks/useAsync";
import { getRecommendations, PERSONALIZED_SOURCE_ID } from "@/services";

/**
 * Personalized Practice: shows which spelling patterns were tricky and the
 * related words selected from the word bank. No words are generated.
 */
export default function PersonalizedPage() {
  const { data, loading } = useAsync(async () => ({ rec: await getRecommendations() }), []);

  return (
    <PageShell title="Practice for you">
      {loading || !data ? (
        <LoadingState label="Looking at your recent practice…" />
      ) : data.rec.focusAreas.length === 0 ? (
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-2xl font-bold text-ink">Nothing tricky found yet!</p>
          <p className="mt-2 text-lg text-ink">Practice a word set or take the personalization test, then come back here.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <PillLink href="/onboarding" variant="gold">Take the personalization test</PillLink>
            <PillLink href="/my-words">Go to My words</PillLink>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-6xl">
          <p className="max-w-3xl text-xl text-ink">
            We looked at the words you found tricky and picked more words with the same spelling patterns from our word bank.
          </p>
          <section aria-labelledby="focus-heading" className="mt-8">
            <HandHeading id="focus-heading">What we noticed</HandHeading>
            <ul className="mt-4 grid gap-5 md:grid-cols-3">
              {data.rec.focusAreas.map((area) => (
                <li key={area.pattern.tag} className="card-pop rounded-[2.5rem] bg-white p-7 text-ink">
                  <h3 className="text-[1.45rem] font-bold leading-snug">{area.pattern.label}</h3>
                  <p className="mt-2 text-lg">{area.pattern.tip}</p>
                  <p className="mt-3 text-lg">
                    <span className="font-bold">Example:</span> {area.pattern.example}
                  </p>
                  <p className="mt-3 text-base text-ink/85">{area.reason}</p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="words-heading" className="mt-10">
            <HandHeading id="words-heading">Your practice words</HandHeading>
            <ul className="mt-4 flex flex-wrap gap-3">
              {data.rec.words.map((w) => (
                <li key={w.id} className="flex min-h-[4rem] flex-col justify-center rounded-full border border-black bg-white px-7 py-2 text-center">
                  <span className="text-[1.35rem] font-bold text-ink">{w.text}</span>
                  <span className="text-sm font-semibold text-ink/80">{data.rec.focusAreas.find((f) => f.pattern.tag === w.matchedPattern)?.pattern.label}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-10 flex justify-center">
            <PillLink href={`/practice/${PERSONALIZED_SOURCE_ID}`} variant="gold" size="lg" icon={<ArrowRightIcon size="2.2rem" />}>
              Start practice ({data.rec.words.length} words)
            </PillLink>
          </div>
        </div>
      )}
    </PageShell>
  );
}
