import { TileGrid, TileLink } from "../ui/Tile";

export const GAMES = [
  {
    href: "/games/letter-detective",
    title: "b or d?",
    text: "Hear a word and find the missing letter.",
    art: "b d p",
  },
  {
    href: "/games/word-builder",
    title: "Build the Word",
    text: "Put the letter tiles in the right order.",
    art: "t a c",
  },
] as const;

/** White game tiles with big easy-read letters as the "picture". */
export function GameTiles({ className }: { className?: string }) {
  return (
    <TileGrid className={className}>
      {GAMES.map((game) => (
        <li key={game.href}>
          <TileLink href={game.href} className="h-full w-full">
            <span aria-hidden="true" className="flex gap-2">
              {game.art.split(" ").map((letter, i) => (
                <span key={i} className="grid h-12 w-12 place-items-center rounded-xl border-2 border-black bg-gold font-easy text-[1.8rem] font-bold">
                  {letter}
                </span>
              ))}
            </span>
            <span className="mt-2 text-[1.4rem] font-bold">{game.title}</span>
            <span className="text-lg">{game.text}</span>
          </TileLink>
        </li>
      ))}
    </TileGrid>
  );
}
