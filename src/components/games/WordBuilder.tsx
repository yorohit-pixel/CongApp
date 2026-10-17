"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSettings } from "@/context/SettingsProvider";
import { useSpeech } from "@/hooks/useSpeech";
import type { Feedback } from "@/hooks/usePracticeSession";
import { cn } from "@/lib/cn";
import { scrambleTiles } from "@/lib/games";
import type { BankWord } from "@/lib/types";
import { BeeTrack } from "../layout/BeeTrack";
import { FeedbackLine } from "../practice/FeedbackLine";
import { IconControl } from "../ui/IconControl";
import { ArrowRightIcon, SpeakerIcon } from "../ui/Icons";
import { PillButton, pillClasses } from "../ui/PillButton";
import { GameDone, HoneycombScore, RoundLabel } from "./GameParts";

/** "Build the word" — hear a word, then tap the letter tiles in the right order. */
export function WordBuilder({ words, onPlayAgain }: { words: BankWord[]; onPlayAgain: () => void }) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const word = words[index];

  if (!word) return <GameDone game="word-builder" results={results} onPlayAgain={onPlayAgain} />;

  return (
    <BuildRound
      key={word.id}
      word={word}
      round={index + 1}
      total={words.length}
      results={results}
      onDone={(firstTry) => {
        setResults((r) => [...r, firstTry]);
        setIndex((i) => i + 1);
      }}
    />
  );
}

function BuildRound({
  word,
  round,
  total,
  results,
  onDone,
}: {
  word: BankWord;
  round: number;
  total: number;
  results: boolean[];
  onDone: (firstTry: boolean) => void;
}) {
  const tiles = useMemo(() => scrambleTiles(word.text), [word.text]);
  const [placed, setPlaced] = useState<string[]>([]); // tile ids, in order
  const [wrongTries, setWrongTries] = useState(0);
  const [status, setStatus] = useState<"building" | "correct" | "incorrect" | "shown">("building");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const speech = useSpeech();
  const { settings } = useSettings();
  const nextRef = useRef<HTMLButtonElement>(null);
  const tileById = new Map(tiles.map((t) => [t.id, t]));
  const built = placed.map((id) => tileById.get(id)!.letter).join("");
  const finished = status === "correct" || status === "shown";

  useEffect(() => {
    if (settings.autoPlayWord) void speech.say(word.text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (finished) nextRef.current?.focus();
  }, [finished]);

  const place = (id: string) => {
    if (status !== "building" || placed.includes(id)) return;
    const next = [...placed, id];
    setPlaced(next);
    if (next.length < tiles.length) return;
    const attempt = next.map((tid) => tileById.get(tid)!.letter).join("");
    if (attempt === word.text) {
      setStatus("correct");
      setFeedback({ tone: "correct", message: `You built “${word.text}”!` });
    } else {
      setStatus("incorrect");
      setWrongTries((n) => n + 1);
      setFeedback({ tone: "incorrect", message: "Not quite yet. Tap “Try again” and listen to the word one more time." });
    }
  };

  const undo = () => {
    if (status !== "building") return;
    setPlaced((p) => p.slice(0, -1));
  };

  const retry = () => {
    setPlaced([]);
    setStatus("building");
    setFeedback(null);
  };

  const showMe = () => {
    // The slots spell the word out directly once it's shown; every tile counts as used.
    setPlaced(tiles.map((t) => t.id));
    setStatus("shown");
    setFeedback({ tone: "info", message: `The word is “${word.text}”. Have a good look, then tap the arrow.` });
  };

  return (
    <section aria-labelledby="builder-prompt" className="mx-auto flex max-w-[45.5rem] flex-col items-center">
      <RoundLabel round={round} total={total} />
      <div className="mt-3">
        <HoneycombScore results={results} current={round - 1} />
      </div>
      <div className="mt-6 flex items-center gap-3">
        <h2 id="builder-prompt" className="text-center text-[1.45rem] font-bold text-ink">
          Listen, then tap the letters in order.
        </h2>
        <IconControl
          icon={<SpeakerIcon size="3.4rem" />}
          label={speech.available ? "Hear the word" : "Sound is not available in this browser"}
          onClick={() => void speech.say(word.text)}
          disabled={!speech.available}
        />
      </div>
      {settings.showDefinitions && <p className="mt-2 text-center text-lg text-ink">Meaning: {word.definition}</p>}

      {/* Answer slots */}
      <div
        className={cn(
          "mt-6 flex min-h-[5.5rem] flex-wrap justify-center gap-2 rounded-full border border-black px-6 py-3",
          status === "correct" ? "bg-correct" : status === "incorrect" ? "bg-incorrect" : "bg-white",
        )}
        aria-label={built ? `Your word so far: ${Array.from(built).join(" ")}` : "Your word is empty"}
        role="status"
      >
        {Array.from({ length: tiles.length }, (_, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="grid h-16 w-12 place-items-center border-b-4 border-ink font-easy text-[2.4rem] font-bold text-ink"
          >
            {status === "shown" ? word.text[i] : built[i] ?? ""}
          </span>
        ))}
      </div>

      {/* Letter tiles */}
      <div className="mt-6 flex flex-wrap justify-center gap-3" role="group" aria-label="Letter tiles">
        {tiles.map((tile) => {
          const used = placed.includes(tile.id);
          return (
            <button
              key={tile.id}
              type="button"
              onClick={() => place(tile.id)}
              disabled={used || status !== "building"}
              aria-label={`Letter ${tile.letter}`}
              className={cn(
                "grid h-[4.6rem] w-[4.6rem] place-items-center rounded-[1.3rem] border-2 border-black font-easy text-[2.4rem] font-bold text-ink",
                used ? "border-dashed bg-transparent text-transparent" : "bg-gold hover:bg-[#F2A400]",
              )}
            >
              {tile.letter}
            </button>
          );
        })}
      </div>

      <FeedbackLine feedback={feedback} className="mt-6" />

      <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
        {status === "building" && (
          <PillButton onClick={undo} disabled={placed.length === 0}>
            Undo
          </PillButton>
        )}
        {status === "incorrect" && (
          <PillButton variant="gold" onClick={retry}>
            Try again
          </PillButton>
        )}
        {status === "incorrect" && wrongTries >= 2 && <PillButton onClick={showMe}>Show me the word</PillButton>}
        <button
          ref={nextRef}
          type="button"
          className={pillClasses("outline", "lg", "w-[8.3rem]", true)}
          onClick={() => onDone(wrongTries === 0 && status === "correct")}
          disabled={!finished}
          aria-label={round === total ? "Finish and see results" : "Next word"}
        >
          <ArrowRightIcon size="3.4rem" className="text-ink" />
        </button>
      </div>
      <BeeTrack done={round - 1 + (finished ? 1 : 0)} total={total} label="rounds" />
    </section>
  );
}
