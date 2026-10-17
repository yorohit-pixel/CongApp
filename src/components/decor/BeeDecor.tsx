/**
 * Purely decorative bee-themed drawings. All are aria-hidden, static, and
 * kept out from behind reading text (margins, header, footer, celebrations).
 */
import { cn } from "@/lib/cn";

const GOLD = "#FDB104";
const NAVY = "#2F497B";
const INK = "#00245D";

/** Flat-topped hexagon centred on (cx, cy). */
export function hexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

function MiniBee({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx="-4" cy="-12" rx="5" ry="9" transform="rotate(-20 -4 -12)" fill={NAVY} opacity="0.85" />
      <ellipse cx="6" cy="-13" rx="4.5" ry="8.5" transform="rotate(15 6 -13)" fill={NAVY} opacity="0.85" />
      <ellipse cx="0" cy="0" rx="17" ry="12" fill={GOLD} />
      <path d="M-9 -9c-3 6-3 12 0 18M-2 -11c-3 7-3 15 0 22M5 -11c-3 7-3 15 0 22" stroke={NAVY} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <circle cx="11" cy="-2" r="1.8" fill={NAVY} />
    </g>
  );
}

/** Gold honey dripping from the bottom edge of the navy title bar. */
export function HoneyDrip({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("honey-drip pointer-events-none", className)} />;
}

/** A strip of meadow (grass, flowers, a hive and a buzzing bee) that sits on top of the footer. */
export function Meadow({ className }: { className?: string }) {
  const flowers = [
    { x: 70, c: "#FF9EC7", h: 46 },
    { x: 190, c: "#FFFFFF", h: 34 },
    { x: 330, c: "#B79CFF", h: 50 },
    { x: 520, c: "#FFFFFF", h: 40 },
    { x: 640, c: "#FF9EC7", h: 30 },
    { x: 860, c: "#FFE066", h: 48 },
    { x: 1010, c: "#FFFFFF", h: 36 },
    { x: 1260, c: "#B79CFF", h: 44 },
    { x: 1380, c: "#FF9EC7", h: 34 },
  ];
  return (
    <svg viewBox="0 0 1440 110" preserveAspectRatio="xMidYMax slice" className={cn("block h-[90px] w-full", className)} aria-hidden="true">
      {/* hills */}
      <path d="M0 80 C 200 50, 380 70, 560 62 S 920 44, 1100 62 S 1340 58, 1440 50 V110 H0z" fill="#9BD67A" />
      <path d="M0 92 C 240 72, 480 90, 720 80 S 1200 70, 1440 84 V110 H0z" fill="#7ED957" />
      {/* flowers */}
      {flowers.map((f) => (
        <g key={f.x}>
          <path d={`M${f.x} 100 V${100 - f.h}`} stroke="#3E8E2A" strokeWidth="3" />
          <path d={`M${f.x} ${100 - f.h / 2} q 10 -8 16 -2 q -8 6 -16 2`} fill="#3E8E2A" />
          {[0, 72, 144, 216, 288].map((d) => (
            <ellipse key={d} cx={f.x} cy={100 - f.h - 8} rx="5" ry="8" fill={f.c} stroke={INK} strokeWidth="1.5" transform={`rotate(${d} ${f.x} ${100 - f.h})`} />
          ))}
          <circle cx={f.x} cy={100 - f.h} r="5" fill={GOLD} stroke={INK} strokeWidth="1.5" />
        </g>
      ))}
      {/* beehive */}
      <g transform="translate(1150 34)">
        <path d="M0 -6 L0 8" stroke="#6B4423" strokeWidth="4" />
        <ellipse cx="0" cy="18" rx="22" ry="12" fill={GOLD} stroke={INK} strokeWidth="2" />
        <ellipse cx="0" cy="34" rx="28" ry="13" fill={GOLD} stroke={INK} strokeWidth="2" />
        <ellipse cx="0" cy="50" rx="24" ry="11" fill={GOLD} stroke={INK} strokeWidth="2" />
        <ellipse cx="0" cy="40" rx="6" ry="5" fill={INK} />
      </g>
      {/* bee with a dashed loop */}
      <path d="M560 40 c 30 -24 60 -6 44 8 c -14 12 -30 -10 -6 -22 c 30 -14 70 6 96 -6" stroke={INK} strokeWidth="2" strokeDasharray="6 6" fill="none" strokeLinecap="round" />
      <MiniBee x={714} y={30} s={0.9} />
    </svg>
  );
}

