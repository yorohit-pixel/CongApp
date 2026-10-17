import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Black line-icon control with an optional label underneath
 * (the speaker and the "Hint" bulb in the practice designs).
 */
export function IconControl({
  icon,
  label,
  showLabel = false,
  className,
  ...rest
}: {
  icon: ReactNode;
  label: string;
  showLabel?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label={showLabel ? undefined : label}
      className={cn(
        "inline-flex min-h-14 min-w-14 flex-col items-center justify-center rounded-2xl px-1 text-black hover:bg-black/5 disabled:opacity-40",
        className,
      )}
      {...rest}
    >
      {icon}
      {showLabel && <span className="text-lg font-bold leading-tight text-ink">{label}</span>}
    </button>
  );
}

export function IconLabel({ children }: { children: ReactNode }) {
  return <span className="text-lg font-bold leading-tight text-ink">{children}</span>;
}
