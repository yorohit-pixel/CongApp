import type { AccessoryId } from "@/lib/types";

/**
 * Accessory drawings in the BeeMascot's 230 × 200 coordinate space.
 * The head is on the right: eyes at (178, 96) and (202, 90), top of the head around y = 50.
 */
const NAVY = "#2F497B";
const PINK = "#FF5FA2";
const RED = "#E53935";

function Star({ cx, cy, r, fill }: { cx: number; cy: number; r: number; fill: string }) {
  const points = Array.from({ length: 10 }, (_, i) => {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const radius = i % 2 === 0 ? r : r * 0.45;
    return `${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`;
  }).join(" ");
  return <polygon points={points} fill={fill} stroke={NAVY} strokeWidth="2.5" strokeLinejoin="round" />;
}

const PURPLE = "#6B4FBB";
const GOLD = "#FFE066";

/** The bee's middle, for clothes that follow the body's shape. */
const SHIRT = "M26 96 C36 62 76 44 118 42 C140 41 156 45 166 52 C172 90 172 142 164 184 C130 198 70 198 32 172 C20 148 20 120 26 96 Z";
const CAPE = "M172 70 C130 18 30 6 -16 46 C-28 108 -12 172 28 208 C78 216 124 196 152 162 Z";

/** Parts drawn BEHIND the bee's body (capes and robes). */
const BACK: Partial<Record<AccessoryId, React.ReactNode>> = {
  cape: <path d={CAPE} fill={RED} stroke={NAVY} strokeWidth="3" strokeLinejoin="round" />,
  "royal-robe": (
    <g>
      <path d="M174 64 C122 24 20 30 -6 78 C-18 136 4 188 44 212 C90 218 132 198 158 164 Z" fill={PURPLE} stroke="#FFFFFF" strokeWidth="10" strokeLinejoin="round" />
      <path d="M174 64 C122 24 20 30 -6 78 C-18 136 4 188 44 212 C90 218 132 198 158 164 Z" fill="none" stroke={NAVY} strokeWidth="2.5" strokeLinejoin="round" />
      {[[-8, 110], [-6, 150], [10, 186], [40, 210], [60, 36], [110, 34]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" fill="#1F1F1F" />
      ))}
    </g>
  ),
};

