/** Pure helpers for the word games. */

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/* ---------- Missing Piece ---------- */

/**
 * Common ways a chunk of a word gets misspelled, most believable first.
 * Each rule changes the first match only, so "achievable" with "iev" hidden
 * can become "eiv", "eev" and so on.
 */
const MISSPELLINGS: Array<[RegExp, string]> = [
  // vowel teams
  [/ie/, "ei"],
  [/ei/, "ie"],
  [/ea/, "ee"],
  [/ee/, "ea"],
  [/ai/, "ay"],
  [/ay/, "ai"],
  [/oa/, "o"],
  [/ou/, "ow"],
  [/ow/, "ou"],
  // endings and sounds that are spelled more than one way
  [/tion/, "sion"],
  [/sion/, "tion"],
  [/tion/, "shun"],
  [/able/, "ible"],
  [/ible/, "able"],
  [/ble$/, "bel"],
  [/le$/, "el"],
  [/al$/, "le"],
  [/er/, "ur"],
  [/ur/, "er"],
  [/ir/, "er"],
  [/or/, "er"],
  [/ph/, "f"],
  [/ck/, "k"],
  [/c(?=[aou])/, "k"],
  [/k/, "c"],
  [/c(?=[eiy])/, "s"],
  [/s(?=[eiy])/, "c"],
  [/gh/, "f"],
  [/wh/, "w"],
  [/kn/, "n"],
  [/wr/, "r"],
  [/y$/, "ey"],
  [/y$/, "ie"],
  // double and single letters
  [/([bcdfglmnprstz])\1/, "$1"],
  [/(?<=[aeiou])([bdfglmnprt])(?=[aeiouy])/, "$1$1"],
  // silent e
  [/e$/, ""],
  [/([bcdfgklmnprstvz])$/, "$1e"],
  // look-alike letters and vowel swaps
  [/b/, "d"],
  [/d/, "b"],
  [/p/, "b"],
  [/a/, "e"],
  [/e/, "i"],
  [/i/, "e"],
  [/o/, "u"],
  [/u/, "o"],
];

/** Believable wrong spellings of a chunk, most believable first. */
export function misspellingsOf(chunk: string): string[] {
  const seen = new Set<string>([chunk]);
  const out: string[] = [];
  for (const [pattern, replacement] of MISSPELLINGS) {
    const wrong = chunk.replace(pattern, replacement);
    if (wrong && !seen.has(wrong)) {
      seen.add(wrong);
      out.push(wrong);
    }
  }
  return out;
}

export interface MissingPiecePuzzle {
  before: string;
  missing: string;
  after: string;
  /** The right piece plus look-alike wrong pieces, shuffled. */
  options: string[];
}

/**
 * Hides one syllable of a word: "achievable" (a-chiev-a-ble) might become
 * "a ___ able" with choices like "chiev", "cheiv", "cheev".
 * Prefers a syllable in the middle or end (the first one is usually the easiest to hear).
 */
export function makeMissingPiece(word: string, syllables: string[] | undefined, optionCount = 3): MissingPiecePuzzle | null {
  const parts = syllables && syllables.length > 1 && syllables.join("") === word ? syllables : null;
  if (!parts) return null;
  const candidates = parts.map((_, i) => i).filter((i) => parts[i].length >= 2 && misspellingsOf(parts[i]).length >= optionCount - 1);
  if (candidates.length === 0) return null;
  const later = candidates.filter((i) => i > 0);
  const index = shuffle(later.length > 0 ? later : candidates)[0];
  const missing = parts[index];
  // Pick wrong pieces from the most believable ones, with a little variety.
  const wrong = shuffle(misspellingsOf(missing).slice(0, 5)).slice(0, optionCount - 1);
  return {
    before: parts.slice(0, index).join(""),
    missing,
    after: parts.slice(index + 1).join(""),
    options: shuffle([missing, ...wrong]),
  };
}

/* ---------- Build the Word ---------- */

/** The pieces a word is built from: letters for short words, syllables for long ones. */
export function buildPieces(word: string, syllables: string[] | undefined): string[] {
  if (word.length > 7 && syllables && syllables.length > 1 && syllables.join("") === word) return syllables;
  return Array.from(word);
}

/** Tiles for the word builder, shuffled so they never start in the right order. */
export function scrambleTiles(pieces: string[]): Array<{ id: string; piece: string }> {
  const tiles = pieces.map((piece, i) => ({ id: `${i}-${piece}`, piece }));
  const word = pieces.join("");
  if (new Set(pieces).size < 2) return tiles;
  let mixed = shuffle(tiles);
  while (mixed.map((t) => t.piece).join("") === word) mixed = shuffle(tiles);
  return mixed;
}
