"use client";

import { useBuddy } from "@/context/BuddyProvider";
import { cn } from "@/lib/cn";
import type { BeeColor } from "@/lib/types";
import { BEE_COLORS, BeeMascot } from "../layout/BeeMascot";

/** "Pick Buzz's colour": a little bee for each colour, with its name and a ✓ on the chosen one. */
export function BeeColorPicker() {
  const { beeColor, setBeeColor, wearing } = useBuddy();
  return (
    <fieldset>
      <legend className="mb-3 text-lg font-bold text-ink">Pick Buzz's colour</legend>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-3">
        {(Object.keys(BEE_COLORS) as BeeColor[]).map((color) => {
          const selected = beeColor === color;
          return (
            <label
              key={color}
              className={cn(
                "choice-pill flex cursor-pointer flex-col items-center gap-1 rounded-[1.5rem] border px-2 py-3 text-center text-base font-bold text-ink",
                selected ? "border-2 border-black bg-gold" : "border-black bg-white hover:bg-[#FFF6DA]",
              )}
            >
              <input type="radio" name="bee-color" className="sr-only" checked={selected} onChange={() => setBeeColor(color)} />
              <BeeMascot color={color} wearing={wearing} className="h-auto w-14" />
              <span>
                {selected && <span aria-hidden="true">✓ </span>}
                {BEE_COLORS[color].label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
