import type {
  AssessmentItem,
  CommunitySet,
  SessionResult,
  SetWord,
  StudentProfile,
  WordSet,
} from "@/lib/types";
import { findBankWord } from "./wordBank";

/** Build set words from bank ids, carrying the definition along. */
function fromBank(ids: string[]): SetWord[] {
  return ids.map((id) => {
    const word = findBankWord(id);
    if (!word) throw new Error(`Seed data references unknown word ${id}`);
    return { id: `sw-${id}`, text: word.text, definition: word.definition, bankWordId: word.id };
  });
}

/* ---------- MOCK: the student's own sets ---------- */

export const SEED_MY_SETS: WordSet[] = [
  {
    id: "set-b-d",
    title: "b and d words",
    description: "Words with the look-alike letters b, d and p.",
    language: "en",
    words: fromBank([
      "w-bed", "w-dog", "w-big", "w-dig", "w-bat", "w-duck",
      "w-desk", "w-pond", "w-bird", "w-puddle",
    ]),
    createdAt: "2026-09-02T16:00:00.000Z",
    updatedAt: "2026-10-12T16:00:00.000Z",
  },
  {
    id: "set-week6",
    title: "Week 6 spelling",
    description: "Magic e words for Friday's spelling check.",
    language: "en",
    words: fromBank(["w-cake", "w-bike", "w-home", "w-smile", "w-stone", "w-shape", "w-whale", "w-flute"]),
    createdAt: "2026-10-05T16:00:00.000Z",
    updatedAt: "2026-10-05T16:00:00.000Z",
  },
];

/* ---------- MOCK: sets shared by other users ---------- */

export const SEED_COMMUNITY_SETS: CommunitySet[] = [
  {
    id: "cs-vowel-teams",
    title: "Vowel team adventure",
    description: "ai, ay, ee and ea words to read and spell.",
    creatorName: "Ms. Rivera",
    language: "en",
    gradeBand: "Grades 1–3",
    tags: ["vowel teams", "long vowels"],
    words: fromBank(["w-rain", "w-play", "w-train", "w-snail", "w-tree", "w-beach", "w-sheep", "w-dream", "w-teacher"]),
    saves: 128,
  },
  {
    id: "cs-animals",
    title: "Animal friends",
    description: "Spell the names of animals from the farm, the pond and the sea.",
    creatorName: "Jayden K.",
    language: "en",
    gradeBand: "Grades K–2",
    tags: ["animals", "short vowels"],
    words: fromBank(["w-cat", "w-frog", "w-rabbit", "w-kitten", "w-bird", "w-turtle", "w-sheep", "w-whale", "w-lamb", "w-snail"]),
    saves: 96,
  },
  {
    id: "cs-tion",
    title: "Words that end in -tion",
    description: "Practice the 'shun' ending.",
    creatorName: "Mr. Okafor",
    language: "en",
    gradeBand: "Grades 3–5",
    tags: ["suffixes", "longer words"],
    words: fromBank(["w-station", "w-action", "w-vacation", "w-question"]),
    saves: 54,
  },
  {
    id: "cs-silent",
    title: "Sneaky silent letters",
    description: "Letters you can see but can't hear.",
    creatorName: "Priya S.",
    language: "en",
    gradeBand: "Grades 2–4",
    tags: ["silent letters"],
    words: fromBank(["w-knee", "w-write", "w-lamb", "w-knock", "w-thumb"]),
    saves: 71,
  },
  {
    id: "cs-bees",
    title: "All about bees",
    description: "Bee and garden words for a science unit.",
    creatorName: "Hive Club",
    language: "en",
    gradeBand: "Grades 2–5",
    tags: ["science", "nature"],
    words: fromBank(["w-honey", "w-pollinate", "w-garden", "w-plant", "w-butterfly", "w-planted"]),
    saves: 43,
  },
  {
    id: "cs-endings",
    title: "Adding -ing and -ed",
    description: "Action words with endings, including double letters.",
    creatorName: "Ms. Rivera",
    language: "en",
    gradeBand: "Grades 2–4",
    tags: ["suffixes", "double letters"],
    words: fromBank(["w-jumped", "w-planted", "w-reading", "w-hopping", "w-swimming"]),
    saves: 62,
  },
];

/* ---------- MOCK: student profile ---------- */

