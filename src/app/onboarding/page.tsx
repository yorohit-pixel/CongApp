"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { AssessmentIntro } from "@/components/onboarding/AssessmentIntro";
import { AssessmentRunner } from "@/components/onboarding/AssessmentRunner";
import { AssessmentSummaryView } from "@/components/onboarding/AssessmentSummaryView";
import { GradePicker } from "@/components/onboarding/GradePicker";
import { VisibilityStep } from "@/components/onboarding/VisibilityStep";
import { WelcomeScreen } from "@/components/onboarding/WelcomeScreen";
import { LoadingState } from "@/components/ui/Status";
import { useBuddy } from "@/context/BuddyProvider";
import { getAssessmentItems, getProfile, submitAssessment, updateProfile } from "@/services";
import type { AssessmentItem, AssessmentSummary, Grade, StudentProfile } from "@/lib/types";

type Step =
  | { name: "loading" }
  | { name: "welcome" }
  | { name: "visibility" }
  | { name: "grade" }
  | { name: "intro"; grade: Grade; items: AssessmentItem[] }
  | { name: "test"; grade: Grade; items: AssessmentItem[] }
  | { name: "saving" }
  | { name: "summary"; summary: AssessmentSummary };

const TITLES: Record<Step["name"], string> = {
  loading: "Bee Spelling",
  welcome: "Bee Spelling",
  visibility: "Get set up",
  grade: "About you",
  intro: "personalization test",
  test: "personalization test",
  saving: "personalization test",
  summary: "personalization test",
};

/**
 * Onboarding: welcome → visibility settings → grade → test intro → test → summary.
 * Students retaking the test from their profile skip straight to the grade question.
 */
export default function OnboardingPage() {
  const [step, setStep] = useState<Step>({ name: "loading" });
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const buddy = useBuddy();

  useEffect(() => {
    void getProfile().then((p) => {
      setProfile(p);
      setStep(p.onboardingComplete ? { name: "grade" } : { name: "welcome" });
    });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step.name]);

  return (
    <PageShell
      title={TITLES[step.name]}
      layout="focus"
      withBeeTrack={step.name === "test"}
      // A new student is held here until the check-in is done, so the nav buttons would only bounce back.
      hideNav={!profile?.onboardingComplete && step.name !== "summary"}
    >
      {(step.name === "loading" || !profile) && <LoadingState />}
      {step.name === "welcome" && <WelcomeScreen onStart={() => setStep({ name: "visibility" })} />}
      {step.name === "visibility" && <VisibilityStep onDone={() => setStep({ name: "grade" })} />}
      {step.name === "grade" && profile && (
        <GradePicker
          initial={profile.grade}
          initialName={profile.displayName}
          onDone={async (grade, name) => {
            if (name !== profile.displayName) {
              setProfile(await updateProfile({ displayName: name }));
              buddy.refresh();
            }
            setStep({ name: "intro", grade, items: await getAssessmentItems(grade) });
          }}
        />
      )}
      {step.name === "intro" && <AssessmentIntro items={step.items} onStart={() => setStep({ ...step, name: "test" })} />}
      {step.name === "test" && (
        <AssessmentRunner
          items={step.items}
          onComplete={async (responses) => {
            setStep({ name: "saving" });
            setStep({ name: "summary", summary: await submitAssessment(step.grade, responses) });
          }}
        />
      )}
      {step.name === "saving" && <LoadingState label="Choosing your practice words…" />}
      {step.name === "summary" && <AssessmentSummaryView summary={step.summary} />}
    </PageShell>
  );
}
