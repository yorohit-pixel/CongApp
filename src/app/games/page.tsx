import { BuzzSays } from "@/components/buddy/BuzzSays";
import { GameTiles } from "@/components/games/GameTiles";
import { PageShell } from "@/components/layout/PageShell";

export default function GamesPage() {
  return (
    <PageShell title="Games">
      <GameTiles />
      <BuzzSays className="mt-12 max-w-3xl" text="Pick a game! Each one takes about two minutes. Ready, set, buzz!" />
    </PageShell>
  );
}
