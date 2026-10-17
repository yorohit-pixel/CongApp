"use client";

import { useParams, useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { SetEditor } from "@/components/sets/SetEditor";
import { PillLink } from "@/components/ui/PillButton";
import { ErrorState, LoadingState } from "@/components/ui/Status";
import { useAsync } from "@/hooks/useAsync";
import { getMySet, updateSet } from "@/services";

export default function EditSetPage() {
  const { setId } = useParams<{ setId: string }>();
  const router = useRouter();
  const { data: set, loading } = useAsync(() => getMySet(setId), [setId]);

  return (
    <PageShell title={set ? `Edit: ${set.title}` : "Edit set"}>
      {loading && <LoadingState />}
      {!loading && !set && <ErrorState message="We couldn't find that set." action={<PillLink href="/my-words">Back to My words</PillLink>} />}
      {set && (
        <SetEditor
          initial={set}
          cancelHref={`/my-words/${set.id}`}
          saveLabel="Save changes"
          onSave={async (input) => {
            await updateSet(set.id, input);
            router.push(`/my-words/${set.id}`);
          }}
        />
      )}
    </PageShell>
  );
}
