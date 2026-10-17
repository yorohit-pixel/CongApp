import type { ReactNode } from "react";
import type { Badge, BadgeIcon } from "@/lib/badges";
import { cn } from "@/lib/cn";
import { BookIcon, CheckIcon, FlameIcon, GameIcon, HatIcon, HoneyDropIcon, StarIcon } from "../ui/Icons";

const ICONS: Record<BadgeIcon, (earned: boolean) => ReactNode> = {
  check: () => <CheckIcon size="2.6rem" />,
  book: () => <BookIcon size="2.8rem" />,
  star: () => <StarIcon size="2.8rem" />,
  flame: () => <FlameIcon size="2.8rem" />,
  honey: () => <HoneyDropIcon size="2.8rem" />,
  game: () => <GameIcon size="2.8rem" />,
  hat: () => <HatIcon size="2.8rem" />,
  bd: () => <span className="font-easy text-[1.9rem] font-bold leading-none">bd</span>,
};

/** Badges as honeycomb cells. Earned ones are gold with "✓ Earned"; locked ones are grey and say how to earn them. */
export function BadgeHive({ badges, compact = false }: { badges: Badge[]; compact?: boolean }) {
  const earned = badges.filter((b) => b.earned).length;
  // Compact (Profile) shows only earned badges; the Badges page shows them all.
  const shown = compact ? badges.filter((b) => b.earned).slice(0, 8) : badges;
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-lg font-bold text-ink">
          {earned} of {badges.length} badges earned
        </p>
        <div className="h-4 min-w-[8rem] flex-1 overflow-hidden rounded-full border-2 border-black bg-cream" aria-hidden="true">
          <div className="h-full bg-gold" style={{ width: `${(earned / badges.length) * 100}%` }} />
        </div>
      </div>
      <ul className={cn("mt-4 grid gap-4", compact ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5")}>
        {compact && shown.length === 0 && <li className="col-span-full text-lg text-ink">No badges yet. Finish a practice to earn your first one!</li>}
        {shown.map((badge) => (
          <li key={badge.id} className="flex flex-col items-center text-center">
            <div className="relative grid h-[5.5rem] w-24 place-items-center">
              <svg viewBox="0 0 100 88" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <polygon
                  points="25,2 75,2 98,44 75,86 25,86 2,44"
                  fill={badge.earned ? "#FDB104" : "#F1EEE4"}
                  stroke="#00245D"
                  strokeWidth="3"
                  strokeDasharray={badge.earned ? undefined : "8 6"}
                />
              </svg>
              <span aria-hidden="true" className={cn("relative", badge.earned ? "text-ink" : "text-ink opacity-35 grayscale")}>
                {ICONS[badge.icon](badge.earned)}
              </span>
            </div>
            <p className="mt-2 text-lg font-bold leading-tight text-ink">{badge.title}</p>
            {!compact && (
              <p className={cn("text-base text-ink", !badge.earned && "text-ink/80")}>
                {badge.earned ? "✓ Earned" : `Not yet: ${badge.howTo}`}
              </p>
            )}
            {!compact && !badge.earned && badge.progress && badge.progress.need > 1 && (
              <p className="text-sm font-bold text-ink">
                {badge.progress.have} of {badge.progress.need}
              </p>
            )}
            {compact && <p className="text-sm text-ink">{badge.earned ? "✓ Earned" : "Not yet"}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
