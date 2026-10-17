/**
 * Onboarding "personalization test".
 * This is a practice check-in to choose words, NOT a dyslexia diagnosis.
 * BACKEND: score on the server and store the summary (including every
 * spelling answer) with the profile.
 */
import { getPattern } from "@/data/patterns";
import { ASSESSMENT_ITEMS } from "@/data/seed";
import type {
  AssessmentActivity,
  AssessmentItem,
  AssessmentResponse,
  AssessmentSummary,
  Grade,
  PatternTag,
  SpellingCheckAnswer,
} from "@/lib/types";
import { db, delay, persist } from "./mock/db";

/** Section order. */
export const ASSESSMENT_SECTIONS: AssessmentActivity[] = ["hear-and-type", "sound-match"];

const STRENGTH_LABELS: Record<AssessmentActivity, string> = {
  "hear-and-type": "Hearing a word and spelling it",
  "sound-match": "Listening for sounds in words",
};

/** All sections in order; within each section, easiest → hardest. Every grade gets all 10 spelling words. */
export async function getAssessmentItems(grade: Grade): Promise<AssessmentItem[]> {
  void grade; // BACKEND: may pick grade-appropriate words, keeping 10 spelling words in rising difficulty
  const items = [...ASSESSMENT_ITEMS].sort(
    (a, b) => ASSESSMENT_SECTIONS.indexOf(a.activity) - ASSESSMENT_SECTIONS.indexOf(b.activity) || a.difficulty - b.difficulty,
  );
  return delay(items);
}

export async function submitAssessment(grade: Grade, responses: AssessmentResponse[]): Promise<AssessmentSummary> {
  const byActivity = {
    "hear-and-type": { correct: 0, total: 0 },
    "sound-match": { correct: 0, total: 0 },
  } satisfies AssessmentSummary["byActivity"];

  const missedPatterns = new Map<PatternTag, number>();
  for (const r of responses) {
    byActivity[r.activity].total += 1;
    if (r.correct) byActivity[r.activity].correct += 1;
    else r.patterns.forEach((p) => missedPatterns.set(p, (missedPatterns.get(p) ?? 0) + 1));
  }

  const strengths = (Object.keys(byActivity) as AssessmentActivity[])
    .filter((a) => byActivity[a].total > 0 && byActivity[a].correct / byActivity[a].total >= 0.75)
    .map((a) => STRENGTH_LABELS[a]);

  // Keep every spelling answer (what was typed vs. the right word) for later use.
  const items = new Map(ASSESSMENT_ITEMS.map((i) => [i.id, i]));
  const spelling: SpellingCheckAnswer[] = responses
    .filter((r) => r.activity === "hear-and-type")
    .map((r) => ({
      itemId: r.itemId,
      word: r.answer,
      typed: r.response,
      correct: r.correct,
      difficulty: items.get(r.itemId)?.difficulty ?? 1,
      patterns: r.patterns,
    }));

  const summary: AssessmentSummary = {
    completedAt: new Date().toISOString(),
    grade,
    strengths: strengths.length ? strengths : ["You kept going through every question — that takes effort!"],
    practiceAreas: [...missedPatterns.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tag]) => getPattern(tag)),
    byActivity,
    spelling,
  };

  db().assessment = summary;
  db().profile = { ...db().profile, grade, onboardingComplete: true };
  persist();
  return delay(summary, 300);
}

export async function getLatestAssessment(): Promise<AssessmentSummary | null> {
  return delay(db().assessment, 60);
}
