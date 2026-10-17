import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type AnswerState = "idle" | "correct" | "incorrect" | "revealed";

/** The wide pill input: white, turns green when correct and red when not. */
export const AnswerPill = forwardRef<HTMLInputElement, { state: AnswerState } & InputHTMLAttributes<HTMLInputElement>>(
  function AnswerPill({ state, className, ...rest }, ref) {
    return (
      <input
        ref={ref}
        type="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        className={cn(
          "answer-pill h-[4.6rem] w-full rounded-full border border-black px-8 text-center text-[1.6rem] font-bold text-ink placeholder:text-ink placeholder:opacity-75 transition-colors",
          state === "correct" && "bg-correct",
          state === "incorrect" && "bg-incorrect",
          (state === "idle" || state === "revealed") && "bg-white",
          className,
        )}
        {...rest}
      />
    );
  },
);
