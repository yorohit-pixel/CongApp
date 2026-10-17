import { cn } from "@/lib/cn";

/** Large on/off switch with a visible "On"/"Off" word, not colour alone. */
export function Toggle({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <div>
        <p id={`${id}-label`} className="text-xl font-bold text-ink">
          {label}
        </p>
        {description && (
          <p id={`${id}-desc`} className="mt-1 text-base text-ink/80">
            {description}
          </p>
        )}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        aria-describedby={description ? `${id}-desc` : undefined}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-12 w-[6.5rem] shrink-0 items-center rounded-full border-2 border-black px-1 transition-colors",
          checked ? "bg-gold" : "bg-white",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border-2 border-black bg-white transition-[left]",
            checked ? "left-[calc(100%-2.6rem)]" : "left-1",
          )}
        />
        <span aria-hidden="true" className={cn("w-full text-base font-bold text-ink", checked ? "pr-10 text-left pl-2" : "pl-10 text-right pr-2")}>
          {checked ? "On" : "Off"}
        </span>
      </button>
    </div>
  );
}
