/**
 * Shared data types for the frontend.
 *
 * These are the shapes the backend should return. Every service in
 * `src/services` speaks only in these types, so swapping the mock
 * implementation for real API calls should not require UI changes.
 */

/** Spelling / reading patterns used to tag words in the word bank. */
export type PatternTag =
  | "short-vowel"
  | "silent-e"
  | "vowel-team-ai-ay"
  | "vowel-team-ee-ea"
  | "vowel-team-oa-ow"
  | "r-controlled"
  | "digraph-sh-ch-th"
  | "blend"
  | "double-consonant"
  | "suffix-ing-ed"
  | "suffix-tion"
  | "silent-letter"
  | "multisyllable"
  | "letter-reversal";

export interface PatternInfo {
  /** A PatternTag, or a backend word type such as "vowel_ough" (see backend/word_types.py). */
  tag: PatternTag | (string & {});
  /** Child-friendly name shown in the UI. */
  label: string;
  /** One short sentence that explains the pattern. */
  tip: string;
  /** A tiny example, e.g. "cap → cape". */
  example: string;
}

export type Difficulty = 1 | 2 | 3 | 4 | 5;
export type Language = "en" | "es";

/** A word in the predefined word bank (owned by the backend). */
export interface BankWord {
  id: string;
  text: string;
  language: Language;
  definition: string;
  exampleSentence: string;
  partOfSpeech: string;
  /** Spoken chunks, e.g. ["bas", "ket"]. Used by the slow audio hint. */
  syllables: string[];
  patterns: PatternTag[];
  difficulty: Difficulty;
  /** Lowest grade where the word is usually taught (0 = kindergarten). */
  gradeLevel: number;
  category: string;
}

/** A word inside a set. `bankWordId` is set when the word exists in the bank. */
export interface SetWord {
  id: string;
  text: string;
  definition?: string;
  bankWordId?: string;
}

export interface WordSet {
  id: string;
  title: string;
  description?: string;
  language: Language;
  words: SetWord[];
  createdAt: string;
  updatedAt: string;
  /** Present when the set was saved from Community Sets. */
  source?: { communitySetId: string; creatorName: string };
}

export interface CommunitySet {
  id: string;
  title: string;
  description: string;
  creatorName: string;
  language: Language;
  gradeBand: string;
  tags: string[];
  words: SetWord[];
  saves: number;
}

export interface WordSetInput {
  title: string;
  description?: string;
  language: Language;
  words: Array<Pick<SetWord, "text" | "definition"> & { id?: string }>;
}

/** One question shown in a practice session. */
export interface PracticeItem {
  id: string;
  /** The correct spelling. */
  answer: string;
  language: Language;
  definition?: string;
  exampleSentence?: string;
  syllables?: string[];
  patterns: PatternTag[];
  bankWordId?: string;
}

/** Where a practice session's words came from. */
export type PracticeSourceKind = "my-set" | "community" | "personalized" | "daily";

export interface PracticeSession {
  sourceId: string;
  sourceKind: PracticeSourceKind;
  title: string;
  items: PracticeItem[];
}

/** The result for one word, recorded when the student moves on. */
export interface WordAttempt {
  itemId: string;
  answer: string;
  typed: string;
  correct: boolean;
  /** How many times "check" was pressed for this word. */
  tries: number;
  usedHint: boolean;
  patterns: PatternTag[];
  bankWordId?: string;
  /** What was typed on the first check (the recommender learns from first tries). */
  firstTyped?: string;
}

export interface SessionResult {
  id: string;
  sourceId: string;
  sourceKind: PracticeSourceKind;
  title: string;
  completedAt: string;
  attempts: WordAttempt[];
}

/** One focus area found from previous answers. */
export interface FocusArea {
  pattern: PatternInfo;
  missed: number;
  practiced: number;
  /** Plain-language reason shown to the student. */
  reason: string;
}

export interface Recommendation {
  generatedAt: string;
  /** Which 10-word list this is (1 = the list made from the assessment quiz). Backend only. */
  setNumber?: number;
  focusAreas: FocusArea[];
  /** Words selected from the word bank, never generated. */
  words: Array<BankWord & { matchedPattern: PatternTag | (string & {}) }>;
}

export interface DailyWord {
  date: string;
  word: BankWord;
}

export type Grade = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type BeeColor = "gold" | "navy" | "green" | "pink" | "purple";

export interface StudentProfile {
  id: string;
  displayName: string;
  grade: Grade | null;
  /** Colour of the student's bee buddy, Buzz. */
  avatarColor: BeeColor;
  onboardingComplete: boolean;
  joinedAt: string;
}

export interface ProgressSummary {
  sessionsCompleted: number;
  wordsPracticed: number;
  wordsCorrect: number;
  streakDays: number;
}

/* ---------- Hive: honey, streaks and bee accessories ---------- */

/** Where an accessory sits on the bee. One item per slot can be worn. */
export type AccessorySlot = "head" | "face" | "neck" | "body" | "feet";

