"use client";

import { useEffect, useRef, useState } from "react";
import { useSpeech, useWordSpeaker } from "@/hooks/useSpeech";
import { cn } from "@/lib/cn";
import { checkSpelling } from "@/lib/spelling";
import type { AssessmentActivity, AssessmentItem, AssessmentResponse, HearAndTypeItem, SoundMatchItem } from "@/lib/types";
import { BuzzSays } from "../buddy/BuzzSays";
import { BeeTrack } from "../layout/BeeTrack";
import { AnswerPill } from "../practice/AnswerPill";
import { FeedbackLine } from "../practice/FeedbackLine";
import { IconControl } from "../ui/IconControl";
import { ArrowRightIcon, CheckIcon, SpeakerIcon } from "../ui/Icons";
import { PillButton } from "../ui/PillButton";
import type { Feedback } from "@/hooks/usePracticeSession";

export const SECTION_NAMES: Record<AssessmentActivity, string> = {
  "hear-and-type": "Spelling",
  "sound-match": "Sound Match",
};
const SECTION_ORDER: AssessmentActivity[] = ["hear-and-type", "sound-match"];
const SECTION_INTROS: Record<AssessmentActivity, string> = {
  "hear-and-type": "Section 1 is spelling. Listen to each word, then type it. The words start easy and get harder.",
  "sound-match": "Great spelling! Now it's time for sound match. Listen to a word, then pick the word that has the same sound.",
};
const UNIT: Record<AssessmentActivity, string> = { "hear-and-type": "Word", "sound-match": "Question" };

/**
 * Runs the personalization test one section at a time (Spelling, then Sound match),
 * one question at a time, easiest first. Buzz introduces each new section.
 */
export function AssessmentRunner({
  items,
  onComplete,
}: {
  items: AssessmentItem[];
  onComplete: (responses: AssessmentResponse[]) => void;
}) {
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  // The first section is introduced by the test intro screen; later sections get their own intro.
  const [started, setStarted] = useState<Set<AssessmentActivity>>(() => new Set([items[0]?.activity ?? "hear-and-type"]));
  const item = items[index];
  const headingRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (index > 0) headingRef.current?.focus();
  }, [index, started]);

  const record = (response: AssessmentResponse) => {
    const next = [...responses, response];
    setResponses(next);
    if (index + 1 >= items.length) onComplete(next);
    else setIndex(index + 1);
  };

  const sections = SECTION_ORDER.filter((s) => items.some((i) => i.activity === s));
  const sectionNumber = sections.indexOf(item.activity) + 1;
  const sectionItems = items.filter((i) => i.activity === item.activity);
  const numberInSection = sectionItems.indexOf(item) + 1;
  const doneInSection = numberInSection - 1;
  const showIntro = !started.has(item.activity);

  return (
    <div className="mx-auto max-w-[45.5rem]">
      <div className="text-center">
        <p ref={headingRef} tabIndex={-1} className="text-lg font-bold text-ink outline-none">
          Section {sectionNumber} of {sections.length}
          {!showIntro && `: ${SECTION_NAMES[item.activity]} · ${UNIT[item.activity]} ${numberInSection} of ${sectionItems.length}`}
        </p>
        {!showIntro && <ProgressCells total={sectionItems.length} done={doneInSection} />}
      </div>
      <div className="mt-8">
        {showIntro ? (
          <SectionIntro
            number={sectionNumber}
            activity={item.activity}
            count={sectionItems.length}
            onStart={() => setStarted((s) => new Set(s).add(item.activity))}
          />
        ) : (
          <>
            {item.activity === "hear-and-type" && <HearAndType key={item.id} item={item} onDone={record} />}
            {item.activity === "sound-match" && <SoundMatch key={item.id} item={item} onDone={record} />}
          </>
        )}
      </div>
      <BeeTrack done={index} total={items.length} label="questions" />
    </div>
  );
}

