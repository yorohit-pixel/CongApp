"use client";

import { BuzzSays } from "@/components/buddy/BuzzSays";
import { PageShell } from "@/components/layout/PageShell";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { PillLink } from "@/components/ui/PillButton";
import { LoadingState } from "@/components/ui/Status";
import { useAsync } from "@/hooks/useAsync";
import { DAILY_SOURCE_ID, getDailyChallenge } from "@/services";

const LEVELS = ["Easy", "Medium", "Hard"];

/**
 * Daily Words: today's spelling pattern and 3 words that use it, easy to hard.
 * The words are not shown here. The student hears and spells them in practice.
 */
export default function DailyWordPage() {
  const { data: daily, loading } = useAsync(() => getDailyChallenge(), []);

  const dateLabel = daily
    ? new Date(`${daily.date}T12:00:00`).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })
    : "";
  // The pattern's example words must not give away today's words.
  // (e.g. hide "write, wrap" when one of today's words is "writer").
  const todays = daily?.words.map((w) => w.text.toLowerCase()) ?? [];
  const exampleWords = daily?.pattern.example.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 2) ?? [];
  const showExample = daily ? !exampleWords.some((e) => todays.some((t) => t.includes(e) || e.includes(t))) : false;

  return (
    <PageShell title="Daily Words" layout="focus">
      {loading || !daily ? (
        <LoadingState />
      ) : (
        <article className="mx-auto flex max-w-3xl flex-col items-center text-center" aria-labelledby="daily-heading">
          <p className="text-xl font-bold text-ink">{dateLabel}</p>
          <div className="mt-6 flex w-full flex-col items-center card-pop rounded-[2.5rem] bg-white px-6 py-10">
            <p className="text-lg font-bold text-ink/80">Today's spelling pattern</p>
            <h2 id="daily-heading" className="mt-1 text-[2.4rem] font-bold leading-tight text-ink sm:text-[3rem]">
              {daily.pattern.label}
            </h2>
            <p className="mt-3 max-w-xl text-xl text-ink">{daily.pattern.tip}</p>
            {showExample && daily.pattern.example !== "—" && (
              <p className="mt-2 text-lg text-ink">
                <span className="font-bold">Example:</span> {daily.pattern.example}
              </p>
            )}
          </div>

          <h3 className="mt-8 text-2xl font-bold text-ink">{daily.words.length} mystery words, getting harder</h3>
          <ol className="mt-4 flex flex-wrap justify-center gap-4">
            {daily.words.map((word, i) => (
              <li key={word.id} className="flex flex-col items-center">
                <svg viewBox="0 0 100 88" className="h-[5.5rem] w-24" aria-hidden="true">
                  <polygon points="25,2 75,2 98,44 75,86 25,86 2,44" fill={i === 0 ? "#FFE8A3" : i === 1 ? "#FDB104" : "#E09500"} stroke="#00245D" strokeWidth="3" />
                  <text x="50" y="58" textAnchor="middle" fontSize="40" fontWeight="800" fill="#00245D">
                    ?
                  </text>
                </svg>
                <span className="mt-1 text-lg font-bold text-ink">
                  Word {i + 1}: {LEVELS[i] ?? "Hard"}
                </span>
              </li>
            ))}
          </ol>

          <PillLink href={`/practice/${DAILY_SOURCE_ID}`} variant="gold" size="lg" className="mt-8" icon={<ArrowRightIcon size="2rem" />}>
            Try Today's Words
          </PillLink>
          <BuzzSays
            className="mt-12 w-full text-left"
            text={`Today's words all use the same spelling pattern: ${daily.pattern.label}. Listen to each one, then spell it. They start easy and get harder!`}
          />
        </article>
      )}
    </PageShell>
  );
}
