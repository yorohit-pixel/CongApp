"use client";

import type { ReactNode } from "react";
import { OnboardingGate } from "@/components/layout/OnboardingGate";
import { BuddyProvider } from "@/context/BuddyProvider";
import { SettingsProvider } from "@/context/SettingsProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <BuddyProvider>
        <OnboardingGate>{children}</OnboardingGate>
      </BuddyProvider>
    </SettingsProvider>
  );
}
