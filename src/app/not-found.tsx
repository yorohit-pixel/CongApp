import { BuzzSays } from "@/components/buddy/BuzzSays";
import { PageShell } from "@/components/layout/PageShell";
import { HouseIcon } from "@/components/ui/Icons";
import { PillLink } from "@/components/ui/PillButton";

export default function NotFound() {
  return (
    <PageShell title="Page not found" layout="focus">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <p className="text-2xl font-bold text-ink">We couldn't find that page.</p>
        <PillLink href="/" size="lg" variant="gold" className="mt-8" icon={<HouseIcon size="2rem" className="text-navy" />}>
          Go home
        </PillLink>
        <BuzzSays size="lg" className="mt-12 w-full text-left" text="Oops! I flew off course and couldn't find that page. Let's buzz back home." />
      </div>
    </PageShell>
  );
}
