import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** The large white rounded card from the Home design (377 × 207 at 1440px). */
export const tileClasses =
  "card-pop tile-comb flex min-h-[8rem] sm:min-h-[11rem] flex-col items-center justify-center gap-1 rounded-[2.5rem] px-6 py-6 text-center text-ink lg:min-h-[13rem]";

export function Tile({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn(tileClasses, "bg-white", className)}>{children}</div>;
}

export function TileLink({
  href,
  children,
  className,
  dashed = false,
  "aria-label": ariaLabel,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  /** Dashed outline instead of white fill, for "add new" tiles. */
  dashed?: boolean;
  "aria-label"?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={cn(
        tileClasses,
        dashed ? "border-2 border-dashed border-ink/50" : "bg-white",
        "hover:outline hover:outline-[3px] hover:outline-gold",
        className,
      )}
    >
      {children}
    </Link>
  );
}

/** Grid matching the Home design: 3 columns at desktop with wide gutters. */
export function TileGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ul
      role="list"
      className={cn(
        "grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-8 lg:max-w-[1250px] lg:grid-cols-3 lg:gap-x-[57px] lg:gap-y-7",
        className,
      )}
    >
      {children}
    </ul>
  );
}
