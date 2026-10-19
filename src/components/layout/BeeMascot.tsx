import { cn } from "@/lib/cn";
import type { AccessoryId, BeeColor } from "@/lib/types";
import { BeeAccessories } from "./BeeAccessories";

/** Body / stripe / wing colours for each bee buddy colour. The header bee is always gold. */
export const BEE_COLORS: Record<BeeColor, { label: string; body: string; stripes: string; wings: string }> = {
  gold: { label: "Honey Gold", body: "#FDB104", stripes: "#2F497B", wings: "#2F497B" },
  navy: { label: "Night Blue", body: "#2F497B", stripes: "#FDB104", wings: "#8FB3E8" },
  green: { label: "Leaf Green", body: "#7ED957", stripes: "#2F497B", wings: "#2F497B" },
  pink: { label: "Flower Pink", body: "#FF9EC7", stripes: "#2F497B", wings: "#2F497B" },
  purple: { label: "Lavender", body: "#B79CFF", stripes: "#2F497B", wings: "#2F497B" },
};

/** The large striped bee that sits on the top-left of every page header (and Buzz, the bee buddy). */
export function BeeMascot({
  className,
  color = "gold",
  wearing = [],
}: {
  className?: string;
  color?: BeeColor;
  /** Accessories bought in the honey shop. */
  wearing?: AccessoryId[];
}) {
  const c = BEE_COLORS[color];
  return (
    <svg viewBox="0 0 230 200" className={cn("overflow-visible", className)} aria-hidden="true" focusable="false">
      {/* capes and robes go behind everything */}
      {wearing.length > 0 && <BeeAccessories wearing={wearing} part="back" />}
      {/* wings */}
      <ellipse cx="74" cy="34" rx="17" ry="32" transform="rotate(-22 74 34)" fill={c.wings} />
      <ellipse cx="112" cy="27" rx="15" ry="29" transform="rotate(14 112 27)" fill={c.wings} />
      {/* body */}
      <path
        d="M18 120c-6-40 24-70 74-76 46-6 92-6 116 14 22 18 22 56 2 78-22 24-62 34-106 36-48 2-80-14-86-52z"
        fill={c.body}
      />
      {/* stripes, slightly overshooting the body like the hand-drawn original */}
      <g stroke={c.stripes} strokeWidth="5.5" strokeLinecap="round" fill="none">
        <path d="M44 66c-16 26-16 64 4 104" />
        <path d="M68 52c-16 34-16 82 6 140" />
        <path d="M95 46c-16 38-14 92 10 144" />
        <path d="M124 44c-14 38-12 90 10 140" />
        <path d="M152 48c-12 36-10 80 8 124" />
      </g>
      {/* eyes */}
      <circle cx="178" cy="96" r="6" fill={c.stripes} />
      <circle cx="202" cy="90" r="6" fill={c.stripes} />
      {wearing.length > 0 && <BeeAccessories wearing={wearing} />}
    </svg>
  );
}
