/** Pure helpers for the word games. */

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const LOOK_ALIKE_LETTERS = ["b", "d", "p"] as const;
export type LookAlikeLetter = (typeof LOOK_ALIKE_LETTERS)[number];

/** Hides the first b, d or p in a word: "dog" → { before: "", missing: "d", after: "og" }. */
export function hideLookAlikeLetter(word: string): { before: string; missing: LookAlikeLetter; after: string } | null {
  const index = word.search(/[bdp]/);
  if (index < 0) return null;
  return { before: word.slice(0, index), missing: word[index] as LookAlikeLetter, after: word.slice(index + 1) };
}

/** Letter tiles for the word builder, shuffled so they never start in the right order. */
export function scrambleTiles(word: string): Array<{ id: string; letter: string }> {
  const tiles = Array.from(word).map((letter, i) => ({ id: `${i}-${letter}`, letter }));
  if (new Set(word).size < 2) return tiles;
  let mixed = shuffle(tiles);
  while (mixed.map((t) => t.letter).join("") === word) mixed = shuffle(tiles);
  return mixed;
}