/** Shown before each section after the first. */
function SectionIntro({
  number,
  activity,
  count,
  onStart,
}: {
  number: number;
  activity: AssessmentActivity;
  count: number;
  onStart: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <h2 className="text-[1.8rem] font-bold text-ink">
        Section {number}: {SECTION_NAMES[activity]}
      </h2>
      <PillButton size="lg" variant="gold" className="mt-8 min-w-[12rem]" onClick={onStart} icon={<ArrowRightIcon size="2.4rem" />}>
        Start Section {number}
      </PillButton>
      <BuzzSays className="mt-12 w-full text-left" text={`${SECTION_INTROS[activity]} There ${count === 1 ? "is 1 question" : `are ${count} questions`}.`} />
    </div>
  );
}

/** A row of tiny honeycomb cells showing progress through the current section. */
function ProgressCells({ total, done }: { total: number; done: number }) {
  return (
    <div className="mt-3 flex justify-center gap-1.5" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <svg key={i} viewBox="0 0 24 21" className="h-5 w-6">
          <polygon points="6,1 18,1 23,10.5 18,20 6,20 1,10.5" fill={i < done ? "#FDB104" : i === done ? "#FFFFFF" : "transparent"} stroke={i <= done ? "#00245D" : "#00245D88"} strokeWidth="1.5" />
        </svg>
      ))}
    </div>
  );
}

function NextButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <PillButton size="lg" iconOnly className="w-[8.3rem]" onClick={onClick} aria-label={label} icon={<ArrowRightIcon size="3.4rem" className="text-ink" />} />
  );
}

/* ---------- Section 1: Spelling (design 1) ---------- */

function HearAndType({ item, onDone }: { item: HearAndTypeItem; onDone: (r: AssessmentResponse) => void }) {
  const speech = useWordSpeaker(item.answer, item.syllables);
  const [typed, setTyped] = useState("");
  const [state, setState] = useState<"idle" | "correct" | "incorrect">("idle");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const firstResult = useRef<boolean | null>(null);
  const firstTyped = useRef("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => inputRef.current?.focus(), []);

  const check = () => {
    if (!typed.trim()) {
      setFeedback({ tone: "info", message: "Type your spelling in the box first." });
      return;
    }
    const ok = checkSpelling(typed, item.answer).status !== "incorrect";
    if (firstResult.current === null) {
      firstResult.current = ok;
      firstTyped.current = typed.trim();
    }
    setState(ok ? "correct" : "incorrect");
    setFeedback(
      ok
        ? { tone: "correct", message: "Correct! Tap the arrow." }
        : { tone: "incorrect", message: "Thanks for trying! Tap the arrow to keep going." },
    );
  };

  const next = () => {
    if (firstResult.current === null) {
      if (!typed.trim()) {
        setFeedback({ tone: "info", message: "Have a try first — any spelling is okay!" });
        return;
      }
      firstResult.current = checkSpelling(typed, item.answer).status !== "incorrect";
      firstTyped.current = typed.trim();
    }
    // The first try is what's scored and what the recommender learns from.
    onDone({ itemId: item.id, activity: item.activity, patterns: item.patterns, correct: firstResult.current, response: firstTyped.current, answer: item.answer });
  };

  return (
    <form
      className="flex flex-col items-center"
      onSubmit={(e) => {
        e.preventDefault();
        check();
      }}
    >
      <h2 className="max-w-[34rem] text-center text-[1.45rem] font-bold leading-snug text-ink">
        Try your best to spell the words; we know some of them might be difficult. Good Luck!!!
      </h2>
      <p className="mt-2 text-lg text-ink">Tap the speaker to hear the word.</p>
      <div className="relative mt-10 w-full lg:mt-14">
        <label htmlFor="assessment-answer" className="sr-only">
          Type the Word You Hear
        </label>
        <AnswerPill
          ref={inputRef}
          id="assessment-answer"
          state={state}
          value={typed}
          placeholder="type words here"
          readOnly={state !== "idle"}
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            if (state === "idle") check();
            else next();
          }}
        />
        <div className="mt-4 flex justify-center xl:absolute xl:left-full xl:top-1/2 xl:mt-0 xl:ml-6 xl:-translate-y-1/2">
          <IconControl
            icon={<SpeakerIcon size="4.4rem" />}
            label={speech.available ? (speech.nextInParts ? "Hear the word in parts" : "Hear the word") : "Sound is not available in this browser"}
            disabled={!speech.available}
            onClick={speech.hear}
          />
        </div>
      </div>
      {!speech.available && (
        <div className="mt-3 text-center text-base text-ink">
          <p>Sound isn't working in this browser. Ask a grown-up to read the word to you.</p>
          <details className="mt-1">
            <summary className="cursor-pointer font-bold underline underline-offset-4">For a Grown-up Helper</summary>
            <p className="mt-1">Please read this word out loud: {item.answer}</p>
          </details>
        </div>
      )}
      <FeedbackLine feedback={feedback} className="mt-6" />
      <div className="mt-6 flex items-center justify-center gap-8 sm:gap-16">
        <PillButton type="submit" size="lg" className="w-[11.25rem]" disabled={state !== "idle"} icon={<CheckIcon size="2.6rem" className="text-ink" />}>
          check
        </PillButton>
        <NextButton onClick={next} label="Next question" />
      </div>
    </form>
  );
}

