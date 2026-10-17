import { cn } from "@/lib/cn";

/** Small bee with a dashed loop-the-loop trail (bottom-left of practice screens). */
export function FlyingBee({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 140" className={cn("pointer-events-none select-none", className)} aria-hidden="true" focusable="false">
      <path
        d="M2 132c30-10 60-22 86-24 18-2 22 12 12 18-12 8-28-6-18-22 18-26 70-10 108-20 30-8 50-28 64-48"
        stroke="#1F1F1F"
        strokeWidth="3"
        strokeDasharray="10 9"
        strokeLinecap="round"
        fill="none"
      />
      <g transform="translate(250 6)">
        <ellipse cx="34" cy="14" rx="8" ry="15" transform="rotate(-20 34 14)" fill="#2F497B" />
        <ellipse cx="52" cy="12" rx="7" ry="14" transform="rotate(14 52 12)" fill="#2F497B" />
        <path d="M6 56c-6-22 12-36 40-38 26-2 46 4 50 22 4 20-14 32-42 34-26 2-44-4-48-18z" fill="#FDB104" />
        <g stroke="#2F497B" strokeWidth="3" strokeLinecap="round" fill="none">
          <path d="M22 26c-8 12-8 30 2 46" />
          <path d="M36 21c-8 16-8 36 2 54" />
          <path d="M50 20c-8 16-6 38 4 54" />
          <path d="M64 22c-6 16-4 34 4 50" />
        </g>
        <circle cx="80" cy="42" r="2.6" fill="#2F497B" />
        <circle cx="90" cy="40" r="2.6" fill="#2F497B" />
      </g>
    </svg>
  );
}
