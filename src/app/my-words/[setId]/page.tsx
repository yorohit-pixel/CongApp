"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { WordList } from "@/components/sets/WordList";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ArrowRightIcon, PencilIcon, TrashIcon } from "@/components/ui/Icons";
import { PillButton, PillLink } from "@/components/ui/PillButton";
import { ErrorState, LoadingState } from "@/components/ui/Status";
import { useAsync } from "@/hooks/useAsync";
import { deleteSet, getMySet } from "@/services";

export default function SetDetailPage() {
  const { setId } = useParams<{ setId: string }>();
  const router = useRouter();
  const { data: set, loading } = useAsync(() => getMySet(setId), [setId]);
  const [confirming, setConfirming] = useState(false);

  return (
    <PageShell title={set?.title ?? "My words"}>
      {loading && <LoadingState />}
      {!loading && !set && <ErrorState message="We couldn't find that set." action={<PillLink href="/my-words">Back to My words</PillLink>} />}
      {set && (
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              {set.description && <p className="text-xl text-ink">{set.description}</p>}
              <p className="mt-1 text-lg text-ink/80">
                {set.words.length} {set.words.length === 1 ? "word" : "words"}
                {set.source && ` · saved from ${set.source.creatorName}`}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <PillLink href={`/practice/${set.id}`} variant="gold" size="lg" icon={<ArrowRightIcon size="2rem" />}>
                Practice
              </PillLink>
              <PillLink href={`/my-words/${set.id}/edit`} icon={<PencilIcon size="1.5rem" />}>
                Edit
              </PillLink>
              <PillButton onClick={() => setConfirming(true)} icon={<TrashIcon size="1.5rem" />}>
                Delete
              </PillButton>
            </div>
          </div>
          <h2 className="mt-10 text-2xl font-bold text-ink">Review the words</h2>
          <p className="text-lg text-ink/80">Tap the speaker to hear a word.</p>
          <WordList words={set.words} language={set.language} className="mt-4" />
        </div>
      )}
      <ConfirmDialog
        open={confirming}
        title="Delete this set?"
        message={`“${set?.title ?? ""}” will be removed from My words.`}
        confirmLabel="Yes, delete it"
        onCancel={() => setConfirming(false)}
        onConfirm={async () => {
          setConfirming(false);
          await deleteSet(setId);
          router.push("/my-words");
        }}
      />
    </PageShell>
  );
}
