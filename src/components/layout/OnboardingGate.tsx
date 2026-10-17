"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { getProfile } from "@/services";
import { LoadingState } from "../ui/Status";

/** Pages a new student can open before finishing onboarding. Settings stays open so text size and font can be set first. */
const OPEN_PATHS = ["/onboarding", "/settings"];

/**
 * New students answer the grade question and take the personalization test
 * before anything else. Until the profile says onboarding is complete, every
 * other page sends them to /onboarding.
 */
export function OnboardingGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [complete, setComplete] = useState<boolean | null>(null);
  const open = OPEN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  useEffect(() => {
    // Once complete it stays complete (a demo reset reloads the page).
    if (complete) return;
    let cancelled = false;
    void getProfile().then((profile) => {
      if (cancelled) return;
      setComplete(profile.onboardingComplete);
      if (!profile.onboardingComplete && !open) {
        router.replace("/onboarding");
        // Safety net: if the in-app redirect gets lost (e.g. a slow first load), do a full page load.
        window.setTimeout(() => {
          if (!cancelled && window.location.pathname !== "/onboarding") window.location.assign("/onboarding");
        }, 4000);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [pathname, open, complete, router]);

  if (open || complete) return <>{children}</>;
  return (
    <main id="main" className="flex min-h-screen items-center justify-center">
      <LoadingState />
    </main>
  );
}
