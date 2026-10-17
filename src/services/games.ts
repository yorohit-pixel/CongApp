/**
 * Word games.
 * BACKEND: return words from the word bank suited to the game and the
 * student's grade. Words are selected, never generated.
 */
import { WORD_BANK } from "@/data/wordBank";
import { shuffle } from "@/lib/games";
import type { BankWord, GameKind } from "@/lib/types";
import { db, delay } from "./mock/db";

export const GAME_ROUNDS: Record<GameKind, number> = { "letter-detective": 8, "word-builder": 6 };

export async function getGameWords(game: GameKind): Promise<BankWord[]> {
  const grade = db().profile.grade ?? 2;
  const english = WORD_BANK.filter((w) => w.language === "en");
  let pool: BankWord[];
  if (game === "letter-detective") {
    // Words with b, d or p; the look-alike-letter words come first.
    const withLetters = english.filter((w) => /[bdp]/.test(w.text) && w.difficulty <= 3);
    const tagged = shuffle(withLetters.filter((w) => w.patterns.includes("letter-reversal")));
    const others = shuffle(withLetters.filter((w) => !w.patterns.includes("letter-reversal")));
    pool = [...tagged, ...others];
  } else {
    // Short words near the student's grade so the tiles stay manageable.
    pool = shuffle(english.filter((w) => w.text.length >= 3 && w.text.length <= 7 && w.gradeLevel <= grade + 1));
  }
  return delay(pool.slice(0, GAME_ROUNDS[game]));
}
