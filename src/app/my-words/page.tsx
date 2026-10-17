"use client";

import { PageShell } from "@/components/layout/PageShell";
import { MySetTile } from "@/components/sets/SetTiles";
import { HandHeading } from "@/components/ui/HandHeading";
import { PlusIcon } from "@/components/ui/Icons";
import { LoadingState } from "@/components/ui/Status";
import { TileGrid, TileLink } from "@/components/ui/Tile";
import { useAsync } from "@/hooks/useAsync";
import { getMySets } from "@/services";

export default function MyWordsPage() {
  const { data: sets, loading } = useAsync(getMySets, []);

  return (
    <PageShell title="My words">
      <HandHeading className="lg:-ml-10">My Word Hives</HandHeading>
      <p className="mt-1 max-w-2xl text-lg text-ink">Open a set to review the words, practice, or make changes.</p>
      {loading || !sets ? (
        <LoadingState />
      ) : (
        <TileGrid className="mt-6">
          {sets.map((set) => (
            <MySetTile key={set.id} set={set} />
          ))}
          <li>
            <TileLink href="/create" dashed className="h-full w-full">
              <PlusIcon size="2.4rem" />
              <span className="text-[1.4rem] font-bold">Make a new set</span>
            </TileLink>
          </li>
        </TileGrid>
      )}
    </PageShell>
  );
}