const DRAWINGS: Record<AccessoryId, React.ReactNode> = {
  sweater: (
    <g>
      <path d={SHIRT} fill="#4FC3F7" stroke={NAVY} strokeWidth="3" strokeLinejoin="round" />
      <path d="M30 98 L166 90 M26 128 L168 122 M34 158 L166 154" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
      <path d="M161 54 C167 92 167 142 159 180" stroke="#0288D1" strokeWidth="9" fill="none" strokeLinecap="round" />
    </g>
  ),
  jacket: (
    <g>
      <path d={SHIRT} fill="#C62828" stroke={NAVY} strokeWidth="3" strokeLinejoin="round" />
      <path d="M161 54 C167 92 167 142 159 180" stroke="#FFFFFF" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M34 168 C70 190 124 190 162 178" stroke="#FFFFFF" strokeWidth="7" fill="none" strokeLinecap="round" />
      <circle cx="96" cy="112" r="24" fill={GOLD} stroke={NAVY} strokeWidth="3" />
      <text x="96" y="122" textAnchor="middle" fontSize="27" fontWeight="800" fill={NAVY} fontFamily="Arial, sans-serif">A+</text>
    </g>
  ),
  tutu: (
    <g stroke={NAVY} strokeWidth="2.5" strokeLinejoin="round">
      <path
        d="M34 148 Q70 166 104 166 Q140 166 174 150 L184 176 Q170 188 158 180 Q148 198 128 188 Q112 204 96 190 Q80 202 66 188 Q50 196 42 180 Q24 182 28 164 Z"
        fill="#FFB3D1"
      />
      <path d="M34 148 Q70 166 104 166 Q140 166 174 150" fill="none" stroke={PINK} strokeWidth="7" />
      <Star cx={70} cy={178} r={5} fill="#FFFFFF" />
      <Star cx={120} cy={180} r={5} fill="#FFFFFF" />
      <Star cx={160} cy={168} r={4} fill="#FFFFFF" />
    </g>
  ),
  cape: (
    <g stroke={NAVY} strokeWidth="2.5" strokeLinejoin="round">
      <path d="M150 112 L172 120 L150 132 Z" fill={RED} />
      <circle cx="160" cy="122" r="7" fill={GOLD} />
    </g>
  ),
  "royal-robe": (
    <g stroke={NAVY} strokeWidth="2.5">
      <path d="M150 110 Q162 124 152 140" fill="none" stroke={GOLD} strokeWidth="5" />
      <circle cx="158" cy="124" r="7" fill={GOLD} />
    </g>
  ),
  "rain-boots": (
    <g strokeLinecap="round" strokeLinejoin="round">
      <path d="M88 186 L86 204 M132 184 L134 202" stroke={NAVY} strokeWidth="5" />
      <path d="M76 200 h20 v10 a4 4 0 0 1 -4 4 h-20 a6 6 0 0 1 -2 -8 z" fill={GOLD} stroke={NAVY} strokeWidth="3" />
      <path d="M124 198 h20 v10 a4 4 0 0 1 -4 4 h-20 a6 6 0 0 1 -2 -8 z" fill={GOLD} stroke={NAVY} strokeWidth="3" />
    </g>
  ),
  "party-hat": (
    <g>
      <polygon points="166,56 212,48 194,2" fill={PINK} stroke={NAVY} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="184" cy="38" r="3.5" fill="#FFFFFF" />
      <circle cx="196" cy="24" r="3" fill="#FFE066" />
      <circle cx="200" cy="44" r="3" fill="#FFE066" />
      <circle cx="194" cy="3" r="7" fill="#FFE066" stroke={NAVY} strokeWidth="2.5" />
    </g>
  ),
  flower: (
    <g>
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse key={deg} cx="190" cy="30" rx="8" ry="13" fill="#FFFFFF" stroke={NAVY} strokeWidth="2.5" transform={`rotate(${deg} 190 42)`} />
      ))}
      <circle cx="190" cy="42" r="8" fill="#FFE066" stroke={NAVY} strokeWidth="2.5" />
    </g>
  ),
  bow: (
    <g stroke={NAVY} strokeWidth="3" strokeLinejoin="round">
      <path d="M190 42 L164 26 Q158 42 164 58 Z" fill={PINK} />
      <path d="M190 42 L216 26 Q222 42 216 58 Z" fill={PINK} />
      <circle cx="190" cy="42" r="7" fill="#FFB3D1" />
    </g>
  ),
  "top-hat": (
    <g transform="rotate(-6 189 50)" stroke={NAVY} strokeWidth="3">
      <rect x="170" y="6" width="40" height="44" rx="3" fill="#1F1F1F" />
      <rect x="170" y="36" width="40" height="8" fill={RED} />
      <rect x="158" y="48" width="64" height="9" rx="4" fill="#1F1F1F" />
    </g>
  ),
  crown: (
    <g>
      <path d="M164 56 L164 24 L177 38 L190 14 L203 38 L216 24 L216 56 Z" fill="#FFE066" stroke={NAVY} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="177" cy="48" r="4" fill={RED} />
      <circle cx="190" cy="46" r="4.5" fill="#4FC3F7" />
      <circle cx="203" cy="48" r="4" fill={RED} />
    </g>
  ),
  headphones: (
    <g>
      <path d="M150 96 C148 30 228 26 226 92" stroke={NAVY} strokeWidth="8" fill="none" strokeLinecap="round" />
      <rect x="140" y="82" width="20" height="32" rx="8" fill={PINK} stroke={NAVY} strokeWidth="3" />
      <rect x="216" y="78" width="18" height="32" rx="8" fill={PINK} stroke={NAVY} strokeWidth="3" />
    </g>
  ),
  "wizard-hat": (
    <g>
      <path d="M162 54 Q182 10 204 0 Q196 24 216 50 Z" fill="#6B4FBB" stroke={NAVY} strokeWidth="3" strokeLinejoin="round" />
      <ellipse cx="189" cy="54" rx="32" ry="7" fill="#6B4FBB" stroke={NAVY} strokeWidth="3" />
      <Star cx={190} cy={32} r={7} fill="#FFE066" />
      <circle cx="200" cy="16" r="2.5" fill="#FFE066" />
    </g>
  ),
  glasses: (
    <g stroke={NAVY} strokeWidth="3.5" fill="#FFFFFF55">
      <circle cx="178" cy="96" r="13" />
      <circle cx="204" cy="90" r="12" />
      <path d="M191 93 L192 92" fill="none" />
      <path d="M165 96 L148 92" fill="none" strokeLinecap="round" />
    </g>
  ),
  sunglasses: (
    <g stroke={NAVY} strokeWidth="3">
      <rect x="163" y="86" width="28" height="20" rx="8" fill="#1F1F1F" />
      <rect x="192" y="80" width="26" height="19" rx="8" fill="#1F1F1F" />
      <path d="M191 92 L192 90" />
      <path d="M163 94 L146 90" strokeLinecap="round" />
      <path d="M169 91 l8 -2" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M197 85 l7 -2" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  ),
  "star-glasses": (
    <g>
      <path d="M190 93 L193 91" stroke={NAVY} strokeWidth="3" />
      <path d="M163 96 L146 92" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
      <Star cx={178} cy={96} r={16} fill={PINK} />
      <Star cx={204} cy={90} r={15} fill={PINK} />
      <circle cx="178" cy="97" r="5" fill={NAVY} />
      <circle cx="204" cy="91" r="5" fill={NAVY} />
    </g>
  ),
  bowtie: (
    <g stroke={NAVY} strokeWidth="3" strokeLinejoin="round">
      <path d="M194 130 L174 118 L174 142 Z" fill={RED} />
      <path d="M194 130 L214 118 L214 142 Z" fill={RED} />
      <circle cx="194" cy="130" r="6" fill="#FF8A80" />
    </g>
  ),
  scarf: (
    <g strokeLinecap="round">
      <path d="M160 56 C150 92 152 122 166 156" stroke={NAVY} strokeWidth="21" fill="none" />
      <path d="M160 56 C150 92 152 122 166 156" stroke={RED} strokeWidth="15" fill="none" />
      <path d="M156 78 l12 2 M153 100 l12 1 M156 124 l12 -1" stroke="#FFFFFF" strokeWidth="4" />
      <path d="M163 146 L150 186" stroke={NAVY} strokeWidth="17" />
      <path d="M163 146 L150 186" stroke={RED} strokeWidth="11" />
    </g>
  ),
  medal: (
    <g stroke={NAVY} strokeWidth="3" strokeLinejoin="round">
      <path d="M176 112 L190 140 L204 112" fill="none" stroke="#4FC3F7" strokeWidth="8" />
      <circle cx="190" cy="150" r="13" fill="#FFE066" />
      <Star cx={190} cy={150} r={7} fill="#FDB104" />
    </g>
  ),
};

