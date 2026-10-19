"use client";

import { useEffect, useState } from "react";
import { BeeColorPicker } from "@/components/buddy/BeeColorPicker";
import { BeeMascot } from "@/components/layout/BeeMascot";
import { BadgeHive } from "@/components/profile/BadgeHive";
import { ChoiceGroup } from "@/components/ui/ChoiceGroup";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { TextField } from "@/components/ui/Field";
import { HandHeading } from "@/components/ui/HandHeading";
import { CheckIcon, CrossIcon, FlameIcon } from "@/components/ui/Icons";
import { PillButton, PillLink } from "@/components/ui/PillButton";
import { LoadingState, Notice } from "@/components/ui/Status";
import { useBuddy } from "@/context/BuddyProvider";
import { useAsync } from "@/hooks/useAsync";
import { computeBadges } from "@/lib/badges";
import { cn } from "@/lib/cn";
import { GRADE_OPTIONS, gradeLabel } from "@/lib/grades";
import type { Grade } from "@/lib/types";
import { getHistory, getLatestAssessment, getProfile, getProgressSummary, resetDemoData, updateProfile } from "@/services";

/** "My profile" tab inside Settings: name, grade, Buzz, progress, streak, badges, test results, recent practice. */
export function ProfilePanel() {
  const { data, loading, reload } = useAsync(async () => {
    const [profile, summary, assessment, history] = await Promise.all([
      getProfile(),
      getProgressSummary(),
      getLatestAssessment(),
      getHistory(),
    ]);
    return { profile, summary, assessment, history };
  }, []);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState<Grade | null>(null);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const { beeColor, wearing, hive, refresh: refreshBuddy } = useBuddy();

  useEffect(() => {
    if (data) {
      setName(data.profile.displayName);
      setGrade(data.profile.grade);
    }
  }, [data]);

  if (loading || !data) return <LoadingState />;

  const { profile, summary, assessment, history } = data;
  const accuracy = summary.wordsPracticed ? Math.round((summary.wordsCorrect / summary.wordsPracticed) * 100) : 0;
  const streak = hive?.streak;

  return (
    <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[24rem_1fr] lg:items-start">
      <section aria-labelledby="about-heading" className="card-pop rounded-[2.5rem] bg-white p-7 sm:p-9">
        <div className="flex items-center gap-4">
          <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-cream">
            <BeeMascot color={beeColor} wearing={wearing} className="h-auto w-20" />
          </div>
          <div>
            <h2 id="about-heading" className="text-[1.8rem] font-bold leading-tight text-ink">
              {profile.displayName || "Me"}
            </h2>
            <p className="text-lg text-ink">{profile.grade === null ? "Grade not set" : gradeLabel(profile.grade)}</p>
          </div>
        </div>
        <form
          className="mt-7 grid gap-5"
          onSubmit={async (e) => {
            e.preventDefault();
            await updateProfile({ displayName: name.trim(), grade });
            setSaved(true);
            void reload();
            refreshBuddy();
          }}
        >
          <TextField id="display-name" label="My name" value={name} onChange={(e) => { setName(e.target.value); setSaved(false); }} maxLength={30} />
          <ChoiceGroup<Grade>
            name="profile-grade"
            legend="My grade"
            legendClassName="text-lg"
            options={GRADE_OPTIONS}
            value={grade}
            onChange={(g) => { setGrade(g); setSaved(false); }}
          />
          <PillButton type="submit" variant="gold">
            Save
          </PillButton>
          <div aria-live="polite">{saved && <Notice tone="success">✓ Profile saved.</Notice>}</div>
        </form>
        <div className="mt-7">
          <BeeColorPicker />
        </div>
        <p className="mt-6 text-base text-ink/80">Signing in and saving across devices will be added when the backend is connected.</p>
      </section>

      <div className="grid gap-8">
        <section aria-labelledby="progress-heading">
          <HandHeading id="progress-heading">My Progress</HandHeading>
          <dl className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-3">
            {[
              ["Practice sessions", summary.sessionsCompleted],
              ["Words practiced", summary.wordsPracticed],
              ["Spelled right", `${accuracy}%`],
            ].map(([label, value]) => (
              <div key={label} className="card-pop rounded-[2rem] bg-white p-5 text-center">
                <dt className="text-base font-bold text-ink/80">{label}</dt>
                <dd className="mt-1 text-[2.2rem] font-bold text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Streak lives here (and on Home) now that it has no nav button. */}
        <section aria-labelledby="streak-heading" className="card-pop flex flex-wrap items-center gap-5 rounded-[2.5rem] bg-white p-7 sm:p-9">
          <FlameIcon size="4rem" />
          <div className="min-w-[10rem] flex-1">
            <h2 id="streak-heading" className="text-2xl font-bold text-ink">
              My Streak
            </h2>
            <p className="text-lg text-ink">
              <span className="text-[2rem] font-bold">{streak?.current ?? summary.streakDays}</span>{" "}
              {(streak?.current ?? summary.streakDays) === 1 ? "day" : "days"} in a row · best {streak?.best ?? summary.streakDays}
            </p>
            {streak && <p className="text-base text-ink">{streak.practicedToday ? "✓ You practiced today!" : "Practice today to keep it going."}</p>}
          </div>
          <PillLink href="/streak" variant="gold">
            See My Streak
          </PillLink>
        </section>

        <section aria-labelledby="badges-heading" className="card-pop rounded-[2.5rem] bg-white p-7 sm:p-9">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="badges-heading" className="text-2xl font-bold text-ink">
              My Badges
            </h2>
            <PillLink href="/badges" variant="gold">
              See All Badges
            </PillLink>
          </div>
          <div className="mt-3">
            <BadgeHive compact badges={computeBadges(summary, history, assessment, hive)} />
          </div>
        </section>

        <section aria-labelledby="test-heading" className="card-pop rounded-[2.5rem] bg-white p-7 sm:p-9">
          <h2 id="test-heading" className="text-2xl font-bold text-ink">
            Personalization Test
          </h2>
          {assessment ? (
            <>
              <div className="mt-3 grid gap-5 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-bold text-ink">Things You're Good At</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-6 text-lg text-ink">
                    {assessment.strengths.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-ink">Patterns to Practice</h3>
                  {assessment.practiceAreas.length ? (
                    <ul className="mt-2 list-disc space-y-1 pl-6 text-lg text-ink">
                      {assessment.practiceAreas.map((p) => (
                        <li key={p.tag}>{p.label}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-lg text-ink">Nothing stood out — great job!</p>
                  )}
                </div>
              </div>
              {assessment.spelling?.length > 0 && <SpellingAnswers answers={assessment.spelling} />}
            </>
          ) : (
            <p className="mt-2 text-lg text-ink">You haven't taken it yet. It helps us choose your practice words.</p>
          )}
          <PillLink href="/onboarding" className="mt-5" variant={assessment ? "outline" : "gold"}>
            {assessment ? "Take it again" : "Take the personalization test"}
          </PillLink>
        </section>

        <section aria-labelledby="recent-heading">
          <h2 id="recent-heading" className="text-2xl font-bold text-ink">
            Recent Practice
          </h2>
          {history.length === 0 ? (
            <p className="mt-2 text-lg text-ink">No practice yet.</p>
          ) : (
            <ul className="mt-3 grid gap-3">
              {history.slice(0, 5).map((h) => {
                const right = h.attempts.filter((a) => a.correct).length;
                return (
                  <li key={h.id} className="flex flex-wrap items-center justify-between gap-2 rounded-full border border-black bg-white px-6 py-3">
                    <span className="text-lg font-bold text-ink">{h.title}</span>
                    <span className="text-lg text-ink">
                      {right} of {h.attempts.length} right ·{" "}
                      {new Date(h.completedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section aria-labelledby="demo-heading" className="rounded-[2rem] border-2 border-dashed border-ink/40 p-6">
          <h2 id="demo-heading" className="text-lg font-bold text-ink">
            Demo Tools
          </h2>
          <p className="mt-1 text-base text-ink">Puts all the sample sets, history and settings back to how they started.</p>
          <PillButton className="mt-3" onClick={() => setConfirmReset(true)}>
            Reset Demo Data
          </PillButton>
        </section>
      </div>
      <ConfirmDialog
        open={confirmReset}
        title="Reset the Demo?"
        message="Your sets, practice history and settings in this browser will go back to the sample data."
        confirmLabel="Reset"
        onCancel={() => setConfirmReset(false)}
        onConfirm={async () => {
          setConfirmReset(false);
          await resetDemoData();
          window.location.assign("/");
        }}
      />
    </div>
  );
}

/** The spelling section's answers: the right word next to what the student typed. */
function SpellingAnswers({ answers }: { answers: Array<{ itemId: string; word: string; typed: string; correct: boolean }> }) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold text-ink">My Spelling Words From the Test</h3>
      <table className="mt-2 w-full border-separate border-spacing-y-2 text-left text-lg text-ink">
        <thead>
          <tr className="text-base">
            <th scope="col" className="px-3 font-bold">Word</th>
            <th scope="col" className="px-3 font-bold">I typed</th>
            <th scope="col" className="px-3 font-bold">Result</th>
          </tr>
        </thead>
        <tbody>
          {answers.map((a) => (
            <tr key={a.itemId} className="bg-cream">
              <td className="rounded-l-full px-4 py-2 font-bold">{a.word}</td>
              <td className="px-3 py-2">{a.typed || "—"}</td>
              <td className={cn("rounded-r-full px-3 py-2 font-bold")}>
                <span className="inline-flex items-center gap-1">
                  {a.correct ? <CheckIcon size="1.1em" className="text-[#2E7D32]" /> : <CrossIcon size="0.85em" className="text-[#C62828]" />}
                  {a.correct ? "Right" : "Practice"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
