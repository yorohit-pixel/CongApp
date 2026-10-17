"use client";

import { useState } from "react";
import { useAsync } from "@/hooks/useAsync";
import type { BankWord, GameKind } from "@/lib/types";
import { getGameWords } from "@/services";
import { ErrorState, LoadingState } from "../ui/Status";
import { PillLink } from "../ui/PillButton";
import { LetterDetective } from "./LetterDetective";
import { WordBuilder } from "./WordBuilder";

/** Loads a fresh set of words for a game and restarts it on "Play again". */
export function GameLoader({ game }: { game: GameKind }) {
  const [playCount, setPlayCount] = useState(0);
  const { data, loading, error } = useAsync<BankWord[]>(() => getGameWords(game), [game, playCount]);

  if (loading) return <LoadingState label="Picking words…" />;
  if (error || !data || data.length === 0) {
    return <ErrorState message="We couldn't find words for this game." action={<PillLink href="/games">Back to games</PillLink>} />;
  }
  const playAgain = () => setPlayCount((n) => n + 1);
  return game === "letter-detective" ? (
    <LetterDetective key={playCount} words={data} onPlayAgain={playAgain} />
  ) : (
    <WordBuilder key={playCount} words={data} onPlayAgain={playAgain} />
  );
}
