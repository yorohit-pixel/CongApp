/**
 * Icon set drawn to match the Canva designs: bold, rounded, single-colour.
 * All icons are decorative (aria-hidden); buttons carry their own labels.
 */
import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number | string };

function Svg({ size = "1em", children, viewBox = "0 0 48 48", ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox={viewBox} fill="none" aria-hidden="true" focusable="false" {...rest}>
      {children}
    </svg>
  );
}

/** Bold tick from the "check" button. */
export function CheckIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 27.5 18 40 44 7" stroke="currentColor" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** Chunky rounded arrow from the "next" button. */
export function ArrowRightIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M6 18h20v-7c0-2 2-3 4-2l14 12c2 2 2 4 0 6L30 39c-2 1-4 0-4-2v-7H6c-2 0-3-1-3-3v-6c0-2 1-3 3-3z"
        fill="currentColor"
      />
    </Svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <g transform="translate(48 0) scale(-1 1)">
        <path
          d="M6 18h20v-7c0-2 2-3 4-2l14 12c2 2 2 4 0 6L30 39c-2 1-4 0-4-2v-7H6c-2 0-3-1-3-3v-6c0-2 1-3 3-3z"
          fill="currentColor"
        />
      </g>
    </Svg>
  );
}

export function SpeakerIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 18c0-2 1-3 3-3h6l11-9c1-1 3 0 3 1v34c0 1-2 2-3 1l-11-9H7c-2 0-3-1-3-3V18z" fill="currentColor" />
      <path d="M32 17c3 2 4 4 4 7s-1 5-4 7" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M37 11c4 3 7 8 7 13s-3 10-7 13" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </Svg>
  );
}

/** Light bulb with an exclamation mark and rays, as in the Hint control. */
export function BulbIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M24 10c-7 0-12 5-12 11 0 4 2 7 5 9 1 1 2 3 2 5v2h10v-2c0-2 1-4 2-5 3-2 5-5 5-9 0-6-5-11-12-11z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M19 41h10M20 45h8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 16v9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="29.5" r="1.8" fill="currentColor" />
      <path
        d="M24 2v4M8 7l3 3M40 7l-3 3M2 21h4M42 21h4M6 33l3-2M42 33l-3-2"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Small filled house used on the results screen's home pill. */
export function HouseIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M24 5 2 24l3 3 3-2.5V44h12V32h8v12h12V24.5l3 2.5 3-3L24 5z" fill="currentColor" />
      <rect x="9" y="4" width="5" height="9" fill="currentColor" />
    </Svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M24 8v32M8 24h32" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    </Svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="4" />
      <path d="m29 29 12 12" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </Svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 13h32M19 13V8h10v5M12 13l2 28h20l2-28" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 20v14M27 20v14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </Svg>
  );
}

export function PencilIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m10 38 2-9L32 9l7 7-20 20-9 2z" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="m28 13 7 7" stroke="currentColor" strokeWidth="3.5" />
    </Svg>
  );
}

export function ChevronUpIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m10 30 14-14 14 14" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m10 18 14 14 14-14" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function CrossIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 12l24 24M36 12 12 36" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    </Svg>
  );
}

export function MicIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="17" y="4" width="14" height="24" rx="7" fill="currentColor" />
      <path d="M10 22c0 8 6 14 14 14s14-6 14-14M24 36v8M16 44h16" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </Svg>
  );
}

export function BookmarkIcon(props: IconProps & { filled?: boolean }) {
  const { filled, ...rest } = props;
  return (
    <Svg {...rest}>
      <path
        d="M12 6h24v38l-12-9-12 9V6z"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinejoin="round"
        fill={filled ? "currentColor" : "none"}
      />
    </Svg>
  );
}

/** Streak flame: orange outer, gold inner. */
export function FlameIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M24 3c2 8 12 13 12 25a12 12 0 0 1-24 0c0-7 4-10 6-15 1 4 3 6 5 6-1-6 0-11 1-16z"
        fill="#FF7A1A"
        stroke="#00245D"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M24 26c2 4 6 6 6 11a6 6 0 0 1-12 0c0-4 3-6 6-11z" fill="#FDB104" />
    </Svg>
  );
}

export function GameIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="5" y="14" width="38" height="22" rx="11" fill="currentColor" />
      <path d="M15 21v8M11 25h8" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <circle cx="31" cy="23" r="2.5" fill="#FFFFFF" />
      <circle cx="36" cy="28" r="2.5" fill="#FFFFFF" />
    </Svg>
  );
}

export function HatIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M14 34V12h20v22" fill="currentColor" />
      <rect x="6" y="32" width="36" height="7" rx="3.5" fill="currentColor" />
      <rect x="14" y="26" width="20" height="5" fill="#FFFFFF" opacity="0.6" />
    </Svg>
  );
}

export function BookIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 10c7-2 13-1 18 3v28c-5-4-11-5-18-3V10z" fill="currentColor" />
      <path d="M42 10c-7-2-13-1-18 3v28c5-4 11-5 18-3V10z" fill="currentColor" opacity="0.75" />
    </Svg>
  );
}

/** A drop of honey: gold fill, navy outline. */
export function HoneyDropIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M24 4C24 4 9 22 9 31a15 15 0 0 0 30 0C39 22 24 4 24 4z" fill="#FDB104" stroke="#00245D" strokeWidth="3" strokeLinejoin="round" />
      <path d="M17 31a7 7 0 0 0 5 7" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
    </Svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="m24 4 6 13 14 2-10 10 2 14-12-7-12 7 2-14L4 19l14-2 6-13z"
        fill="currentColor"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
