import { BuzzSays } from "../buddy/BuzzSays";
import { CelebrationBurst } from "../decor/BeeDecor";
import { ArrowRightIcon } from "../ui/Icons";
import { PillButton } from "../ui/PillButton";

/** The very first screen a new student sees. Buzz says hello at the bottom. */
export function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
      <CelebrationBurst className="mb-3" />
      <h2 className="font-hand text-[3.6rem] leading-none text-ink sm:text-[4.6rem]">Welcome!!!!</h2>
      <PillButton size="lg" variant="gold" className="mt-10 min-w-[14rem]" onClick={onStart} icon={<ArrowRightIcon size="2.4rem" />}>
        Start
      </PillButton>
      <BuzzSays
        size="lg"
        className="mt-12 w-full text-left"
        text="Hi! I'm Buzz, your spelling buddy. We'll practice reading and spelling together, one word at a time. Let's get your hive ready!"
      />
    </div>
  );
}
