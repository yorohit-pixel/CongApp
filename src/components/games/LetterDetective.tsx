"use client";

import { useEffect, useRef, useState } from "react";
import { useSettings } from "@/context/SettingsProvider";
import { useSpeech } from "@/hooks/useSpeech";
import type { Feedback } from "@/hooks/usePracticeSession";
import { cn } from "@/lib/cn";
import { hideLookAlikeLetter, LOOK_ALIKE_LETTERS, type LookAlikeLetter } from "@/lib/games";
import type { BankWord } from "@/lib/types";
import { BeeTrack } from "../layout/BeeTrack";
import { FeedbackLine } from "../practice/FeedbackLine";
import { IconControl } from "../ui/IconControl";
import { ArrowRightIcon, SpeakerIcon } from "../ui/Icons";
import { pillClasses } from "../ui/PillButton";
import { GameDone, HoneycombScore, RoundLabel } from "./GameParts";

/** "b or d?" — hear a word, then pick the look-alike letter that's missing. */
export function LetterDetective({ words, onPlayAgain }: { words: BankWord[]; onPlayAgain: () => void }) {
  const rounds = words.filter((w) => hideLookAlikeLetter(w.text));
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [picked, setPicked] = useState<LookAlikeLetter | null>(null);
  const [wrongTries, setWrongTries] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const speech = useSpeech();
  const { settings } = useSettings();
  const nextRef = useRef<HTMLButtonElement>(null);
  const word = rounds[index];
  const puzzle = word ? hideLookAlikeLetter(word.text)! : null;
  const solved = picked !== null && puzzle !== null && picked === puzzle.missing;

  useEffect(() => {
    if (word && settings.autoPlayWord) void speech.say(word.text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word?.id]);

  useEffect(() => {
    if (solved) nextRef.current?.focus();
  }, [solved]);

  if (!word || !puzzle) return <GameDone game="letter-detective" results={results} onPlayAgain={onPlayAgain} />;

  const choose = (letter: LookAlikeLetter) => {
    if (solved) return;
    setPicked(letter);
    if (letter === puzzle.missing) {
      setFeedback({ tone: "correct", message: `Yes! It's ${word.text}.` });
    } else {
      setWrongTries((n) => n + 1);
      setFeedback({ tone: "incorrect", message: `Not quite yet. That would spell “${puzzle.before}${letter}${puzzle.after}”. Listen again and try another letter.` });
    }
  };

  const next = () => {
    setResults((r) => [...r, wrongTries === 0]);
    setIndex((i) => i + 1);
    setPicked(null);
    setWrongTries(0);
    setFeedback(null);
  };

  return (
    <section aria-labelledby="detective-prompt" className="mx-auto flex max-w-[45.5rem] flex-col items-center">
      <RoundLabel round={index + 1} total={rounds.length} />
      <div className="mt-3">
        <HoneycombScore results={results} current={index} />
      </div>
      <h2 id="detective-prompt" className="mt-6 text-center text-[1.45rem] font-bold text-ink">
        Listen to the word. Which letter is missing?
      </h2>

      <div className="mt-6 flex items-center gap-4">
        <p
          className={cn(
            "rounded-full border border-black px-10 py-3 font-easy text-[3.2rem] font-bold tracking-[0.12em] text-ink",
            solved ? "bg-correct" : "bg-white",
          )}
          aria-label={solved ? word.text : `${puzzle.before} blank ${puzzle.after}`}
        >
          {puzzle.before}
          <span
            className={cn(
              "underline decoration-ink decoration-4 underline-offset-[0.12em]",
              !solved && "text-transparent",
            )}
          >
            {solved ? puzzle.missing : "?"}
          </span>
          {puzzle.after}
        </p>
        <IconControl
          icon={<SpeakerIcon size="3.6rem" />}
          label={speech.available ? "Hear the word" : "Sound is not available in this browser"}
          onClick={() => void speech.say(word.text)}
          disabled={!speech.available}
        />
      </div>
      {settings.showDefinitions && <p className="mt-3 text-center text-lg text-ink">Meaning: {word.definition}</p>}

      <div className="mt-8 flex gap-5" role="group" aria-label="Choose a letter">
        {LOOK_ALIKE_LETTERS.map((letter) => {
          const wrongPick = picked === letter && !solved;
          return (
            <button
              key={letter}
              type="button"
              onClick={() => choose(letter)}
              disabled={solved}
              aria-label={`Letter ${letter}`}
              className={cn(
                "grid h-24 w-24 place-items-center rounded-[1.6rem] border-2 border-black font-easy text-[3.4rem] font-bold leading-none text-ink disabled:cursor-default",
                solved && letter === puzzle.missing ? "bg-correct" : wrongPick ? "bg-incorrect" : "bg-white hover:bg-[#FFF6DA]",
              )}
            >
              {letter}
            </button>
          );
        })}
      </div>

      <FeedbackLine feedback={feedback} className="mt-6" />

      <button
        ref={nextRef}
        type="button"
        className={pillClasses("outline", "lg", "mt-4 w-[8.3rem]", true)}
        onClick={next}
        disabled={!solved}
        aria-label={index + 1 === rounds.length ? "Finish and see results" : "Next word"}
      >
        <ArrowRightIcon size="3.4rem" className="text-ink" />
      </button>
      <BeeTrack done={index + (solved ? 1 : 0)} total={rounds.length} label="rounds" />
    </section>
  );
}
