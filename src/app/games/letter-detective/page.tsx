import { PageShell } from "@/components/layout/PageShell";
import { GameLoader } from "@/components/games/GameLoader";

export default function LetterDetectivePage() {
  return (
    <PageShell title="b or d?" layout="focus" withBeeTrack>
      <GameLoader game="letter-detective" />
    </PageShell>
  );
}
