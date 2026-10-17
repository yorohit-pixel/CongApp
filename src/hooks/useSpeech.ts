"use client";

import { useCallback, useEffect, useState } from "react";
import { useSettings } from "@/context/SettingsProvider";
import { isSpeechAvailable, speak, speakInChunks, stopSpeaking } from "@/services";
import type { Language } from "@/lib/types";

/** Speech helpers that use the student's speaking speed and Buzz's chosen voice. */
export function useSpeech() {
  const { settings } = useSettings();
  const [available, setAvailable] = useState(true);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    setAvailable(isSpeechAvailable());
    return () => stopSpeaking();
  }, []);

  const say = useCallback(
    async (text: string, language: Language = "en") => {
      setSpeaking(true);
      const ok = await speak(text, { language, rate: settings.speechRate, voiceName: settings.voiceName });
      setSpeaking(false);
      if (!ok) setAvailable(false);
      return ok;
    },
    [settings.speechRate, settings.voiceName],
  );

  const sayInChunks = useCallback(
    async (text: string, syllables: string[] | undefined, language: Language = "en") => {
      setSpeaking(true);
      const ok = await speakInChunks(text, syllables, language, settings.voiceName);
      setSpeaking(false);
      if (!ok) setAvailable(false);
      return ok;
    },
    [settings.voiceName],
  );

  return { available, speaking, say, sayInChunks };
}
