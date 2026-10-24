"use client";

import { useEffect, type ReactNode } from "react";
import { OnboardingGate } from "@/components/layout/OnboardingGate";
import { BuddyProvider } from "@/context/BuddyProvider";
import { SettingsProvider } from "@/context/SettingsProvider";
import { wakeBackend } from "@/services/api";

export function Providers({ children }: { children: ReactNode }) {
  // Start waking the (free, sleepy) backend while the student goes through the welcome screens.
  useEffect(() => wakeBackend(), []);
  return (
    <SettingsProvider>
      <BuddyProvider>
        <OnboardingGate>{children}</OnboardingGate>
      </BuddyProvider>
    </SettingsProvider>
  );
}
