import { cn } from "@/lib/cn";
import type { Feedback } from "@/hooks/usePracticeSession";
import { CheckIcon, CrossIcon } from "../ui/Icons";

/**
 * Text feedback under the input. Uses a symbol + words, so the result is
 * never shown by colour alone. Announced politely to screen readers.
 */
export function FeedbackLine({ feedback, className }: { feedback: Feedback | null; className?: string }) {
  return (
    <div aria-live="polite" aria-atomic="true" className={cn("min-h-[2.25rem] text-center", className)}>
      {feedback && (
        <p className="inline-flex items-start justify-center gap-2 text-xl font-bold text-ink">
          {feedback.tone === "correct" && <CheckIcon className="mt-0.5 shrink-0 text-[#2E7D32]" size="1.4em" />}
          {feedback.tone === "incorrect" && <CrossIcon className="mt-1 shrink-0 text-[#C62828]" size="1.1em" />}
          <span>{feedback.message}</span>
        </p>
      )}
    </div>
  );
}
