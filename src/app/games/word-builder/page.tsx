import { PageShell } from "@/components/layout/PageShell";
import { GameLoader } from "@/components/games/GameLoader";

export default function WordBuilderPage() {
  return (
    <PageShell title="Build the word" layout="focus" withBeeTrack>
      <GameLoader game="word-builder" />
    </PageShell>
  );
}
