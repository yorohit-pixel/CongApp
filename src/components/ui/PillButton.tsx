import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * The rounded "pill" from the designs: white fill, thin black outline,
 * bold navy label, optional icon on the left.
 */
type Variant = "outline" | "gold" | "quiet";
type Size = "md" | "lg";

const base =
  "inline-flex select-none items-center justify-center gap-3 rounded-full font-bold text-ink transition-colors disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:opacity-60";

const variants: Record<Variant, string> = {
  outline: "border border-black bg-white hover:bg-[#FFF6DA]",
  gold: "border border-black bg-gold hover:bg-[#F2A400]",
  quiet: "border border-transparent bg-transparent underline-offset-4 hover:underline",
};

const sizes: Record<Size, string> = {
  md: "min-h-14 px-6 text-lg",
  // lg matches the 180 × 70 "check" pill in the 1440px designs
  lg: "min-h-[4.4rem] px-8 text-[1.45rem]",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  /** Icon-only pill (e.g. the home and arrow buttons): no side padding. */
  iconOnly?: boolean;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function pillClasses(variant: Variant = "outline", size: Size = "md", className?: string, iconOnly = false) {
  return cn(base, variants[variant], sizes[size], iconOnly && "px-0!", className);
}

export function PillButton({
  variant = "outline",
  size = "md",
  iconOnly = false,
  icon,
  className,
  children,
  type = "button",
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={pillClasses(variant, size, className, iconOnly)} {...rest}>
      {icon}
      {children}
    </button>
  );
}

export function PillLink({
  href,
  variant = "outline",
  size = "md",
  iconOnly = false,
  icon,
  className,
  children,
  ...rest
}: CommonProps & { href: string; "aria-label"?: string }) {
  return (
    <Link href={href} className={pillClasses(variant, size, className, iconOnly)} {...rest}>
      {icon}
      {children}
    </Link>
  );
}
