"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { LoadingState } from "@/components/ui/Status";

/** The profile now lives in Settings → My profile. Old links land there. */
export default function ProfileRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/settings?tab=profile");
  }, [router]);
  return (
    <PageShell title="My profile">
      <LoadingState />
    </PageShell>
  );
}