/** Each layer is enlarged around the point where it sits on the bee, so items read clearly even on small bees. */
const LAYER_SCALE: Array<{ cx: number; cy: number; k: number }> = [
  { cx: 110, cy: 190, k: 1 }, // feet
  { cx: 100, cy: 120, k: 1 }, // body (outfits follow the body, so no enlarging)
  { cx: 192, cy: 128, k: 1.4 }, // neck
  { cx: 190, cy: 93, k: 1.3 }, // face
  { cx: 190, cy: 56, k: 1.6 }, // head
];

/**
 * part="front" (default) draws on top of the bee; part="back" draws the bits that go
 * behind its body (BeeMascot renders that before the body).
 */
export function BeeAccessories({ wearing, part = "front" }: { wearing: AccessoryId[]; part?: "front" | "back" }) {
  if (part === "back") {
    return <>{wearing.map((id) => BACK[id] && <g key={id}>{BACK[id]}</g>)}</>;
  }
  // Feet, then outfits, then neck, face and head, so hats sit on top.
  const order: AccessoryId[] = [...wearing].sort((a, b) => layer(a) - layer(b));
  return (
    <>
      {order.map((id) => {
        const { cx, cy, k } = LAYER_SCALE[layer(id)];
        return (
          <g key={id} transform={`translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`}>
            {DRAWINGS[id]}
          </g>
        );
      })}
    </>
  );
}

function layer(id: AccessoryId): number {
  if (id === "rain-boots") return 0;
  if (["sweater", "jacket", "tutu", "cape", "royal-robe"].includes(id)) return 1;
  if (["bowtie", "scarf", "medal"].includes(id)) return 2;
  if (["glasses", "sunglasses", "star-glasses"].includes(id)) return 3;
  return 4;
}
