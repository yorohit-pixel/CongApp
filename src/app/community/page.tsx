"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { CommunitySetTile } from "@/components/sets/SetTiles";
import { HandHeading } from "@/components/ui/HandHeading";
import { SearchIcon } from "@/components/ui/Icons";
import { LoadingState } from "@/components/ui/Status";
import { TileGrid } from "@/components/ui/Tile";
import { useAsync } from "@/hooks/useAsync";
import { getSavedCommunitySetIds, searchCommunitySets } from "@/services";

const QUICK_SEARCHES = ["animals", "vowel teams", "silent letters", "double letters", "suffixes"];

export default function CommunityPage() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  const { data, loading } = useAsync(async () => {
    const [sets, savedIds] = await Promise.all([searchCommunitySets(debounced), getSavedCommunitySetIds()]);
    return { sets, savedIds };
  }, [debounced]);

  return (
    <PageShell title="Community Sets">
      <HandHeading className="lg:-ml-10">Community Hive</HandHeading>
      <p className="mt-1 max-w-2xl text-lg text-ink">Word sets made by other students and teachers. Open one to practice it or save it to My words.</p>

      <form role="search" className="mt-6 max-w-[45rem]" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="community-search" className="text-lg font-bold text-ink">
          Search by name, word, topic or creator
        </label>
        <div className="relative mt-2">
          <SearchIcon size="1.6rem" className="absolute left-6 top-1/2 -translate-y-1/2 text-ink" />
          <input
            id="community-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="try “animals”"
            className="h-[4.2rem] w-full rounded-full border border-black bg-white pl-16 pr-6 text-xl font-bold text-ink placeholder:text-ink/60"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2" aria-label="Quick searches">
          {QUICK_SEARCHES.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setQuery(q)}
              className="min-h-11 rounded-full border border-black bg-white px-4 text-base font-bold text-ink hover:bg-[#FFF6DA]"
            >
              {q}
            </button>
          ))}
          {query && (
            <button type="button" onClick={() => setQuery("")} className="min-h-11 px-3 text-base font-bold text-ink underline underline-offset-4">
              Clear Search
            </button>
          )}
        </div>
      </form>

      <p aria-live="polite" className="mt-6 text-lg font-bold text-ink">
        {!loading && data && (data.sets.length === 0 ? `No sets found for “${debounced}”. Try another word.` : `${data.sets.length} ${data.sets.length === 1 ? "set" : "sets"} found`)}
      </p>

      {loading || !data ? (
        <LoadingState />
      ) : (
        <TileGrid className="mt-4">
          {data.sets.map((set) => (
            <CommunitySetTile key={set.id} set={set} saved={data.savedIds.includes(set.id)} />
          ))}
        </TileGrid>
      )}
    </PageShell>
  );
}
