"use client";

import { useCallback, useEffect, useState } from "react";
import { useSettings } from "@/context/SettingsProvider";
import { isSpeechAvailable, speak, speakInChunks, speakSyllables, stopSpeaking } from "@/services";
import type { Language } from "@/lib/types";

/** Speech helpers that use the student's speaking speed and Buzz's chosen voice. */
export function useSpeech() {
  const { settings } = useSettings();
  // Only "does this browser have speech at all". An interrupted word doesn't turn the buttons off.
  const [available, setAvailable] = useState(true);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    setAvailable(isSpeechAvailable());
    return () => stopSpeaking();
  }, []);

  const run = useCallback(async (play: () => Promise<boolean>) => {
    setSpeaking(true);
    try {
      return await play();
    } finally {
      setSpeaking(false);
    }
  }, []);

  const say = useCallback(
    (text: string, language: Language = "en") =>
      run(() => speak(text, { language, rate: settings.speechRate, voiceName: settings.voiceName })),
    [run, settings.speechRate, settings.voiceName],
  );

  const sayInChunks = useCallback(
    (text: string, syllables: string[] | undefined, language: Language = "en") =>
      run(() => speakInChunks(text, syllables, language, settings.voiceName)),
    [run, settings.voiceName],
  );

  const saySyllables = useCallback(
    (text: string, syllables: string[] | undefined, language: Language = "en") =>
      run(() => speakSyllables(text, syllables, language, settings.voiceName)),
    [run, settings.voiceName],
  );

  return { available, speaking, say, sayInChunks, saySyllables };
}

/** After this many taps on a word's speaker, Buzz says it one syllable at a time. */
export const TAPS_BEFORE_SYLLABLES = 3;

/**
 * The speaker button for a spelling word: taps 1–2 say the whole word,
 * tap 3 and after say it syllable by syllable. Resets for each new word.
 */
export function useWordSpeaker(word: string, syllables: string[] | undefined, language: Language = "en") {
  const speech = useSpeech();
  const [taps, setTaps] = useState(0);

  useEffect(() => setTaps(0), [word]);

  const hear = useCallback(() => {
    const tap = taps + 1;
    setTaps(tap);
    void (tap >= TAPS_BEFORE_SYLLABLES ? speech.saySyllables(word, syllables, language) : speech.say(word, language));
  }, [taps, word, syllables, language, speech]);

  /** True when the next tap will say the word in syllables. */
  const nextInParts = taps + 1 >= TAPS_BEFORE_SYLLABLES;
  return { ...speech, hear, nextInParts };
}
