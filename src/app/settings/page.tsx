"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { ProfilePanel } from "@/components/profile/ProfilePanel";
import { SettingsPreview, VisibilityControls } from "@/components/settings/VisibilityControls";
import { VoicePicker } from "@/components/settings/VoicePicker";
import { ChoiceGroup } from "@/components/ui/ChoiceGroup";
import { SpeakerIcon } from "@/components/ui/Icons";
import { PillButton } from "@/components/ui/PillButton";
import { LoadingState } from "@/components/ui/Status";
import { Toggle } from "@/components/ui/Toggle";
import { useSettings } from "@/context/SettingsProvider";
import { useSpeech } from "@/hooks/useSpeech";
import { cn } from "@/lib/cn";
import type { SpeechRate } from "@/lib/types";

type Tab = "settings" | "profile";
const TABS: Array<{ id: Tab; label: string }> = [
  { id: "settings", label: "Settings" },
  { id: "profile", label: "My Profile" },
];

/** Settings, with the student's profile in its own tab ("/settings?tab=profile" opens it). */
export default function SettingsPage() {
  // useSearchParams needs a Suspense boundary in Next.js.
  return (
    <Suspense
      fallback={
        <PageShell title="Settings">
          <LoadingState />
        </PageShell>
      }
    >
      <SettingsTabs />
    </Suspense>
  );
}

function SettingsTabs() {
  const params = useSearchParams();
  const router = useRouter();
  const tab: Tab = params.get("tab") === "profile" ? "profile" : "settings";
  const tabRefs = useRef<Record<Tab, HTMLButtonElement | null>>({ settings: null, profile: null });
  const [focusTab, setFocusTab] = useState<Tab | null>(null);

  useEffect(() => {
    if (focusTab) tabRefs.current[focusTab]?.focus();
  }, [focusTab, tab]);

  const choose = (next: Tab, focus = false) => {
    router.replace(next === "profile" ? "/settings?tab=profile" : "/settings", { scroll: false });
    setFocusTab(focus ? next : null);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    choose(tab === "settings" ? "profile" : "settings", true);
  };

  return (
    <PageShell title={tab === "profile" ? "My profile" : "Settings"}>
      <div role="tablist" aria-label="Settings sections" className="mx-auto mb-8 flex max-w-6xl flex-wrap gap-3" onKeyDown={onKeyDown}>
        {TABS.map((t) => {
          const selected = tab === t.id;
          return (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[t.id] = el;
              }}
              id={`tab-${t.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`panel-${t.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => choose(t.id)}
              className={cn(
                "min-h-14 rounded-full border-2 border-black px-7 text-xl font-bold text-ink",
                selected ? "bg-gold" : "bg-white hover:bg-[#FFF6DA]",
              )}
            >
              {selected && <span aria-hidden="true">✓ </span>}
              {t.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "settings" ? <SettingsPanel /> : <ProfilePanel />}
      </div>
    </PageShell>
  );
}

function SettingsPanel() {
  const { settings, updateSettings } = useSettings();
  const speech = useSpeech();
  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
      <div className="grid gap-8">
        <section aria-labelledby="reading-heading" className="card-pop rounded-[2.5rem] bg-white p-6 sm:p-10">
          <h2 id="reading-heading" className="text-2xl font-bold text-ink">
            Reading
          </h2>
          <div className="mt-5">
            <VisibilityControls />
          </div>
        </section>

        <section aria-labelledby="practice-heading" className="card-pop rounded-[2.5rem] bg-white p-6 sm:p-10">
          <h2 id="practice-heading" className="text-2xl font-bold text-ink">
            Practice
          </h2>
          <ChoiceGroup<SpeechRate>
            name="speech-rate"
            legend="Speaking speed"
            className="mt-5"
            options={[
              { value: "slow", label: "Slow" },
              { value: "normal", label: "Normal" },
            ]}
            value={settings.speechRate}
            onChange={(speechRate) => updateSettings({ speechRate })}
          />
          <VoicePicker className="mt-6" />
          <PillButton
            className="mt-4"
            icon={<SpeakerIcon size="1.6rem" />}
            disabled={!speech.available}
            onClick={() => void speech.say("Hi! I'm Buzz. Let's practice some words together!")}
          >
            Test the Voice
          </PillButton>
          {!speech.available && <p className="mt-2 text-base text-ink">Sound isn't available in this browser.</p>}
          <div className="mt-4 divide-y divide-black/15">
            <Toggle
              id="auto-play"
              label="Say each word automatically"
              description="The word is read out loud when it appears."
              checked={settings.autoPlayWord}
              onChange={(autoPlayWord) => updateSettings({ autoPlayWord })}
            />
            <Toggle
              id="show-definitions"
              label="Show the meaning"
              description="Shows “Definition: …” above the answer box."
              checked={settings.showDefinitions}
              onChange={(showDefinitions) => updateSettings({ showDefinitions })}
            />
          </div>
        </section>
        <p className="text-lg text-ink">Changes are saved straight away.</p>
      </div>

      <SettingsPreview className="lg:sticky lg:top-6" />
    </div>
  );
}
