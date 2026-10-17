import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "@/lib/cn";

/** Labelled pill-shaped text input in the style of "type words here". */
export function TextField({
  label,
  hint,
  error,
  id,
  className,
  inputClassName,
  inputRef,
  ...rest
}: {
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  id: string;
  className?: string;
  inputClassName?: string;
  inputRef?: Ref<HTMLInputElement>;
} & InputHTMLAttributes<HTMLInputElement>) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-lg font-bold text-ink">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-base text-ink/80">
          {hint}
        </p>
      )}
      <input
        ref={inputRef}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "min-h-14 w-full rounded-full border border-black bg-white px-6 text-lg font-semibold text-ink placeholder:font-semibold placeholder:text-ink/60",
          error && "border-2 border-[#C62828]",
          inputClassName,
        )}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className="font-bold text-[#B71C1C]">
          {error}
        </p>
      )}
    </div>
  );
}
