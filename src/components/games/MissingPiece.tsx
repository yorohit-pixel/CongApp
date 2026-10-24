"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSettings } from "@/context/SettingsProvider";
import { useWordSpeaker } from "@/hooks/useSpeech";
import type { Feedback } from "@/hooks/usePracticeSession";
import { cn } from "@/lib/cn";
import { makeMissingPiece, type MissingPiecePuzzle } from "@/lib/games";
import type { BankWord } from "@/lib/types";
import { BeeTrack } from "../layout/BeeTrack";
import { FeedbackLine } from "../practice/FeedbackLine";
import { IconControl } from "../ui/IconControl";
import { ArrowRightIcon, SpeakerIcon } from "../ui/Icons";
import { pillClasses } from "../ui/PillButton";
import { GameDone, HoneycombScore, RoundLabel } from "./GameParts";

/** "Missing Piece": hear a word, then pick the group of letters (a syllable) that fills the gap. */
export function MissingPiece({ words, onPlayAgain }: { words: BankWord[]; onPlayAgain: () => void }) {
  // Build every puzzle once. Harder words get one extra wrong choice.
  const rounds = useMemo(
    () =>
      words
        .map((word) => ({ word, puzzle: makeMissingPiece(word.text, word.syllables, word.difficulty >= 4 ? 4 : 3) }))
        .filter((r): r is { word: BankWord; puzzle: MissingPiecePuzzle } => r.puzzle !== null),
    [words],
  );
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const round = rounds[index];

  if (!round) return <GameDone game="missing-piece" results={results} onPlayAgain={onPlayAgain} />;

  return (
    <PieceRound
      key={round.word.id}
      word={round.word}
      puzzle={round.puzzle}
      round={index + 1}
      total={rounds.length}
      results={results}
      onDone={(firstTry) => {
        setResults((r) => [...r, firstTry]);
        setIndex((i) => i + 1);
      }}
    />
  );
}

function PieceRound({
  word,
  puzzle,
  round,
  total,
  results,
  onDone,
}: {
  word: BankWord;
  puzzle: MissingPiecePuzzle;
  round: number;
  total: number;
  results: boolean[];
  onDone: (firstTry: boolean) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const [wrong, setWrong] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const speaker = useWordSpeaker(word.text, word.syllables);
  const { settings } = useSettings();
  const nextRef = useRef<HTMLButtonElement>(null);
  const solved = picked === puzzle.missing;

  useEffect(() => {
    if (settings.autoPlayWord) void speaker.say(word.text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (solved) nextRef.current?.focus();
  }, [solved]);

  const choose = (piece: string) => {
    if (solved) return;
    setPicked(piece);
    if (piece === puzzle.missing) {
      setFeedback({ tone: "correct", message: `Yes! It's “${word.text}”.` });
    } else {
      setWrong((w) => [...w, piece]);
      setFeedback({
        tone: "incorrect",
        message: `Not quite yet. That would spell “${puzzle.before}${piece}${puzzle.after}”. Listen again and try another piece.`,
      });
    }
  };

  return (
    <section aria-labelledby="piece-prompt" className="mx-auto flex max-w-[45.5rem] flex-col items-center">
      <RoundLabel round={round} total={total} />
      <div className="mt-3">
        <HoneycombScore results={results} current={round - 1} />
      </div>
      <h2 id="piece-prompt" className="mt-6 text-center text-[1.45rem] font-bold text-ink">
        Listen to the word. Which piece is missing?
      </h2>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <p
          className={cn(
            "flex flex-wrap items-baseline justify-center rounded-[2rem] border border-black px-8 py-3 font-easy text-[2.2rem] font-bold tracking-[0.06em] text-ink sm:text-[2.8rem]",
            solved ? "bg-correct" : "bg-white",
          )}
          aria-label={solved ? word.text : `${puzzle.before} blank ${puzzle.after}`}
        >
          <span>{puzzle.before}</span>
          <span
            className={cn(
              "mx-1 inline-block min-w-[3.2ch] border-b-4 border-ink text-center",
              solved ? "" : "text-transparent",
            )}
          >
            {solved ? puzzle.missing : "?"}
          </span>
          <span>{puzzle.after}</span>
        </p>
        <IconControl
          icon={<SpeakerIcon size="3.6rem" />}
          label={speaker.available ? (speaker.nextInParts ? "Hear the word in parts" : "Hear the word") : "Sound is not available in this browser"}
          onClick={speaker.hear}
          disabled={!speaker.available}
        />
      </div>
      {settings.showDefinitions && word.definition && <p className="mt-3 text-center text-lg text-ink">Meaning: {word.definition}</p>}

      <div className="mt-8 flex flex-wrap justify-center gap-4" role="group" aria-label="Choose the missing piece">
        {puzzle.options.map((piece) => {
          const isWrong = wrong.includes(piece);
          return (
            <button
              key={piece}
              type="button"
              onClick={() => choose(piece)}
              disabled={solved || isWrong}
              className={cn(
                "min-h-20 min-w-[6.5rem] rounded-[1.6rem] border-2 border-black px-5 font-easy text-[2.2rem] font-bold leading-none text-ink disabled:cursor-default",
                solved && piece === puzzle.missing ? "bg-correct" : isWrong ? "bg-incorrect line-through decoration-2" : "bg-white hover:bg-[#FFF6DA]",
              )}
            >
              {piece}
              {isWrong && <span className="sr-only"> (not this one)</span>}
            </button>
          );
        })}
      </div>

      <FeedbackLine feedback={feedback} className="mt-6" />

      <button
        ref={nextRef}
        type="button"
        className={pillClasses("outline", "lg", "mt-4 w-[8.3rem]", true)}
        onClick={() => onDone(wrong.length === 0)}
        disabled={!solved}
        aria-label={round === total ? "Finish and see results" : "Next word"}
      >
        <ArrowRightIcon size="3.4rem" className="text-ink" />
      </button>
      <BeeTrack done={round - 1 + (solved ? 1 : 0)} total={total} label="rounds" />
    </section>
  );
}
