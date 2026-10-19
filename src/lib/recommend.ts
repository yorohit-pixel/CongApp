/**
 * Recommendation rules (pure functions, no data access).
 *
 * The backend should implement the same idea on the server:
 *   1. Look at recent answers and the onboarding assessment.
 *   2. Find the spelling/reading patterns with the most misses.
 *   3. Select related words from the PREDEFINED word bank.
 * Nothing is generated: every recommended word already exists in the bank.
 */
import { getPattern, PATTERNS } from "@/data/patterns";
import type { AssessmentSummary, BankWord, FocusArea, Grade, PatternTag, Recommendation, SessionResult } from "./types";

const isPatternTag = (tag: string): tag is PatternTag => tag in PATTERNS;

interface PatternStats {
  practiced: number;
  missed: number;
  fromAssessment: boolean;
}

const MAX_FOCUS_AREAS = 3;
const WORDS_PER_AREA = 4;

export function findFocusAreas(history: SessionResult[], assessment: AssessmentSummary | null): FocusArea[] {
  const stats = new Map<PatternTag, PatternStats>();
  const bump = (tag: PatternTag) => {
    const s = stats.get(tag) ?? { practiced: 0, missed: 0, fromAssessment: false };
    stats.set(tag, s);
    return s;
  };

  // Only the 10 most recent sessions count, so old mistakes fade out.
  const recent = [...history].sort((a, b) => b.completedAt.localeCompare(a.completedAt)).slice(0, 10);
  for (const session of recent) {
    for (const attempt of session.attempts) {
      for (const tag of attempt.patterns) {
        const s = bump(tag);
        s.practiced += 1;
        // A word counts as "needs practice" if it was wrong or took more than one try.
        if (!attempt.correct || attempt.tries > 1) s.missed += 1;
      }
    }
  }
  for (const area of assessment?.practiceAreas ?? []) {
    // Backend word types (e.g. "vowel_ough") aren't mock pattern tags; skip those.
    if (!isPatternTag(area.tag)) continue;
    const s = bump(area.tag);
    s.fromAssessment = true;
    s.missed += 2;
    s.practiced += 2;
  }

  return [...stats.entries()]
    .filter(([, s]) => s.missed > 0)
    .sort(([, a], [, b]) => b.missed / b.practiced - a.missed / a.practiced || b.missed - a.missed)
    .slice(0, MAX_FOCUS_AREAS)
    .map(([tag, s]) => ({
      pattern: getPattern(tag),
      missed: s.missed,
      practiced: s.practiced,
      reason: s.fromAssessment
        ? "Your personalization test showed this pattern could use more practice."
        : `${s.missed} of ${s.practiced} recent words with this pattern were tricky.`,
    }));
}

export function selectWordsFromBank(
  bank: BankWord[],
  focusAreas: FocusArea[],
  history: SessionResult[],
  grade: Grade | null,
): Recommendation["words"] {
  // Skip words the student already spelled correctly on the first try.
  const mastered = new Set(
    history.flatMap((s) => s.attempts.filter((a) => a.correct && a.tries === 1 && a.bankWordId).map((a) => a.bankWordId!)),
  );
  const targetGrade = grade ?? 2;
  const chosen = new Set<string>();
  const result: Recommendation["words"] = [];

  for (const area of focusAreas) {
    const tag = area.pattern.tag;
    if (!isPatternTag(tag)) continue;
    const candidates = bank
      .filter((w) => w.patterns.includes(tag) && !mastered.has(w.id) && !chosen.has(w.id))
      // Closest to the student's grade first, then easier words first.
      .sort((a, b) => Math.abs(a.gradeLevel - targetGrade) - Math.abs(b.gradeLevel - targetGrade) || a.difficulty - b.difficulty)
      .slice(0, WORDS_PER_AREA);
    for (const word of candidates) {
      chosen.add(word.id);
      result.push({ ...word, matchedPattern: tag });
    }
  }
  return result;
}
