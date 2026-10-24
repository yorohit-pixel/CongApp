import { PageShell } from "@/components/layout/PageShell";
import { GameLoader } from "@/components/games/GameLoader";

export default function MissingPiecePage() {
  return (
    <PageShell title="Missing Piece" layout="focus" withBeeTrack>
      <GameLoader game="missing-piece" />
    </PageShell>
  );
}
