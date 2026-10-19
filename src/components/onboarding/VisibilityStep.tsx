import { BuzzSays } from "../buddy/BuzzSays";
import { SettingsPreview, VisibilityControls } from "../settings/VisibilityControls";
import { ArrowRightIcon } from "../ui/Icons";
import { PillButton } from "../ui/PillButton";

/** Onboarding step 1: set up text size, font, spacing and page colour before reading anything. */
export function VisibilityStep({ onDone }: { onDone: () => void }) {
  return (
    <div className="mx-auto max-w-5xl">
      <h2 className="text-center text-[1.8rem] font-bold text-ink">Make It Easy to See</h2>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
        <section aria-label="Visibility settings" className="card-pop rounded-[2.5rem] bg-white p-6 sm:p-10">
          <VisibilityControls />
        </section>
        <SettingsPreview className="lg:sticky lg:top-6" />
      </div>
      <div className="mt-8 flex justify-center">
        <PillButton size="lg" className="min-w-[12rem]" onClick={onDone} icon={<ArrowRightIcon size="2.4rem" />}>
          Next
        </PillButton>
      </div>
      <BuzzSays
        className="mx-auto mt-12 max-w-3xl"
        text="Let's make the words easy for you to see. Try bigger letters or a different page colour. You can change these later in Settings."
      />
    </div>
  );
}