/** A loose cluster of honeycomb cells with a bee, for page margins on wide screens. */
export function CombCluster({ className, flip = false }: { className?: string; flip?: boolean }) {
  const cells: Array<[number, number, boolean]> = [
    [30, 30, true],
    [30, 82, false],
    [75, 56, true],
    [75, 108, false],
    [30, 134, true],
    [75, 160, false],
  ];
  return (
    <svg viewBox="0 0 110 220" className={cn("pointer-events-none", className)} aria-hidden="true" style={flip ? { transform: "scaleX(-1)" } : undefined}>
      {cells.map(([x, y, filled]) => (
        <polygon key={`${x}-${y}`} points={hexPoints(x, y, 28)} fill={filled ? GOLD : "none"} fillOpacity={filled ? 0.35 : 0} stroke={GOLD} strokeWidth="3" strokeOpacity="0.7" />
      ))}
      <path d="M50 196 c 10 10 24 8 30 -2" stroke={INK} strokeWidth="1.8" strokeDasharray="4 5" fill="none" opacity="0.6" />
      <MiniBee x={30} y={196} s={0.8} />
    </svg>
  );
}

/** Hexagons, flowers and stars in an arc, shown above "All Done!!!". */
export function CelebrationBurst({ className }: { className?: string }) {
  const bits: Array<{ x: number; y: number; kind: "hex" | "flower" | "star"; c: string; r: number }> = [
    { x: 20, y: 52, kind: "hex", c: GOLD, r: 10 },
    { x: 58, y: 24, kind: "flower", c: "#FF9EC7", r: 9 },
    { x: 100, y: 40, kind: "star", c: "#FFE066", r: 9 },
    { x: 140, y: 12, kind: "hex", c: "#7ED957", r: 8 },
    { x: 180, y: 34, kind: "flower", c: "#FFFFFF", r: 10 },
    { x: 220, y: 10, kind: "star", c: GOLD, r: 11 },
    { x: 260, y: 34, kind: "flower", c: "#B79CFF", r: 10 },
    { x: 300, y: 12, kind: "hex", c: "#FF9EC7", r: 8 },
    { x: 340, y: 40, kind: "star", c: "#FFE066", r: 9 },
    { x: 382, y: 24, kind: "flower", c: "#FF9EC7", r: 9 },
    { x: 420, y: 52, kind: "hex", c: GOLD, r: 10 },
  ];
  return (
    <svg viewBox="0 0 440 66" className={cn("h-auto w-full max-w-[22rem]", className)} aria-hidden="true">
      {bits.map((b) =>
        b.kind === "hex" ? (
          <polygon key={b.x} points={hexPoints(b.x, b.y, b.r)} fill={b.c} stroke={INK} strokeWidth="2" />
        ) : b.kind === "flower" ? (
          <g key={b.x}>
            {[0, 72, 144, 216, 288].map((d) => (
              <ellipse key={d} cx={b.x} cy={b.y - b.r * 0.7} rx={b.r * 0.5} ry={b.r * 0.8} fill={b.c} stroke={INK} strokeWidth="1.5" transform={`rotate(${d} ${b.x} ${b.y})`} />
            ))}
            <circle cx={b.x} cy={b.y} r={b.r * 0.45} fill={GOLD} stroke={INK} strokeWidth="1.5" />
          </g>
        ) : (
          <polygon
            key={b.x}
            points={Array.from({ length: 10 }, (_, i) => {
              const a = (Math.PI / 5) * i - Math.PI / 2;
              const rr = i % 2 === 0 ? b.r : b.r * 0.45;
              return `${(b.x + rr * Math.cos(a)).toFixed(1)},${(b.y + rr * Math.sin(a)).toFixed(1)}`;
            }).join(" ")}
            fill={b.c}
            stroke={INK}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        ),
      )}
      <MiniBee x={220} y={54} s={0.75} />
    </svg>
  );
}

/** Three tiny honeycomb cells, used before handwritten headings. */
export function CombMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 40" className={cn("inline-block h-[0.7em] w-auto align-middle", className)} aria-hidden="true">
      <polygon points={hexPoints(11, 12, 10)} fill={GOLD} stroke={INK} strokeWidth="2.5" />
      <polygon points={hexPoints(27, 21, 10)} fill={GOLD} stroke={INK} strokeWidth="2.5" />
      <polygon points={hexPoints(11, 30, 10)} fill="#FFFFFF" stroke={INK} strokeWidth="2.5" />
    </svg>
  );
}
