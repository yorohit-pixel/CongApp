/**
 * Personalized Practice service.
 * BACKEND: return a Recommendation built from the real word bank and the
 * student's real history. The UI only needs the Recommendation shape.
 */
import { WORD_BANK } from "@/data/wordBank";
import { findFocusAreas, selectWordsFromBank } from "@/lib/recommend";
import type { Recommendation } from "@/lib/types";
import { db, delay } from "./mock/db";

export async function getRecommendations(): Promise<Recommendation> {
  const { history, assessment, profile } = db();
  const focusAreas = findFocusAreas(history, assessment);
  const words = selectWordsFromBank(WORD_BANK, focusAreas, history, profile.grade);
  return delay({ generatedAt: new Date().toISOString(), focusAreas, words }, 200);
}
