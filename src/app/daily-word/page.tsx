"use client";

import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { ArrowRightIcon, BookmarkIcon, SpeakerIcon } from "@/components/ui/Icons";
import { PillButton, PillLink } from "@/components/ui/PillButton";
import { LoadingState, Notice } from "@/components/ui/Status";
import { useAsync } from "@/hooks/useAsync";
import { useSpeech } from "@/hooks/useSpeech";
import { getPattern } from "@/data/patterns";
import { DAILY_SOURCE_ID, getDailyWord, isBankWordSaved, saveBankWordToMyWords } from "@/services";

export default function DailyWordPage() {
  const speech = useSpeech();
  const { data, loading, setData } = useAsync(async () => {
    const daily = await getDailyWord();
    return { daily, saved: await isBankWordSaved(daily.word.id) };
  }, []);
  const [justSaved, setJustSaved] = useState(false);

  const word = data?.daily.word;
  const dateLabel = data
    ? new Date(`${data.daily.date}T12:00:00`).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })
    : "";

  return (
    <PageShell title="Daily Word" layout="focus">
      {loading || !word || !data ? (
        <LoadingState />
      ) : (
        <article className="mx-auto flex max-w-3xl flex-col items-center text-center" aria-labelledby="daily-word">
          <p className="text-xl font-bold text-ink">{dateLabel}</p>
          <div className="mt-6 flex w-full flex-col items-center card-pop rounded-[2.5rem] bg-white px-6 py-10">
            <h2 id="daily-word" className="text-[3.5rem] font-bold leading-none text-ink sm:text-[4.5rem]">
              {word.text}
            </h2>
            <p className="mt-3 text-2xl text-ink" aria-label={`Chunks: ${word.syllables.join(", ")}`}>
              {word.syllables.join(" · ")}
            </p>
            <button
              type="button"
              onClick={() => void speech.say(word.text)}
              disabled={!speech.available}
              className="mt-5 inline-flex min-h-14 items-center gap-3 rounded-full border border-black px-6 text-xl font-bold text-ink hover:bg-[#FFF6DA] disabled:opacity-40"
            >
              <SpeakerIcon size="2.2rem" className="text-black" />
              Hear It
            </button>
            {!speech.available && <p className="mt-2 text-base text-ink">Sound isn't available in this browser.</p>}
          </div>

          <dl className="mt-8 grid w-full gap-4 text-left sm:grid-cols-2">
            <div className="card-pop rounded-[2rem] bg-white p-6 sm:col-span-2">
              <dt className="text-lg font-bold text-ink/80">What it means ({word.partOfSpeech})</dt>
              <dd className="mt-1 text-2xl font-bold text-ink">{word.definition}</dd>
            </div>
            <div className="card-pop rounded-[2rem] bg-white p-6">
              <dt className="text-lg font-bold text-ink/80">Use It in a Sentence</dt>
              <dd className="mt-1 text-xl text-ink">{word.exampleSentence}</dd>
            </div>
            <div className="card-pop rounded-[2rem] bg-white p-6">
              <dt className="text-lg font-bold text-ink/80">Spelling Pattern</dt>
              <dd className="mt-1 text-xl text-ink">
                <span className="font-bold">{getPattern(word.patterns[0]).label}.</span> {getPattern(word.patterns[0]).tip}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <PillButton
              size="lg"
              disabled={data.saved}
              icon={<BookmarkIcon size="1.8rem" filled={data.saved} />}
              onClick={async () => {
                await saveBankWordToMyWords(word.id);
                setData({ ...data, saved: true });
                setJustSaved(true);
              }}
            >
              {data.saved ? "Saved" : "Save to My words"}
            </PillButton>
            <PillLink href={`/practice/${DAILY_SOURCE_ID}`} variant="gold" size="lg" icon={<ArrowRightIcon size="2rem" />}>
              Practice This Word
            </PillLink>
          </div>
          <div aria-live="polite" className="mt-4">
            {justSaved && <Notice tone="success">✓ Added to your “Saved words” set in My words.</Notice>}
          </div>
        </article>
      )}
    </PageShell>
  );
}
