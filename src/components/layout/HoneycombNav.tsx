"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * The gold honeycomb navigation: six flat-topped hexagons in four columns.
 * Even columns hold two hexagons, odd columns one (sitting between them), like real honeycomb.
 * Positions are percentages of the cluster box (505 × 263 units) so it scales cleanly.
 * Profile lives inside Settings; the streak is on Home and in My profile.
 */
interface HexLink {
  href: string;
  label: string;
  /** column 0–3 and row: "top", "bottom" (even columns) or "mid" (odd columns) */
  col: number;
  row: "top" | "mid" | "bottom";
  icon: ReactNode;
  isActive: (path: string) => boolean;
}

const HEX_POINTS = "37,6 105,6 136,64 105,122 37,122 6,64";
const BOX_W = 505;
const BOX_H = 263;
const HEX_W = 142;
const HEX_H = 128;
const COL_STEP = 121;
const ROW_TOP: Record<HexLink["row"], number> = { top: 0, mid: 67.5, bottom: 135 };

function HexIconHome() {
  return (
    <g fill="#FFFFFF">
      <path d="M71 30 38 59l5 6 28-25 28 25 5-6-33-29z" />
      <path d="M48 62v34h17V80h12v16h17V62L71 42 48 62z" />
      <rect x="45" y="32" width="7" height="14" />
    </g>
  );
}

function HexIconPlus() {
  return (
    <g>
      <circle cx="71" cy="64" r="31" fill="#FFFFFF" />
      <path d="M71 47v34M54 64h34" stroke="#FDB104" strokeWidth="6" strokeLinecap="round" />
    </g>
  );
}

function HexIconGear() {
  const teeth = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <g>
      {teeth.map((deg) => (
        <rect key={deg} x="64" y="28" width="14" height="16" rx="3" fill="#FFFFFF" transform={`rotate(${deg} 71 64)`} />
      ))}
      <circle cx="71" cy="64" r="27" fill="#FFFFFF" />
      <circle cx="71" cy="64" r="11" fill="#FDB104" />
    </g>
  );
}

function HexIconGames() {
  return (
    <g>
      <rect x="33" y="44" width="76" height="42" rx="21" fill="#FFFFFF" />
      <path d="M53 55v20M43 65h20" stroke="#FDB104" strokeWidth="6" strokeLinecap="round" />
      <circle cx="88" cy="58" r="5.5" fill="#FDB104" />
      <circle cx="96" cy="70" r="5.5" fill="#FDB104" />
    </g>
  );
}

function HexIconShop() {
  // A honey pot
  return (
    <g>
      <rect x="45" y="32" width="52" height="12" rx="5" fill="#FFFFFF" />
      <path d="M42 50h58c4 0 6 3 6 7 0 22-12 37-35 37S36 79 36 57c0-4 2-7 6-7z" fill="#FFFFFF" />
      <path d="M50 62c5 4 9 4 13 0s9-4 13 0 9 4 13 0" stroke="#FDB104" strokeWidth="5" fill="none" strokeLinecap="round" />
    </g>
  );
}

function HexIconBadge() {
  return (
    <g>
      <path d="M56 70 46 100l14-6 8 12 6-30M86 70l10 30-14-6-8 12-6-30" fill="#FFFFFF" />
      <circle cx="71" cy="54" r="24" fill="#FFFFFF" />
      <path d="m71 40 4.5 9.5 10.5 1.5-7.5 7 2 10.5-9.5-5-9.5 5 2-10.5-7.5-7 10.5-1.5z" fill="#FDB104" />
    </g>
  );
}

export function HoneycombNav({ className }: { className?: string }) {
  const pathname = usePathname() ?? "/";

  const links: HexLink[] = [
    { href: "/", label: "Home", col: 0, row: "top", icon: <HexIconHome />, isActive: (p) => p === "/" },
    { href: "/create", label: "Create a Word Set", col: 0, row: "bottom", icon: <HexIconPlus />, isActive: (p) => p.startsWith("/create") },
    { href: "/games", label: "Games", col: 1, row: "mid", icon: <HexIconGames />, isActive: (p) => p.startsWith("/games") },
    { href: "/shop", label: "Honey Shop", col: 2, row: "top", icon: <HexIconShop />, isActive: (p) => p.startsWith("/shop") },
    { href: "/badges", label: "My Badges", col: 2, row: "bottom", icon: <HexIconBadge />, isActive: (p) => p.startsWith("/badges") },
    {
      href: "/settings",
      label: "Settings and My Profile",
      col: 3,
      row: "mid",
      icon: <HexIconGear />,
      isActive: (p) => p.startsWith("/settings") || p.startsWith("/profile"),
    },
  ];

  return (
    <nav aria-label="Main" className={cn("pointer-events-none aspect-[505/263]", className)}>
      <ul className="relative h-full w-full">
        {links.map((link) => {
          const active = link.isActive(pathname);
          return (
            <li
              key={link.href}
              className="absolute"
              style={{
                left: `${((link.col * COL_STEP) / BOX_W) * 100}%`,
                top: `${(ROW_TOP[link.row] / BOX_H) * 100}%`,
                width: `${(HEX_W / BOX_W) * 100}%`,
                height: `${(HEX_H / BOX_H) * 100}%`,
              }}
            >
              <Link
                href={link.href}
                aria-label={link.label}
                aria-current={active ? "page" : undefined}
                title={link.label}
                className="hex-link group block h-full w-full rounded-[22%]"
              >
                {/* Only the painted hexagon is clickable, so the empty corners of the
                    cluster never block page content underneath. */}
                <svg viewBox="0 0 142 128" className="h-full w-full overflow-visible" aria-hidden="true" focusable="false">
                  <polygon
                    points={HEX_POINTS}
                    fill="#FDB104"
                    stroke="#FDB104"
                    strokeWidth="12"
                    strokeLinejoin="round"
                    className="transition-[fill,stroke] group-hover:fill-[#F2A400] group-hover:stroke-[#F2A400]"
                  />
                  {link.icon}
                  {active && (
                    <polygon
                      points={HEX_POINTS}
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="5"
                      strokeLinejoin="round"
                      transform="translate(71 64) scale(0.84) translate(-71 -64)"
                    />
                  )}
                </svg>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
