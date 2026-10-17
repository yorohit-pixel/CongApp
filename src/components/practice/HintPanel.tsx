import { buildWordHint } from "@/lib/spelling";
import type { PracticeItem } from "@/lib/types";
import { BulbIcon, SpeakerIcon } from "../ui/Icons";

/**
 * Opened hint, laid out like the design: bulb + "Hint" on the left,
 * hint text centred to its right. Offers a word hint and an audio hint.
 */
export function HintPanel({
  item,
  onAudioHint,
  audioAvailable,
}: {
  item: PracticeItem;
  onAudioHint: () => void;
  audioAvailable: boolean;
}) {
  const hint = buildWordHint(item);
  return (
    <div id="hint-panel" className="mx-auto flex max-w-[36rem] items-start gap-6 sm:gap-14">
      <div className="flex shrink-0 flex-col items-center text-black" aria-hidden="true">
        <BulbIcon size="3.4rem" />
        <span className="text-lg font-bold text-ink">Hint</span>
      </div>
      <div className="flex-1 text-center text-xl font-bold leading-snug text-ink">
        <p className="sr-only">Hint:</p>
        <p className="font-mono text-2xl tracking-[0.15em]" aria-label={`Letters: ${hint.pattern.replace(/_/g, "blank")}`}>
          {hint.pattern}
        </p>
        <p className="mt-1">{hint.text}</p>
        {audioAvailable && (
          <button
            type="button"
            onClick={onAudioHint}
            className="mt-3 inline-flex min-h-12 items-center gap-2 rounded-full border border-black bg-white px-5 text-lg font-bold text-ink hover:bg-[#FFF6DA]"
          >
            <SpeakerIcon size="1.4em" className="text-black" />
            Hear it in chunks
          </button>
        )}
      </div>
    </div>
  );
}
