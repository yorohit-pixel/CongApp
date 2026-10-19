/**
 * MOCK in-browser "database".
 *
 * Holds the demo data in memory and mirrors it to localStorage so changes
 * survive a page refresh. This file disappears when the real backend is
 * connected — nothing in `src/components` or `src/app` imports it.
 */
import { SEED_COMMUNITY_SETS, SEED_HISTORY, SEED_MY_SETS, SEED_PROFILE } from "@/data/seed";
import type {
  AccessibilitySettings,
  AccessoryId,
  AccessorySlot,
  AssessmentSummary,
  GameKind,
  CommunitySet,
  SessionResult,
  StudentProfile,
  WordSet,
} from "@/lib/types";
import { makeId } from "@/lib/id";
import { DEFAULT_SETTINGS } from "@/lib/types";

export interface MockDb {
  mySets: WordSet[];
  communitySets: CommunitySet[];
  history: SessionResult[];
  profile: StudentProfile;
  settings: AccessibilitySettings;
  assessment: AssessmentSummary | null;
  hive: {
    spent: number;
    owned: AccessoryId[];
    equipped: Partial<Record<AccessorySlot, AccessoryId>>;
    games: Array<{ game: GameKind; completedAt: string; honey: number }>;
  };
}

// Bump the version when the seed data changes so old demo data isn't reused.
const STORAGE_KEY = "bee-spelling-demo-v2";

/**
 * DEMO: every new visit (new tab or window) starts as a brand-new student,
 * so the full Welcome → settings → grade → test flow shows each time.
 * Reloading the same tab keeps progress. Set to false to keep data between visits.
 */
const FRESH_START_EACH_VISIT = true;
const VISIT_KEY = "bee-spelling-demo-visit";

function isNewVisit(): boolean {
  try {
    if (window.sessionStorage.getItem(VISIT_KEY)) return false;
    window.sessionStorage.setItem(VISIT_KEY, "1");
    return true;
  } catch {
    return false;
  }
}

function seed(): MockDb {
  // structuredClone keeps the seed constants untouched.
  return structuredClone({
    mySets: SEED_MY_SETS,
    communitySets: SEED_COMMUNITY_SETS,
    history: SEED_HISTORY,
    // A new id per demo student, so the Python backend keeps each one's word lists apart.
    profile: { ...SEED_PROFILE, id: makeId("student") },
    settings: DEFAULT_SETTINGS,
    assessment: null,
    hive: { spent: 0, owned: [], equipped: {}, games: [] },
  });
}

let cache: MockDb | null = null;

export function db(): MockDb {
  if (cache) return cache;
  cache = seed();
  if (typeof window !== "undefined") {
    if (FRESH_START_EACH_VISIT && isNewVisit()) {
      resetDb();
      return cache;
    }
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) cache = { ...cache, ...(JSON.parse(raw) as Partial<MockDb>) };
    } catch {
      // Private mode or corrupted data: fall back to the seed.
    }
  }
  return cache;
}

export function persist(): void {
  if (!cache || typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // Storage full or blocked: keep working from memory.
  }
}

export function resetDb(): void {
  cache = seed();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
}

/** Simulates network latency so loading states are visible during the demo. */
export function delay<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}
