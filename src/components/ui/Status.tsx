import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { BeeMascot } from "../layout/BeeMascot";

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div role="status" className="flex flex-col items-center gap-3 py-16 text-center text-xl font-bold text-ink">
      <BeeMascot className="loading-bee h-auto w-24" />
      {label}
    </div>
  );
}

export function ErrorState({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <div role="alert" className="mx-auto flex max-w-xl flex-col items-center gap-5 card-pop rounded-[2.5rem] bg-white px-8 py-10 text-center">
      <p className="text-xl font-bold text-ink">{message}</p>
      {action}
    </div>
  );
}

export function Notice({ children, tone = "info", className }: { children: ReactNode; tone?: "info" | "success"; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-3xl border-2 px-6 py-4 text-lg font-semibold text-ink",
        tone === "success" ? "border-[#2E7D32] bg-[#E9F8E0]" : "border-gold bg-[#FFF6DA]",
        className,
      )}
    >
      {children}
    </div>
  );
}
