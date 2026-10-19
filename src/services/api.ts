/**
 * Talks to the Python backend in /backend (FastAPI).
 *
 * Set NEXT_PUBLIC_API_URL (e.g. in .env.local) to turn it on:
 *   NEXT_PUBLIC_API_URL=http://localhost:8000
 * Without it, the services use the in-browser mock data as before.
 */
import type { BankWord, Difficulty, FocusArea, PatternTag } from "@/lib/types";
import { db } from "./mock/db";

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

export function usingBackend(): boolean {
  return API_URL !== "";
}

/** The backend keeps each student's recommender data under this id. */
export function studentId(): string {
  return db().profile.id;
}

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError("We couldn't reach the word hive. Is the backend running?", 0);
  }
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { detail?: unknown } | null;
    const detail = typeof body?.detail === "string" ? body.detail : "Something went wrong. Please try again.";
    throw new ApiError(detail, res.status);
  }
  return res.json() as Promise<T>;
}

/* ---------- Shapes the backend returns (see backend/server.py) ---------- */

export interface ApiWord {
  id: string;
  word: string;
  definition: string;
  /** The dataset's own scale: about 5 (easy) to 230 (very rare). */
  difficulty: number;
  syllables: string[];
  /** Word types from spelling_recommender.get_all_patterns, e.g. "double_l", "vowel_ea". */
  types: string[];
}

export interface ApiFocusArea {
  tag: string;
  label: string;
  tip: string;
  example: string;
  missed: number;
}

export interface ApiWordList {
  studentId: string;
  setNumber: number;
  targetDifficulty: number;
  words: ApiWord[];
  focusAreas: ApiFocusArea[];
  /** null when the student skipped the check-in and hasn't finished a list yet. */
  lastScore: { correct: number; total: number } | null;
}

/** One answer sent to the recommender: the right word and the student's first try. */
export interface ApiAnswer {
  word: string;
  typed: string;
}

/* ---------- Converting to the frontend's types ---------- */

/** Backend word types → the frontend's pattern tags (used for hints). Unlisted types have no hint. */
const TYPE_TO_PATTERN: Array<[RegExp, PatternTag]> = [
  [/^vowel_silent_e$/, "silent-e"],
  [/^vowel_(ai|ay)$/, "vowel-team-ai-ay"],
  [/^vowel_(ea|ie|ei)$/, "vowel-team-ee-ea"],
  [/^consonant_(sh|ch|th|tch)$/, "digraph-sh-ch-th"],
  [/^double_/, "double-consonant"],
  [/^suffix_(tion|sion|cian)$/, "suffix-tion"],
  [/^silent_/, "silent-letter"],
];

export function toPatternTags(word: ApiWord): PatternTag[] {
  const tags = new Set<PatternTag>();
  for (const type of word.types) {
    const match = TYPE_TO_PATTERN.find(([re]) => re.test(type));
    if (match) tags.add(match[1]);
  }
  if (word.syllables.length >= 3) tags.add("multisyllable");
  return [...tags];
}

/** Squeezes the dataset's difficulty (≈5–60 for school words) into the UI's 1–5 scale. */
export function toDifficulty(datasetDifficulty: number): Difficulty {
  return Math.min(5, Math.max(1, Math.ceil((datasetDifficulty - 6) / 8))) as Difficulty;
}

export function toBankWord(word: ApiWord, grade: number): BankWord {
  return {
    id: word.id,
    text: word.word,
    language: "en",
    definition: word.definition,
    exampleSentence: "",
    partOfSpeech: "",
    syllables: word.syllables,
    patterns: toPatternTags(word),
    difficulty: toDifficulty(word.difficulty),
    gradeLevel: grade,
    category: "Recommended for you",
  };
}

export function toFocusArea(area: ApiFocusArea): FocusArea {
  return {
    pattern: { tag: area.tag, label: area.label, tip: area.tip, example: area.example },
    missed: area.missed,
    practiced: 0,
    reason: `You found this tricky ${area.missed === 1 ? "once" : `${area.missed} times`}, so some of your words have it.`,
  };
}
