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

const DRAWINGS: Record<AccessoryId, React.ReactNode> = {
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
  { cx: 192, cy: 128, k: 1.4 }, // neck
  { cx: 190, cy: 93, k: 1.3 }, // face
  { cx: 190, cy: 56, k: 1.6 }, // head
];

export function BeeAccessories({ wearing }: { wearing: AccessoryId[] }) {
  // Neck first, then face, then head, so hats sit on top.
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
  if (["bowtie", "scarf", "medal"].includes(id)) return 0;
  if (["glasses", "sunglasses", "star-glasses"].includes(id)) return 1;
  return 2;
}
