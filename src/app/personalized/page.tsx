"use client";

import { PageShell } from "@/components/layout/PageShell";
import { HandHeading } from "@/components/ui/HandHeading";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { PillLink } from "@/components/ui/PillButton";
import { ErrorState, LoadingState } from "@/components/ui/Status";
import { useAsync } from "@/hooks/useAsync";
import { getRecommendations, PERSONALIZED_SOURCE_ID } from "@/services";

/**
 * Personalized Practice: shows which spelling patterns were tricky and the
 * related words selected from the word bank. No words are generated.
 * With the backend on, this is the current 10-word list from the recommender.
 */
export default function PersonalizedPage() {
  const { data, loading, error } = useAsync(async () => ({ rec: await getRecommendations() }), []);
  const setNumber = data?.rec.setNumber;

  return (
    <PageShell title={setNumber ? `Word list ${setNumber}` : "Practice for you"}>
      {error ? (
        <ErrorState message={error} action={<PillLink href="/">Go home</PillLink>} />
      ) : loading || !data ? (
        <LoadingState label="Looking at your recent practice…" />
      ) : data.rec.words.length === 0 ? (
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
            {setNumber
              ? setNumber === 1
                ? "Your first 10 words were picked just for you. Spell them all, and Buzz will use your answers to pick your next 10."
                : `Your 10 words were picked from your answers in list ${setNumber - 1}. Spell them all, and Buzz will use your answers to pick your next 10.`
              : "We looked at the words you found tricky and picked more words with the same spelling patterns from our word bank."}
          </p>
          {data.rec.focusAreas.length > 0 && (
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
          )}

          {/* The words themselves stay hidden until practice, so seeing them can't give the spelling away. */}
          <p className="mt-10 text-center text-xl font-bold text-ink">
            {data.rec.words.length} words are waiting in your hive. Listen to each one and spell it!
          </p>

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
