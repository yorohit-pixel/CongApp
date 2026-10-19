"use client";

import { BuzzSays } from "@/components/buddy/BuzzSays";
import { BeeMascot } from "@/components/layout/BeeMascot";
import { PageShell } from "@/components/layout/PageShell";
import { BadgeHive } from "@/components/profile/BadgeHive";
import { PillLink } from "@/components/ui/PillButton";
import { LoadingState } from "@/components/ui/Status";
import { BADGE_PRIZES } from "@/data/accessories";
import { useBuddy } from "@/context/BuddyProvider";
import { useAsync } from "@/hooks/useAsync";
import { computeBadges } from "@/lib/badges";
import { getHistory, getLatestAssessment, getProgressSummary } from "@/services";

export default function BadgesPage() {
  const { hive, name, beeColor } = useBuddy();
  const { data, loading } = useAsync(async () => {
    const [summary, history, assessment] = await Promise.all([getProgressSummary(), getHistory(), getLatestAssessment()]);
    return { summary, history, assessment };
  }, []);

  if (loading || !data || !hive) {
    return (
      <PageShell title="My Badges">
        <LoadingState />
      </PageShell>
    );
  }

  const badges = computeBadges(data.summary, data.history, data.assessment, hive);
  const next = badges.find((b) => !b.earned);
  const earnedCount = badges.filter((b) => b.earned).length;
  const nextPrize = BADGE_PRIZES.find((p) => (p.badgesNeeded ?? 0) > earnedCount);
  return (
    <PageShell title="My Badges">
      <div className="mx-auto max-w-6xl">
        <section aria-label="All badges" className="card-pop rounded-[2.5rem] bg-white p-7 sm:p-9">
          <BadgeHive badges={badges} />
        </section>
        <section aria-labelledby="prizes-heading" className="card-pop mt-8 rounded-[2.5rem] bg-white p-7 sm:p-9">
          <h2 id="prizes-heading" className="font-hand text-[2.4rem] leading-tight text-ink">
            Badge Prizes
          </h2>
          <p className="text-lg text-ink">Every few badges unlocks a new outfit for Buzz. Claim them in the Honey Shop!</p>
          <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {BADGE_PRIZES.map((prize) => {
              const unlocked = earnedCount >= (prize.badgesNeeded ?? 0);
              return (
                <li key={prize.id} className="flex flex-col items-center text-center">
                  <BeeMascot color={beeColor} wearing={[prize.id]} className={unlocked ? "mt-4 h-auto w-24" : "mt-4 h-auto w-24 opacity-40 grayscale"} />
                  <p className="mt-3 text-lg font-bold leading-tight text-ink">{prize.name}</p>
                  <p className="text-base text-ink">{unlocked ? "✓ Unlocked" : `🔒 ${prize.badgesNeeded} badges`}</p>
                </li>
              );
            })}
          </ul>
          <PillLink href="/shop" variant="gold" className="mt-6">
            Go to the Honey Shop
          </PillLink>
        </section>
        <BuzzSays
          className="mx-auto mt-12 max-w-3xl"
          text={
            next
              ? `${name ? `${name}, your` : "Your"} next badge could be “${next.title}”. ${next.howTo}${nextPrize ? ` At ${nextPrize.badgesNeeded} badges you unlock the ${nextPrize.name}!` : ""}`
              : "You earned every badge! You're the queen bee of spelling!"
          }
        />
      </div>
    </PageShell>
  );
}
