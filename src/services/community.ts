/**
 * Community Sets service.
 * BACKEND: search should run on the server; the mock filters in memory.
 */
import { makeId } from "@/lib/id";
import type { CommunitySet, WordSet } from "@/lib/types";
import { db, delay, persist } from "./mock/db";

/** GET community sets matching a search (title, creator, tag or word). */
export async function searchCommunitySets(query = ""): Promise<CommunitySet[]> {
  const q = query.trim().toLowerCase();
  const sets = db().communitySets.filter((set) => {
    if (!q) return true;
    const haystack = [set.title, set.description, set.creatorName, set.gradeBand, ...set.tags, ...set.words.map((w) => w.text)]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
  return delay([...sets].sort((a, b) => b.saves - a.saves));
}

export async function getCommunitySet(setId: string): Promise<CommunitySet | null> {
  return delay(db().communitySets.find((s) => s.id === setId) ?? null);
}

/** Ids of community sets the student has already saved to My Words. */
export async function getSavedCommunitySetIds(): Promise<string[]> {
  return delay(
    db().mySets.flatMap((s) => (s.source ? [s.source.communitySetId] : [])),
    0,
  );
}

/** POST: copy a community set into My Words so the student can edit it. */
export async function saveCommunitySetToMyWords(setId: string): Promise<WordSet> {
  const existing = db().mySets.find((s) => s.source?.communitySetId === setId);
  if (existing) return delay(existing);
  const community = db().communitySets.find((s) => s.id === setId);
  if (!community) throw new Error("We couldn't find that set.");
  const now = new Date().toISOString();
  const copy: WordSet = {
    id: makeId("set"),
    title: community.title,
    description: community.description,
    language: community.language,
    words: community.words.map((w) => ({ ...w, id: makeId("sw") })),
    createdAt: now,
    updatedAt: now,
    source: { communitySetId: community.id, creatorName: community.creatorName },
  };
  db().mySets.push(copy);
  community.saves += 1;
  persist();
  return delay(copy);
}
