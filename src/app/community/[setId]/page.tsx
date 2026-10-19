"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { WordList } from "@/components/sets/WordList";
import { ArrowRightIcon, BookmarkIcon } from "@/components/ui/Icons";
import { PillButton, PillLink } from "@/components/ui/PillButton";
import { ErrorState, LoadingState, Notice } from "@/components/ui/Status";
import { useAsync } from "@/hooks/useAsync";
import { getCommunitySet, getSavedCommunitySetIds, saveCommunitySetToMyWords } from "@/services";
import type { WordSet } from "@/lib/types";

export default function CommunitySetPage() {
  const { setId } = useParams<{ setId: string }>();
  const { data, loading } = useAsync(async () => {
    const [set, savedIds] = await Promise.all([getCommunitySet(setId), getSavedCommunitySetIds()]);
    return { set, alreadySaved: savedIds.includes(setId) };
  }, [setId]);
  const [savedCopy, setSavedCopy] = useState<WordSet | null>(null);
  const [saving, setSaving] = useState(false);

  const set = data?.set;
  const isSaved = Boolean(savedCopy) || Boolean(data?.alreadySaved);

  return (
    <PageShell title={set?.title ?? "Community set"}>
      {loading && <LoadingState />}
      {!loading && !set && <ErrorState message="We couldn't find that set." action={<PillLink href="/community">Back to Community Sets</PillLink>} />}
      {set && (
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xl text-ink">{set.description}</p>
              <p className="mt-1 text-lg text-ink/80">
                by <span className="font-bold text-ink">{set.creatorName}</span> · {set.words.length} words · {set.gradeBand} · saved {set.saves} times
              </p>
              <ul className="mt-3 flex flex-wrap gap-2" aria-label="Topics">
                {set.tags.map((t) => (
                  <li key={t} className="rounded-full bg-white px-4 py-1 text-base font-bold text-ink">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-3">
              <PillLink href={`/practice/${set.id}`} variant="gold" size="lg" icon={<ArrowRightIcon size="2rem" />}>
                Practice
              </PillLink>
              <PillButton
                onClick={async () => {
                  setSaving(true);
                  setSavedCopy(await saveCommunitySetToMyWords(set.id));
                  setSaving(false);
                }}
                disabled={isSaved || saving}
                icon={<BookmarkIcon size="1.5rem" filled={isSaved} />}
              >
                {isSaved ? "Saved to My words" : saving ? "Saving…" : "Save to My words"}
              </PillButton>
            </div>
          </div>
          <div aria-live="polite">
            {savedCopy && (
              <Notice tone="success" className="mt-6">
                ✓ Saved! You can find it in{" "}
                <Link href={`/my-words/${savedCopy.id}`} className="underline underline-offset-4">
                  My Words
                </Link>{" "}
                and change it however you like.
              </Notice>
            )}
          </div>
          <h2 className="mt-10 text-2xl font-bold text-ink">Words in This Set</h2>
          <WordList words={set.words} language={set.language} className="mt-4" />
        </div>
      )}
    </PageShell>
  );
}