/* ---------- Section 2: Sound match ---------- */

function SoundMatch({ item, onDone }: { item: SoundMatchItem; onDone: (r: AssessmentResponse) => void }) {
  const speech = useSpeech();
  const [picked, setPicked] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const correct = picked === item.answer;

  return (
    <div className="flex flex-col items-center text-center">
      <h2 className="max-w-[34rem] text-[1.45rem] font-bold leading-snug text-ink">{item.prompt}</h2>
      <PillButton className="mt-4" disabled={!speech.available} onClick={() => void speech.say(item.targetWord)} icon={<SpeakerIcon size="1.8rem" />}>
        Hear “{item.targetWord}”
      </PillButton>
      <fieldset className="mt-8 w-full">
        <legend className="sr-only">Choose a Word</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          {item.choices.map((choice) => {
            const selected = picked === choice;
            return (
              <div key={choice} className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  aria-pressed={selected}
                  disabled={checked}
                  onClick={() => setPicked(choice)}
                  className={cn(
                    "min-h-[4.6rem] w-full rounded-full border px-6 text-[1.6rem] font-bold text-ink",
                    selected ? "border-[3px] border-black" : "border-black bg-white hover:bg-[#FFF6DA]",
                    selected && !checked && "bg-gold",
                    selected && checked && (correct ? "bg-correct" : "bg-incorrect"),
                  )}
                >
                  {selected && !checked && <span aria-hidden="true">✓ </span>}
                  {choice}
                </button>
                <button
                  type="button"
                  disabled={!speech.available}
                  onClick={() => void speech.say(choice)}
                  className="inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-base font-bold text-ink hover:bg-black/5 disabled:opacity-40"
                >
                  <SpeakerIcon size="1.3em" /> Hear “{choice}”
                </button>
              </div>
            );
          })}
        </div>
      </fieldset>
      <FeedbackLine feedback={feedback} className="mt-6" />
      <div className="mt-6 flex items-center justify-center gap-8 sm:gap-16">
        <PillButton
          size="lg"
          className="w-[11.25rem]"
          disabled={checked}
          icon={<CheckIcon size="2.6rem" className="text-ink" />}
          onClick={() => {
            if (!picked) return setFeedback({ tone: "info", message: "Tap a word first." });
            setChecked(true);
            setFeedback(
              correct
                ? { tone: "correct", message: `Yes! “${item.answer}” matches. Tap the arrow.` }
                : { tone: "incorrect", message: `Good try! The match was “${item.answer}”. Tap the arrow.` },
            );
          }}
        >
          check
        </PillButton>
        <NextButton
          label="Next question"
          onClick={() => {
            if (!picked) return setFeedback({ tone: "info", message: "Tap a word first." });
            onDone({ itemId: item.id, activity: item.activity, patterns: item.patterns, correct, response: picked, answer: item.answer });
          }}
        />
      </div>
    </div>
  );
}
