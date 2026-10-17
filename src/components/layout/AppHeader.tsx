import { HoneyDrip } from "../decor/BeeDecor";
import { BeeMascot } from "./BeeMascot";
import { HoneycombNav } from "./HoneycombNav";

/**
 * Navy title bar with the big bee (left) and honeycomb navigation (right).
 *
 * Desktop (≥1024px) reproduces the Canva frame: 63px cream strip, 118px bar,
 * title inside the bar, hexagons overhanging below it. On smaller screens
 * the title moves under the bar so long set names never collide with the
 * hexagons. The bar carries a faint honeycomb pattern and drips honey.
 * `showNav={false}` hides the hexagons (used while a new student does the welcome check-in).
 */
export function AppHeader({ title, showNav = true }: { title: string; showNav?: boolean }) {
  return (
    <header className="relative">
      <div className="relative h-[121px] sm:h-[187px] lg:h-[181px]">
        <div className="honeycomb-bar absolute inset-x-0 top-3 h-[76px] bg-navy sm:top-6 sm:h-24 lg:top-[63px] lg:h-[118px]" />
        <HoneyDrip className="absolute inset-x-0 top-[88px] sm:top-[120px] lg:top-[181px]" />
        <BeeMascot className="absolute left-1 top-0 h-auto w-[84px] sm:left-2 sm:w-[140px] lg:left-[15px] lg:w-[212px]" />
        {showNav && (
          <HoneycombNav className="absolute right-1 top-0 z-20 w-[230px] sm:right-2 sm:top-1 sm:w-[330px] lg:right-[14px] lg:top-[8px] lg:w-[410px] xl:w-[470px]" />
        )}
      </div>
      {/* One heading: under the bar on small screens, inside the bar from 1024px up. */}
      <h1 className="px-5 pt-3 text-[2rem] font-bold leading-tight text-ink sm:px-8 sm:text-[2.5rem] lg:absolute lg:left-[235px] lg:right-[440px] lg:top-[63px] lg:flex lg:h-[118px] lg:items-center lg:p-0 lg:text-[clamp(2rem,3.2vw,3.25rem)] lg:leading-[1.1] lg:text-white xl:right-[500px]">
        <span className="line-clamp-2">{title}</span>
      </h1>
    </header>
  );
}