export const SEED_PROFILE: StudentProfile = {
  id: "student-demo",
  displayName: "",
  grade: null,
  avatarColor: "gold",
  onboardingComplete: false,
  joinedAt: "2026-09-01T16:00:00.000Z",
};

/* ---------- MOCK: earlier practice results ---------- */
/* Gives Personalized Practice something to work from on first launch. */

function attempt(id: string, typed: string, correct: boolean, tries = 1, usedHint = false) {
  const word = findBankWord(id)!;
  return { itemId: `sw-${id}`, answer: word.text, typed, correct, tries, usedHint, patterns: word.patterns, bankWordId: id };
}

export const SEED_HISTORY: SessionResult[] = [
  {
    id: "res-seed-1",
    sourceId: "set-week6",
    sourceKind: "my-set",
    title: "Week 6 spelling",
    completedAt: "2026-10-08T22:00:00.000Z",
    attempts: [
      attempt("w-cake", "cake", true),
      attempt("w-bike", "bik", false, 2),
      attempt("w-home", "home", true),
      attempt("w-smile", "smil", false, 2, true),
      attempt("w-stone", "stone", true),
      attempt("w-shape", "shap", false, 2),
      attempt("w-whale", "wale", false, 2),
      attempt("w-flute", "flute", true, 2),
    ],
  },
  {
    id: "res-seed-2",
    sourceId: "cs-vowel-teams",
    sourceKind: "community",
    title: "Vowel team adventure",
    completedAt: "2026-10-10T22:00:00.000Z",
    attempts: [
      attempt("w-rain", "rain", true),
      attempt("w-play", "pla", false, 2),
      attempt("w-train", "trane", false, 2, true),
      attempt("w-tree", "tree", true),
      attempt("w-beach", "beech", false, 2),
      attempt("w-dream", "dream", true),
    ],
  },
];

/* ---------- MOCK: onboarding assessment ---------- */
/* Section 1, Spelling: 10 words, easiest to hardest, one new pattern each. */
/* Section 2, Sound match. */

export const ASSESSMENT_ITEMS: AssessmentItem[] = [
  { id: "s1", activity: "hear-and-type", difficulty: 1, answer: "cat", syllables: ["cat"], patterns: ["short-vowel"] },
  { id: "s2", activity: "hear-and-type", difficulty: 1, answer: "dog", syllables: ["dog"], patterns: ["letter-reversal"] },
  { id: "s3", activity: "hear-and-type", difficulty: 2, answer: "ship", syllables: ["ship"], patterns: ["digraph-sh-ch-th"] },
  { id: "s4", activity: "hear-and-type", difficulty: 2, answer: "frog", syllables: ["frog"], patterns: ["blend"] },
  { id: "s5", activity: "hear-and-type", difficulty: 3, answer: "cake", syllables: ["cake"], patterns: ["silent-e"] },
  { id: "s6", activity: "hear-and-type", difficulty: 3, answer: "rain", syllables: ["rain"], patterns: ["vowel-team-ai-ay"] },
  { id: "s7", activity: "hear-and-type", difficulty: 4, answer: "jumped", syllables: ["jumped"], patterns: ["suffix-ing-ed"] },
  { id: "s8", activity: "hear-and-type", difficulty: 4, answer: "turtle", syllables: ["tur", "tle"], patterns: ["r-controlled", "multisyllable"] },
  { id: "s9", activity: "hear-and-type", difficulty: 5, answer: "knock", syllables: ["knock"], patterns: ["silent-letter"] },
  { id: "s10", activity: "hear-and-type", difficulty: 5, answer: "vacation", syllables: ["va", "ca", "tion"], patterns: ["suffix-tion", "multisyllable"] },
  {
    id: "a8", activity: "sound-match", difficulty: 2, patterns: ["digraph-sh-ch-th"],
    prompt: "Which word starts with the same sound as “shoe”?", targetWord: "shoe",
    choices: ["sock", "ship", "chair"], answer: "ship",
  },
  {
    id: "a8b", activity: "sound-match", difficulty: 2, patterns: ["letter-reversal"],
    prompt: "Which word starts with the same sound as “duck”?", targetWord: "duck",
    choices: ["back", "dish", "pack"], answer: "dish",
  },
  {
    id: "a9", activity: "sound-match", difficulty: 3, patterns: ["vowel-team-ee-ea"],
    prompt: "Which word has the same middle sound as “feet”?", targetWord: "feet",
    choices: ["bead", "bed", "bird"], answer: "bead",
  },
];
