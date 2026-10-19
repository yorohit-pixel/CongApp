/**
 * Builds a practice session from any word source.
 * Session ids used in URLs: a My Words set id, a community set id,
 * "personalized" or "daily".
 */
import { findBankWord, findBankWordByText } from "@/data/wordBank";
import type { Language, PracticeItem, PracticeSession, SetWord } from "@/lib/types";
import { getCommunitySet } from "./community";
import { getDailyWord } from "./dailyWord";
import { getRecommendations } from "./recommendations";
import { getMySet } from "./wordSets";

export const PERSONALIZED_SOURCE_ID = "personalized";
export const DAILY_SOURCE_ID = "daily";

function itemFromSetWord(word: SetWord, language: Language): PracticeItem {
  const bank = word.bankWordId ? findBankWord(word.bankWordId) : findBankWordByText(word.text, language);
  return {
    id: word.id,
    answer: word.text,
    language,
    definition: word.definition ?? bank?.definition,
    exampleSentence: bank?.exampleSentence,
    syllables: bank?.syllables,
    patterns: bank?.patterns ?? [],
    bankWordId: bank?.id,
  };
}

export async function getPracticeSession(sourceId: string): Promise<PracticeSession | null> {
  if (sourceId === PERSONALIZED_SOURCE_ID) {
    const rec = await getRecommendations();
    return {
      sourceId,
      sourceKind: "personalized",
      title: rec.setNumber ? `Word list ${rec.setNumber}` : "Practice for you",
      items: rec.words.map((w) => ({
        id: `p-${w.id}`,
        answer: w.text,
        language: w.language,
        definition: w.definition,
        exampleSentence: w.exampleSentence,
        syllables: w.syllables,
        patterns: w.patterns,
        bankWordId: w.id,
      })),
    };
  }

  if (sourceId === DAILY_SOURCE_ID) {
    const { word } = await getDailyWord();
    return {
      sourceId,
      sourceKind: "daily",
      title: "Daily word",
      items: [{
        id: `d-${word.id}`,
        answer: word.text,
        language: word.language,
        definition: word.definition,
        exampleSentence: word.exampleSentence,
        syllables: word.syllables,
        patterns: word.patterns,
        bankWordId: word.id,
      }],
    };
  }

  const mine = await getMySet(sourceId);
  if (mine) {
    return { sourceId, sourceKind: "my-set", title: mine.title, items: mine.words.map((w) => itemFromSetWord(w, mine.language)) };
  }
  const community = await getCommunitySet(sourceId);
  if (community) {
    return {
      sourceId,
      sourceKind: "community",
      title: community.title,
      items: community.words.map((w) => itemFromSetWord(w, community.language)),
    };
  }
  return null;
}
