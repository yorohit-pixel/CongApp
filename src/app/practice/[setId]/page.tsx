"use client";

import { useParams } from "next/navigation";
import { useCallback, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { PracticeRunner } from "@/components/practice/PracticeRunner";
import { ResultsScreen } from "@/components/practice/ResultsScreen";
import { PillLink } from "@/components/ui/PillButton";
import { ErrorState, LoadingState } from "@/components/ui/Status";
import { useBuddy } from "@/context/BuddyProvider";
import { useAsync } from "@/hooks/useAsync";
import { getPracticeSession, submitSessionResult } from "@/services";
import type { PracticeItem, WordAttempt } from "@/lib/types";

export default function PracticePage() {
  const { setId } = useParams<{ setId: string }>();
  const { data: session, loading, error } = useAsync(() => getPracticeSession(setId), [setId]);
  const [round, setRound] = useState(0);
  const [items, setItems] = useState<PracticeItem[] | null>(null);
  const [results, setResults] = useState<WordAttempt[] | null>(null);
  const { refresh: refreshBuddy } = useBuddy();

  const activeItems = items ?? session?.items ?? [];

  const handleFinish = useCallback(
    (attempts: WordAttempt[]) => {
      setResults(attempts);
      if (session) {
        void submitSessionResult({
          sourceId: session.sourceId,
          sourceKind: session.sourceKind,
          title: session.title,
          completedAt: new Date().toISOString(),
          attempts,
        }).then(refreshBuddy); // new honey and streak
      }
    },
    [session, refreshBuddy],
  );

  const startRound = (next: PracticeItem[]) => {
    setItems(next);
    setResults(null);
    setRound((r) => r + 1);
    window.scrollTo({ top: 0 });
  };

  const title = session?.title ?? (loading ? "Practice" : "Practice");

  return (
    <PageShell title={title} layout={results ? "browse" : "focus"} withBeeTrack={!results && activeItems.length > 0}>
      {loading && <LoadingState label="Getting your words ready…" />}
      {!loading && (error || !session) && (
        <ErrorState message="We couldn't find that word set." action={<PillLink href="/">Go Home</PillLink>} />
      )}
      {session && session.items.length === 0 && (
        <ErrorState
          message="There are no words to practice here yet."
          action={<PillLink href={session.sourceKind === "my-set" ? `/my-words/${session.sourceId}/edit` : "/"}>Add Some Words</PillLink>}
        />
      )}
      {session && activeItems.length > 0 && !results && (
        <PracticeRunner key={round} items={activeItems} onFinish={handleFinish} />
      )}
      {session && results && (
        <ResultsScreen
          attempts={results}
          onTryAgain={() => startRound(session.items)}
          onPracticeMissed={() => {
            const missedIds = new Set(results.filter((r) => !r.correct).map((r) => r.itemId));
            startRound(activeItems.filter((i) => missedIds.has(i.id)));
          }}
        />
      )}
    </PageShell>
  );
}
