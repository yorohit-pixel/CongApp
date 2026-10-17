"use client";

import Link from "next/link";
import { GameTiles } from "@/components/games/GameTiles";
import { HivePanel, HomeGreeting } from "@/components/home/HivePanel";
import { PageShell } from "@/components/layout/PageShell";
import { CommunitySetTile, MySetTile } from "@/components/sets/SetTiles";
import { HandHeading } from "@/components/ui/HandHeading";
import { PlusIcon, StarIcon } from "@/components/ui/Icons";
import { TileGrid, TileLink } from "@/components/ui/Tile";
import { LoadingState } from "@/components/ui/Status";
import { useAsync } from "@/hooks/useAsync";
import { getDailyWord, getHistory, getMySets, getSavedCommunitySetIds, searchCommunitySets } from "@/services";

/** Home (designs 3 and 9): "My Word Hives" row, then "Community Hive" grid. */
export default function HomePage() {
  const { data, loading } = useAsync(async () => {
    const [mySets, community, daily, savedIds, history] = await Promise.all([
      getMySets(),
      searchCommunitySets(),
      getDailyWord(),
      getSavedCommunitySetIds(),
      getHistory(),
    ]);
    return { mySets, community, daily, savedIds, history };
  }, []);

  return (
    <PageShell title="Home">
      {loading || !data ? (
        <LoadingState />
      ) : (
        <>
          <HivePanel history={data.history} />

          <section aria-labelledby="my-words-heading" className="mt-6">
            <div className="flex flex-wrap items-baseline gap-x-6 lg:-ml-10">
              <HandHeading id="my-words-heading">My Word Hives</HandHeading>
              <Link href="/my-words" className="text-lg font-bold text-ink underline underline-offset-4">
                See all my words
              </Link>
            </div>
            <TileGrid className="mt-3 lg:mt-3">
              {data.mySets[0] && <MySetTile set={data.mySets[0]} />}
              {data.mySets[1] ? (
                <MySetTile set={data.mySets[1]} />
              ) : (
                <li>
                  <TileLink href="/create" className="h-full w-full">
                    <PlusIcon size="2rem" />
                    <span className="text-[1.4rem] font-bold">Make a new set</span>
                  </TileLink>
                </li>
              )}
              <li>
                <TileLink href="/personalized" className="h-full w-full">
                  <StarIcon size="2rem" className="text-gold" />
                  <span className="text-[1.4rem] font-bold">Practice for you</span>
                  <span className="text-lg">Words picked from the patterns you find tricky</span>
                </TileLink>
              </li>
            </TileGrid>
          </section>

          <section aria-labelledby="games-heading" className="mt-6">
            <div className="flex flex-wrap items-baseline gap-x-6 lg:-ml-5">
              <HandHeading id="games-heading">Games</HandHeading>
              <Link href="/games" className="text-lg font-bold text-ink underline underline-offset-4">
                See all games
              </Link>
            </div>
            <GameTiles className="mt-3 lg:mt-1" />
          </section>

          <section aria-labelledby="community-heading" className="mt-6">
            <div className="flex flex-wrap items-baseline gap-x-6 lg:-ml-5">
              <HandHeading id="community-heading">Community Hive</HandHeading>
              <Link href="/community" className="text-lg font-bold text-ink underline underline-offset-4">
                Search community sets
              </Link>
            </div>
            <TileGrid className="mt-3 lg:mt-1">
              <li>
                <TileLink href="/daily-word" className="h-full w-full" aria-label={`Daily word: ${data.daily.word.text}`}>
                  <span className="text-lg">daily word !</span>
                  <span className="text-[2rem] font-bold">{data.daily.word.text}</span>
                </TileLink>
              </li>
              {data.community.slice(0, 5).map((set) => (
                <CommunitySetTile key={set.id} set={set} saved={data.savedIds.includes(set.id)} />
              ))}
            </TileGrid>
          </section>

          <HomeGreeting className="mt-10 lg:max-w-[1250px]" />
        </>
      )}
    </PageShell>
  );
}
