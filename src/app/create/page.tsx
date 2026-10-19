"use client";

import { useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { SetEditor } from "@/components/sets/SetEditor";
import { createSet } from "@/services";

export default function CreateSetPage() {
  const router = useRouter();
  return (
    <PageShell title="Create a Set">
      <SetEditor
        cancelHref="/my-words"
        onSave={async (input) => {
          const set = await createSet(input);
          router.push(`/my-words/${set.id}`);
        }}
      />
    </PageShell>
  );
}
