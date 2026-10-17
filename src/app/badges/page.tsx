"use client";

import { BuzzSays } from "@/components/buddy/BuzzSays";
import { PageShell } from "@/components/layout/PageShell";
import { BadgeHive } from "@/components/profile/BadgeHive";
import { LoadingState } from "@/components/ui/Status";
import { useBuddy } from "@/context/BuddyProvider";
import { useAsync } from "@/hooks/useAsync";
import { computeBadges } from "@/lib/badges";
import { getHistory, getLatestAssessment, getProgressSummary } from "@/services";

export default function BadgesPage() {
  const { hive, name } = useBuddy();
  const { data, loading } = useAsync(async () => {
    const [summary, history, assessment] = await Promise.all([getProgressSummary(), getHistory(), getLatestAssessment()]);
    return { summary, history, assessment };
  }, []);

  if (loading || !data || !hive) {
    return (
      <PageShell title="My badges">
        <LoadingState />
      </PageShell>
    );
  }

  const badges = computeBadges(data.summary, data.history, data.assessment, hive);
  const next = badges.find((b) => !b.earned);
  return (
    <PageShell title="My badges">
      <div className="mx-auto max-w-6xl">
        <section aria-label="All badges" className="card-pop rounded-[2.5rem] bg-white p-7 sm:p-9">
          <BadgeHive badges={badges} />
        </section>
        <BuzzSays
          className="mx-auto mt-12 max-w-3xl"
          text={
            next
              ? `${name ? `${name}, your` : "Your"} next badge could be “${next.title}”. ${next.howTo}`
              : "You earned every badge! You're the queen bee of spelling!"
          }
        />
      </div>
    </PageShell>
  );
}