export type AccessoryId =
  | "party-hat"
  | "flower"
  | "bow"
  | "top-hat"
  | "crown"
  | "headphones"
  | "wizard-hat"
  | "glasses"
  | "sunglasses"
  | "star-glasses"
  | "bowtie"
  | "scarf"
  | "medal"
  // Badge prizes (clothing unlocked by earning badges)
  | "sweater"
  | "rain-boots"
  | "tutu"
  | "cape"
  | "jacket"
  | "royal-robe";

export interface Accessory {
  id: AccessoryId;
  name: string;
  slot: AccessorySlot;
  /** Cost in honey drops (0 for badge prizes). */
  price: number;
  /** Badge prizes: free once the student has earned this many badges. */
  badgesNeeded?: number;
}

export interface StreakInfo {
  /** Days in a row with any practice or game, ending today (or yesterday if today isn't done yet). */
  current: number;
  best: number;
  practicedToday: boolean;
  /** The last 7 days, oldest first. */
  lastSevenDays: Array<{ date: string; active: boolean }>;
}

export interface HiveState {
  honey: {
    /** One drop per word spelled right in practice, plus game rewards. */
    earned: number;
    spent: number;
    balance: number;
  };
  streak: StreakInfo;
  owned: AccessoryId[];
  equipped: Partial<Record<AccessorySlot, AccessoryId>>;
  gamesPlayed: number;
}

/** Sent when a game ends. The backend adds honey (one per first-try answer) and counts the day for the streak. */
export interface GameResultInput {
  game: GameKind;
  firstTryCorrect: number;
  rounds: number;
}

/* ---------- Onboarding assessment ---------- */

/**
 * The test has sections, in this order:
 * 1. "hear-and-type" — Spelling: hear a word, type it (10 words, easiest → hardest)
 * 2. "sound-match" — Sound match: pick the word with the same sound
 */
export type AssessmentActivity = "hear-and-type" | "sound-match";

interface AssessmentItemBase {
  id: string;
  activity: AssessmentActivity;
  difficulty: Difficulty;
  patterns: PatternTag[];
}

export interface HearAndTypeItem extends AssessmentItemBase {
  activity: "hear-and-type";
  answer: string;
  syllables: string[];
}

export interface SoundMatchItem extends AssessmentItemBase {
  activity: "sound-match";
  prompt: string;
  /** Word spoken aloud as the target sound. */
  targetWord: string;
  choices: string[];
  answer: string;
}

export type AssessmentItem = HearAndTypeItem | SoundMatchItem;

export interface AssessmentResponse {
  itemId: string;
  activity: AssessmentActivity;
  patterns: PatternTag[];
  /** Right on the first try. */
  correct: boolean;
  /** What the student typed (spelling) or chose (sound match), exactly as entered. */
  response: string;
  /** The correct word for this question. */
  answer: string;
}

/** One spelling-section answer, kept for later use (e.g. reports, picking practice words). */
export interface SpellingCheckAnswer {
  itemId: string;
  /** The correct spelling. */
  word: string;
  /** What the student typed. */
  typed: string;
  correct: boolean;
  difficulty: Difficulty;
  patterns: PatternTag[];
}

export interface AssessmentSummary {
  completedAt: string;
  grade: Grade;
  strengths: string[];
  practiceAreas: PatternInfo[];
  /** Right answers per section. */
  byActivity: Record<AssessmentActivity, { correct: number; total: number }>;
  /** Every spelling answer: typed vs. correct word, easiest first. */
  spelling: SpellingCheckAnswer[];
}

/* ---------- Games ---------- */

/** "letter-detective": pick b, d or p to finish a word. "word-builder": put shuffled letter tiles in order. */
export type GameKind = "letter-detective" | "word-builder";

/* ---------- Accessibility settings ---------- */

export type TextSize = "normal" | "large" | "x-large";
export type SpeechRate = "slow" | "normal";
/** Page background colour. Some readers with dyslexia find a tinted page easier to read. */
export type BackgroundTint = "cream" | "blue" | "yellow" | "green" | "peach";

export interface AccessibilitySettings {
  textSize: TextSize;
  easyReadFont: boolean;
  extraSpacing: boolean;
  backgroundTint: BackgroundTint;
  /** Faint honeycomb pattern on the page background. Some readers prefer a plain page. */
  honeycombBackground: boolean;
  reduceMotion: boolean;
  speechRate: SpeechRate;
  /** Name of the browser voice Buzz uses. null = pick the friendliest one automatically. */
  voiceName: string | null;
  autoPlayWord: boolean;
  showDefinitions: boolean;
}

export const DEFAULT_SETTINGS: AccessibilitySettings = {
  textSize: "normal",
  easyReadFont: false,
  extraSpacing: false,
  backgroundTint: "cream",
  honeycombBackground: true,
  reduceMotion: false,
  speechRate: "slow",
  voiceName: null,
  autoPlayWord: false,
  showDefinitions: true,
};
