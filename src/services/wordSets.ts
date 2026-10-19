/**
 * My Words service.
 * BACKEND: replace each function body with a call to the real API.
 * Suggested endpoints are listed in docs/BACKEND_INTEGRATION.md.
 */
import { findBankWord, findBankWordByText } from "@/data/wordBank";
import { makeId } from "@/lib/id";
import type { SetWord, WordSet, WordSetInput } from "@/lib/types";
import { db, delay, persist } from "./mock/db";

export const SAVED_WORDS_SET_ID = "set-saved-words";

/** GET the student's sets, newest first. */
export async function getMySets(): Promise<WordSet[]> {
  const sets = [...db().mySets].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return delay(sets);
}

/** GET one of the student's sets. Resolves to null when it does not exist. */
export async function getMySet(setId: string): Promise<WordSet | null> {
  return delay(db().mySets.find((s) => s.id === setId) ?? null);
}

function toSetWords(input: WordSetInput): SetWord[] {
  return input.words
    .map((word) => ({ ...word, text: word.text.trim() }))
    .filter((word) => word.text.length > 0)
    .map((word) => {
      const bank = findBankWordByText(word.text, input.language);
      return {
        id: word.id ?? makeId("sw"),
        text: word.text,
        definition: word.definition?.trim() || bank?.definition,
        bankWordId: bank?.id,
      };
    });
}

/** POST a new set. */
export async function createSet(input: WordSetInput): Promise<WordSet> {
  const now = new Date().toISOString();
  const set: WordSet = {
    id: makeId("set"),
    title: input.title.trim(),
    description: input.description?.trim() || undefined,
    language: input.language,
    words: toSetWords(input),
    createdAt: now,
    updatedAt: now,
  };
  db().mySets.push(set);
  persist();
  return delay(set);
}

/** PUT changes to an existing set. */
export async function updateSet(setId: string, input: WordSetInput): Promise<WordSet> {
  const sets = db().mySets;
  const index = sets.findIndex((s) => s.id === setId);
  if (index === -1) throw new Error("We couldn't find that set.");
  const updated: WordSet = {
    ...sets[index],
    title: input.title.trim(),
    description: input.description?.trim() || undefined,
    language: input.language,
    words: toSetWords(input),
    updatedAt: new Date().toISOString(),
  };
  sets[index] = updated;
  persist();
  return delay(updated);
}

/** DELETE a set. */
export async function deleteSet(setId: string): Promise<void> {
  db().mySets = db().mySets.filter((s) => s.id !== setId);
  persist();
  await delay(null);
}

/**
 * Adds a word-bank word (e.g. the Daily Word) to the "Saved words" set,
 * creating that set the first time.
 */
export async function saveBankWordToMyWords(bankWordId: string): Promise<WordSet> {
  const word = findBankWord(bankWordId);
  if (!word) throw new Error("We couldn't find that word.");
  const now = new Date().toISOString();
  let set = db().mySets.find((s) => s.id === SAVED_WORDS_SET_ID);
  if (!set) {
    set = {
      id: SAVED_WORDS_SET_ID,
      title: "Saved Words",
      description: "Words you saved from Daily Word.",
      language: "en",
      words: [],
      createdAt: now,
      updatedAt: now,
    };
    db().mySets.push(set);
  }
  if (!set.words.some((w) => w.bankWordId === bankWordId)) {
    set.words.push({ id: makeId("sw"), text: word.text, definition: word.definition, bankWordId });
    set.updatedAt = now;
  }
  persist();
  return delay(set);
}

/** True when the bank word is already in "Saved words". */
export async function isBankWordSaved(bankWordId: string): Promise<boolean> {
  const set = db().mySets.find((s) => s.id === SAVED_WORDS_SET_ID);
  return delay(Boolean(set?.words.some((w) => w.bankWordId === bankWordId)), 0);
}
