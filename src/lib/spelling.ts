import type { PracticeItem } from "./types";

/** Lowercase, trim and collapse spaces. Keeps accents. */
export function normalize(text: string): string {
  return text.trim().replace(/\s+/g, " ").toLowerCase();
}

/** Remove accent marks so "arbol" can be compared to "árbol". */
export function stripAccents(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export type CheckOutcome =
  | { status: "correct" }
  /** Right letters, missing an accent mark. Counted as correct with a gentle note. */
  | { status: "correct-missing-accent" }
  | { status: "incorrect"; lettersRight: number };

export function checkSpelling(typed: string, answer: string): CheckOutcome {
  const a = normalize(typed);
  const b = normalize(answer);
  if (a === b) return { status: "correct" };
  if (stripAccents(a) === stripAccents(b)) return { status: "correct-missing-accent" };

  // Count matching letters from the start so feedback can be encouraging.
  let lettersRight = 0;
  while (lettersRight < Math.min(a.length, b.length) && a[lettersRight] === b[lettersRight]) {
    lettersRight += 1;
  }
  return { status: "incorrect", lettersRight };
}

/**
 * A written hint that reveals the first chunk and the word's length,
 * e.g. "ca _ _ _ (5 letters)". Never reveals the whole word.
 */
export function buildWordHint(item: PracticeItem): { pattern: string; text: string } {
  const letters = Array.from(item.answer);
  const firstChunk = item.syllables && item.syllables.length > 1 ? Array.from(item.syllables[0]).length : 1;
  const reveal = Math.min(firstChunk, Math.max(1, letters.length - 2));
  const pattern = letters.map((ch, i) => (i < reveal || ch === " " ? ch : "_")).join(" ");
  const chunkCount = item.syllables?.length ?? 1;
  const chunks = chunkCount > 1 ? ` It has ${chunkCount} chunks: clap them as you listen.` : "";
  return {
    pattern,
    text: `It starts with “${letters.slice(0, reveal).join("")}” and has ${letters.length} letters.${chunks}`,
  };
}
