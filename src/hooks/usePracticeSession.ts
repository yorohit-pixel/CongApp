"use client";

import { useCallback, useMemo, useState } from "react";
import { pick, PRAISE } from "@/lib/cheers";
import { checkSpelling } from "@/lib/spelling";
import type { PracticeItem, WordAttempt } from "@/lib/types";

export type ItemStatus = "idle" | "correct" | "incorrect" | "revealed";

export interface Feedback {
  tone: "correct" | "incorrect" | "info";
  message: string;
}

interface ItemState {
  typed: string;
  /** What was typed on the first check. */
  firstTyped: string | null;
  status: ItemStatus;
  tries: number;
  usedHint: boolean;
  hintOpen: boolean;
  feedback: Feedback | null;
}

const freshItem: ItemState = { typed: "", firstTyped: null, status: "idle", tries: 0, usedHint: false, hintOpen: false, feedback: null };

/**
 * All practice-session rules live here, separate from the UI:
 * one word at a time, check → feedback, optional hint, reveal after
 * two tries, and a list of attempts for the results screen.
 */
export function usePracticeSession(initialItems: PracticeItem[]) {
  const [items, setItems] = useState(initialItems);
  const [index, setIndex] = useState(0);
  const [item, setItem] = useState<ItemState>(freshItem);
  const [attempts, setAttempts] = useState<WordAttempt[]>([]);
  const [finished, setFinished] = useState(false);

  const current = items[index];

  const setTyped = useCallback((typed: string) => {
    // Editing after a wrong answer clears the red so the student can re-check.
    setItem((s) => ({
      ...s,
      typed,
      status: s.status === "incorrect" ? "idle" : s.status,
      feedback: s.status === "incorrect" ? null : s.feedback,
    }));
  }, []);

  const check = useCallback(() => {
    if (!current) return;
    setItem((s) => {
      if (s.status === "correct") return s;
      if (!s.typed.trim()) {
        return { ...s, feedback: { tone: "info", message: "Type your spelling in the box first." } };
      }
      const outcome = checkSpelling(s.typed, current.answer);
      const tries = s.tries + 1;
      if (s.firstTyped === null) s = { ...s, firstTyped: s.typed.trim() };
      if (s.status === "revealed") {
        // Copying the revealed word is practice, but it still counts as "needs practice".
        return outcome.status === "incorrect"
          ? { ...s, tries, feedback: { tone: "info", message: `Look carefully: ${spellOut(current.answer)}.` } }
          : { ...s, tries, feedback: { tone: "correct", message: "Nice copying! Tap the arrow for the next word." } };
      }
      if (outcome.status === "correct") {
        return { ...s, tries, status: "correct", feedback: { tone: "correct", message: pick(PRAISE) } };
      }
      if (outcome.status === "correct-missing-accent") {
        return {
          ...s,
          tries,
          status: "correct",
          feedback: { tone: "correct", message: `Correct! Remember the accent mark: ${current.answer}.` },
        };
      }
      const start =
        outcome.lettersRight > 0
          ? `You got the first ${outcome.lettersRight === 1 ? "letter" : `${outcome.lettersRight} letters`} right.`
          : "Listen to the word again.";
      const next = tries >= 2 ? "Try again, use a hint, or tap “Show me the word”." : "Try again, or tap Hint for help.";
      return { ...s, tries, status: "incorrect", feedback: { tone: "incorrect", message: `Not quite yet. ${start} ${next}` } };
    });
  }, [current]);

  const toggleHint = useCallback(() => {
    setItem((s) => ({ ...s, hintOpen: !s.hintOpen, usedHint: true }));
  }, []);

  const reveal = useCallback(() => {
    if (!current) return;
    setItem((s) => ({
      ...s,
      status: "revealed",
      typed: "",
      feedback: { tone: "info", message: `The word is spelled ${spellOut(current.answer)}. Type it once to practice, then tap the arrow.` },
    }));
  }, [current]);

  /** Records the current word and moves on. Returns false if the word was not checked yet. */
  const next = useCallback((): boolean => {
    if (!current) return false;
    if (item.status === "idle" && item.tries === 0) {
      setItem((s) => ({ ...s, feedback: { tone: "info", message: "Tap check first to see how you did." } }));
      return false;
    }
    const attempt: WordAttempt = {
      itemId: current.id,
      answer: current.answer,
      typed: item.typed.trim(),
      correct: item.status === "correct",
      tries: Math.max(1, item.tries),
      usedHint: item.usedHint,
      patterns: current.patterns,
      bankWordId: current.bankWordId,
      firstTyped: item.firstTyped ?? item.typed.trim(),
    };
    setAttempts((a) => [...a, attempt]);
    if (index + 1 >= items.length) {
      setFinished(true);
    } else {
      setIndex(index + 1);
      setItem(freshItem);
    }
    return true;
  }, [current, item, index, items.length]);

  const restart = useCallback((nextItems?: PracticeItem[]) => {
    setItems(nextItems ?? initialItems);
    setIndex(0);
    setItem(freshItem);
    setAttempts([]);
    setFinished(false);
  }, [initialItems]);

  const progress = useMemo(() => ({ current: index + 1, total: items.length }), [index, items.length]);

  return { items, current, item, attempts, finished, progress, setTyped, check, toggleHint, reveal, next, restart };
}

export function spellOut(word: string): string {
  return Array.from(word).join("-");
}
