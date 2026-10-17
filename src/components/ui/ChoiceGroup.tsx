import { cn } from "@/lib/cn";

/** A row of pill-shaped radio buttons. */
export function ChoiceGroup<T extends string | number>({
  name,
  legend,
  options,
  value,
  onChange,
  className,
  legendClassName,
  size = "md",
}: {
  name: string;
  legend: string;
  options: Array<{ value: T; label: string; ariaLabel?: string }>;
  value: T | null;
  onChange: (value: T) => void;
  className?: string;
  legendClassName?: string;
  size?: "md" | "lg";
}) {
  return (
    <fieldset className={className}>
      <legend className={cn("mb-3 text-xl font-bold text-ink", legendClassName)}>{legend}</legend>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const id = `${name}-${option.value}`;
          const selected = value === option.value;
          return (
            <label
              key={String(option.value)}
              htmlFor={id}
              className={cn(
                "choice-pill relative inline-flex cursor-pointer items-center justify-center rounded-full border font-bold text-ink",
                size === "lg" ? "min-h-[4.4rem] min-w-[4.4rem] px-6 text-2xl" : "min-h-14 min-w-14 px-6 text-lg",
                selected ? "border-2 border-black bg-gold" : "border-black bg-white hover:bg-[#FFF6DA]",
              )}
            >
              <input
                id={id}
                type="radio"
                name={name}
                className="sr-only"
                checked={selected}
                onChange={() => onChange(option.value)}
                aria-label={option.ariaLabel}
              />
              {selected && <span aria-hidden="true" className="mr-2">✓</span>}
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
