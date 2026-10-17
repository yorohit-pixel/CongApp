import { BookIcon } from "../ui/Icons";
import { TileLink } from "../ui/Tile";
import type { CommunitySet, WordSet } from "@/lib/types";

function count(n: number) {
  return `${n} ${n === 1 ? "word" : "words"}`;
}

/** A My Words set as a white tile: "b and d words · 10 words". */
export function MySetTile({ set }: { set: WordSet }) {
  return (
    <li>
      <TileLink href={`/my-words/${set.id}`} className="h-full w-full">
        <BookIcon size="2.2rem" className="text-navy" />
        <span className="text-[1.4rem] font-bold leading-snug">{set.title}</span>
        <span className="text-lg">{count(set.words.length)}</span>
        {set.source && <span className="text-base text-ink/80">from {set.source.creatorName}</span>}
      </TileLink>
    </li>
  );
}

/** A community set tile: title, creator and word count. */
export function CommunitySetTile({ set, saved }: { set: CommunitySet; saved?: boolean }) {
  return (
    <li>
      <TileLink href={`/community/${set.id}`} className="h-full w-full">
        <span className="text-[1.4rem] font-bold leading-snug">{set.title}</span>
        <span className="text-lg">
          by {set.creatorName} · {count(set.words.length)}
        </span>
        <span className="text-base text-ink/80">{set.gradeBand}</span>
        {saved && <span className="mt-1 rounded-full bg-[#E9F8E0] px-3 py-0.5 text-base font-bold text-[#1B5E20]">✓ In My Words</span>}
      </TileLink>
    </li>
  );
}

export { count as wordCount };
