"use client";

import { useSettings } from "@/context/SettingsProvider";
import { cn } from "@/lib/cn";
import type { BackgroundTint, TextSize } from "@/lib/types";
import { ChoiceGroup } from "../ui/ChoiceGroup";
import { Toggle } from "../ui/Toggle";

export const TINTS: Array<{ value: BackgroundTint; label: string; swatch: string }> = [
  { value: "cream", label: "Cream", swatch: "#fdfaf0" },
  { value: "blue", label: "Blue", swatch: "#e3eefa" },
  { value: "yellow", label: "Yellow", swatch: "#fff6c7" },
  { value: "green", label: "Green", swatch: "#e4f4dc" },
  { value: "peach", label: "Peach", swatch: "#fde7d6" },
];

/** Swatch + name radio pills. The name is always shown, so colour is never the only cue. */
export function TintPicker({ className }: { className?: string }) {
  const { settings, updateSettings } = useSettings();
  return (
    <fieldset className={className}>
      <legend className="mb-1 text-xl font-bold text-ink">Page Colour</legend>
      <p className="mb-3 text-base text-ink/80">Some readers find words easier to see on a coloured page.</p>
      <div className="flex flex-wrap gap-3">
        {TINTS.map((tint) => {
          const selected = settings.backgroundTint === tint.value;
          return (
            <label
              key={tint.value}
              className={cn(
                "choice-pill relative inline-flex min-h-14 cursor-pointer items-center gap-2 rounded-full border px-5 text-lg font-bold text-ink",
                selected ? "border-2 border-black bg-gold" : "border-black bg-white hover:bg-[#FFF6DA]",
              )}
            >
              <input
                type="radio"
                name="background-tint"
                className="sr-only"
                checked={selected}
                onChange={() => updateSettings({ backgroundTint: tint.value })}
              />
              <span aria-hidden="true" className="h-7 w-7 rounded-full border-2 border-black" style={{ background: tint.swatch }} />
              {selected && <span aria-hidden="true">✓</span>}
              {tint.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Text size, easy-read font, spacing, page colour and motion — the "can you see it well?" settings. */
export function VisibilityControls() {
  const { settings, updateSettings } = useSettings();
  return (
    <>
      <ChoiceGroup<TextSize>
        name="text-size"
        legend="Text size"
        options={[
          { value: "normal", label: "A", ariaLabel: "Normal text" },
          { value: "large", label: "A+", ariaLabel: "Large text" },
          { value: "x-large", label: "A++", ariaLabel: "Extra large text" },
        ]}
        value={settings.textSize}
        onChange={(textSize) => updateSettings({ textSize })}
      />
      <TintPicker className="mt-6" />
      <div className="mt-4 divide-y divide-black/15">
        <Toggle
          id="easy-read"
          label="Easy-read letters"
          description="Uses a font with very clear letter shapes (b, d, p and q look different)."
          checked={settings.easyReadFont}
          onChange={(easyReadFont) => updateSettings({ easyReadFont })}
        />
        <Toggle
          id="extra-spacing"
          label="Extra space between letters"
          description="Adds room between letters, words and lines."
          checked={settings.extraSpacing}
          onChange={(extraSpacing) => updateSettings({ extraSpacing })}
        />
        <Toggle
          id="honeycomb-background"
          label="Honeycomb background"
          description="A faint honeycomb pattern behind the page. Turn it off for a plain page."
          checked={settings.honeycombBackground}
          onChange={(honeycombBackground) => updateSettings({ honeycombBackground })}
        />
        <Toggle
          id="reduce-motion"
          label="Less movement"
          description="Turns off moving effects."
          checked={settings.reduceMotion}
          onChange={(reduceMotion) => updateSettings({ reduceMotion })}
        />
      </div>
    </>
  );
}

/** Sample text that shows the current settings. */
export function SettingsPreview({ className }: { className?: string }) {
  return (
    <aside aria-labelledby="preview-heading" className={cn("rounded-[2.5rem] border border-black bg-white p-7", className)}>
      <h2 id="preview-heading" className="text-xl font-bold text-ink">
        Preview
      </h2>
      <p className="mt-3 text-lg text-ink">The bee buzzed past the big blue flower and landed on a daisy.</p>
      <p className="mt-3 font-hand text-3xl text-ink">My Word Hives</p>
      <div className="mt-4 rounded-2xl bg-cream p-4 text-lg font-bold text-ink">This is the page colour.</div>
    </aside>
  );
}
