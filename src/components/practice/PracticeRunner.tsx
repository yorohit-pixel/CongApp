"use client";

import { useEffect, useRef } from "react";
import { useSettings } from "@/context/SettingsProvider";
import { usePracticeSession } from "@/hooks/usePracticeSession";
import { useSpeech } from "@/hooks/useSpeech";
import type { PracticeItem, WordAttempt } from "@/lib/types";
import { BeeTrack } from "../layout/BeeTrack";
import { IconControl } from "../ui/IconControl";
import { ArrowRightIcon, BulbIcon, CheckIcon, SpeakerIcon } from "../ui/Icons";
import { PillButton } from "../ui/PillButton";
import { AnswerPill } from "./AnswerPill";
import { FeedbackLine } from "./FeedbackLine";
import { HintPanel } from "./HintPanel";

/**
 * One-word-at-a-time spelling practice (designs 2, 4, 5, 6, 7).
 * Calls onFinish with every attempt when the last word is done.
 */
export function PracticeRunner({
  items,
  onFinish,
  instruction,
  allowHints = true,
}: {
  items: PracticeItem[];
  onFinish: (attempts: WordAttempt[], items: PracticeItem[]) => void;
  /** Overrides the prompt (used by the personalization test). */
  instruction?: string;
  allowHints?: boolean;
}) {
  const session = usePracticeSession(items);
  const { settings } = useSettings();
  const speech = useSpeech();
  const inputRef = useRef<HTMLInputElement>(null);
  const reported = useRef(false);
  const { current, item, progress } = session;

  // Report results once when the session finishes.
  useEffect(() => {
    if (session.finished && !reported.current) {
      reported.current = true;
      onFinish(session.attempts, session.items);
    }
    if (!session.finished) reported.current = false;
  }, [session.finished, session.attempts, session.items, onFinish]);

  // New word: focus the input and optionally say the word.
  useEffect(() => {
    if (!current) return;
    inputRef.current?.focus();
    if (settings.autoPlayWord) void speech.say(current.answer, current.language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  if (!current || session.finished) return null;

  const prompt =
    instruction ??
    (settings.showDefinitions && current.definition
      ? `Definition: ${current.definition}`
      : "Listen to the word, then type how it is spelled.");

  const handleNext = () => {
    session.next();
  };

  const hearWord = () => void speech.say(current.answer, current.language);
  const readOnly = item.status === "correct";

  return (
    <section aria-labelledby="practice-prompt" className="mx-auto flex max-w-[45.5rem] flex-col items-center">
      <p className="mb-4 rounded-full bg-white px-4 py-1 text-base font-bold text-ink">
        Word {progress.current} of {progress.total}
      </p>

      <h2 id="practice-prompt" className="max-w-[34rem] text-center text-[1.45rem] font-bold leading-snug text-ink">
        {prompt}
      </h2>

      <form
        className="mt-10 w-full lg:mt-16"
        onSubmit={(e) => {
          e.preventDefault();
          session.check();
        }}
      >
        <div className="relative w-full">
          <label htmlFor="answer" className="sr-only">
            Type the spelling of the word
          </label>
          <AnswerPill
            id="answer"
            ref={inputRef}
            state={item.status}
            value={item.typed}
            readOnly={readOnly}
            placeholder="type words here"
            onChange={(e) => session.setTyped(e.target.value)}
            onKeyDown={(e) => {
              // Enter checks the spelling; once it's right (or copied after a reveal), Enter moves on.
              if (e.key !== "Enter") return;
              e.preventDefault();
              if (readOnly || (item.status === "revealed" && item.feedback?.tone === "correct")) handleNext();
              else session.check();
            }}
            lang={current.language}
            aria-describedby="practice-prompt practice-feedback"
          />
          {/* Speaker + hint sit to the right of the pill on wide screens, below it otherwise */}
          <div className="mt-4 flex items-start justify-center gap-6 xl:absolute xl:left-full xl:top-1/2 xl:mt-0 xl:ml-6 xl:-translate-y-1/2 xl:gap-3">
            <IconControl
              icon={<SpeakerIcon size="4.4rem" />}
              label={speech.available ? "Hear the word" : "Sound is not available in this browser"}
              onClick={hearWord}
              disabled={!speech.available}
            />
            {allowHints && !item.hintOpen && (
              <IconControl
                icon={<BulbIcon size="3.4rem" />}
                label="Hint"
                showLabel
                onClick={session.toggleHint}
                aria-expanded={false}
                aria-controls="hint-panel"
              />
            )}
          </div>
        </div>

        {allowHints && item.hintOpen && (
          <div className="mt-6">
            <HintPanel
              item={current}
              audioAvailable={speech.available}
              onAudioHint={() => void speech.sayInChunks(current.answer, current.syllables, current.language)}
            />
            <p className="mt-2 text-center">
              <button type="button" onClick={session.toggleHint} aria-expanded className="min-h-11 px-3 text-base font-bold text-ink underline underline-offset-4">
                Hide hint
              </button>
            </p>
          </div>
        )}

        <div id="practice-feedback">
          <FeedbackLine feedback={item.feedback} className="mt-6" />
        </div>

        {item.status === "incorrect" && item.tries >= 2 && (
          <p className="mt-2 text-center">
            <PillButton onClick={session.reveal}>Show me the word</PillButton>
          </p>
        )}

        <div className="mt-6 flex items-center justify-center gap-8 sm:gap-16">
          <PillButton type="submit" size="lg" className="w-[11.25rem]" icon={<CheckIcon size="2.6rem" className="text-ink" />} disabled={readOnly}>
            check
          </PillButton>
          <PillButton
            size="lg"
            iconOnly
            className="w-[8.3rem]"
            onClick={handleNext}
            aria-label={progress.current === progress.total ? "Finish and see results" : "Next word"}
            icon={<ArrowRightIcon size="3.4rem" className="text-ink" />}
          />
        </div>
      </form>
      <BeeTrack done={progress.current - 1 + (readOnly ? 1 : 0)} total={progress.total} />
    </section>
  );
}
