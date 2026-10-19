import type { AssessmentItem } from "@/lib/types";
import { BuzzSays } from "../buddy/BuzzSays";
import { ArrowRightIcon } from "../ui/Icons";
import { PillButton } from "../ui/PillButton";

/** Shown before the test: what each section is and how many questions it has. */
export function AssessmentIntro({ onStart, onSkip, items }: { onStart: () => void; onSkip: () => void; items: AssessmentItem[] }) {
  const spelling = items.filter((i) => i.activity === "hear-and-type").length;
  const soundMatch = items.filter((i) => i.activity === "sound-match").length;
  const sections = [
    { title: "Spelling", text: `${spelling} words. Listen to each word, then type it. They start easy and get harder.` },
    ...(soundMatch > 0 ? [{ title: "Sound match", text: `${soundMatch} questions. Find words with the same sound.` }] : []),
  ];
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
      <h2 className="text-[1.8rem] font-bold text-ink">Let's find the best words for you!</h2>
      <ol className="mt-8 grid w-full gap-4 text-left sm:grid-cols-2">
        {sections.map((section, i) => (
          <li key={section.title} className="card-pop rounded-[2rem] bg-white p-5">
            <p className="text-xl font-bold text-ink">
              Section {i + 1}: {section.title}
            </p>
            <p className="text-lg text-ink">{section.text}</p>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-base text-ink/85">
        This is a check-in to choose practice words. It is not a test for dyslexia or any other learning difference.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <PillButton size="lg" variant="gold" onClick={onStart} icon={<ArrowRightIcon size="2.4rem" />}>
          Start section 1
        </PillButton>
        <PillButton size="lg" onClick={onSkip}>
          Skip for now
        </PillButton>
      </div>
      <p className="mt-3 text-base text-ink/85">The check-in is optional. You can take it later from Settings → My profile.</p>
      <BuzzSays
        className="mt-12 w-full text-left"
        text={`The check-in has ${sections.length} sections. It's okay if some words are tricky. That just shows us what to practice! Or skip it, and I'll pick words for your grade.`}
      />
    </div>
  );
}
