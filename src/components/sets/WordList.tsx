"use client";

import { useSpeech } from "@/hooks/useSpeech";
import { cn } from "@/lib/cn";
import type { Language, SetWord } from "@/lib/types";
import { SpeakerIcon } from "../ui/Icons";

/** Read-only list of words as white pills with meaning and a speaker button. */
export function WordList({ words, language, className }: { words: SetWord[]; language: Language; className?: string }) {
  const speech = useSpeech();
  return (
    <ol className={cn("grid gap-3 md:grid-cols-2", className)}>
      {words.map((word, i) => (
        <li key={word.id} className="flex items-center gap-3 rounded-full border border-black bg-white py-2 pl-6 pr-2">
          <span className="w-8 text-lg font-bold text-ink" aria-hidden="true">
            {i + 1}.
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[1.35rem] font-bold text-ink" lang={language}>
              {word.text}
            </span>
            {word.definition && <span className="block text-base text-ink/85">{word.definition}</span>}
          </span>
          <button
            type="button"
            onClick={() => void speech.say(word.text, language)}
            disabled={!speech.available}
            aria-label={`Hear ${word.text}`}
            className="grid h-14 w-14 shrink-0 place-items-center rounded-full text-black hover:bg-black/5 disabled:opacity-40"
          >
            <SpeakerIcon size="2.2rem" />
          </button>
        </li>
      ))}
    </ol>
  );
}
