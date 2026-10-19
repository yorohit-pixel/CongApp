"use client";

import { useEffect, useState } from "react";
import { useSettings } from "@/context/SettingsProvider";
import { cn } from "@/lib/cn";
import { getVoiceOptions, speak, type VoiceOption } from "@/services";

const SAMPLE = "Hi! I'm Buzz. Let's practice some words together!";

/** "Buzz's voice": the browser's English voices, friendliest first. Choosing one plays a sample. */
export function VoicePicker({ className }: { className?: string }) {
  const { settings, updateSettings } = useSettings();
  const [voices, setVoices] = useState<VoiceOption[] | null>(null);

  useEffect(() => {
    void getVoiceOptions().then(setVoices);
  }, []);

  if (voices === null) return null;
  if (voices.length === 0) return <p className={cn("text-base text-ink", className)}>This browser doesn't offer any voices to choose from.</p>;

  const choose = (voiceName: string | null) => {
    updateSettings({ voiceName });
    void speak(SAMPLE, { rate: settings.speechRate, voiceName });
  };

  const options: Array<{ value: string | null; label: string; recommended: boolean }> = [
    { value: null, label: "Automatic", recommended: false },
    ...voices.map((v) => ({ value: v.name, label: v.label, recommended: v.recommended })),
  ];

  return (
    <fieldset className={className}>
      <legend className="mb-1 text-xl font-bold text-ink">Buzz's Voice</legend>
      <p className="mb-3 text-base text-ink/80">Tap a voice to hear it. “Automatic” picks the friendliest voice on this device.</p>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const selected = settings.voiceName === option.value;
          return (
            <label
              key={option.value ?? "auto"}
              className={cn(
                "choice-pill relative inline-flex min-h-14 cursor-pointer flex-col items-center justify-center rounded-full border px-5 py-1 text-lg font-bold leading-tight text-ink",
                selected ? "border-2 border-black bg-gold" : "border-black bg-white hover:bg-[#FFF6DA]",
              )}
            >
              <input type="radio" name="buzz-voice" className="sr-only" checked={selected} onChange={() => choose(option.value)} />
              <span>
                {selected && <span aria-hidden="true">✓ </span>}
                {option.label}
              </span>
              {option.recommended && <span className="text-sm font-semibold">★ kid-friendly</span>}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
