import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { CombCluster } from "../decor/BeeDecor";
import { AppHeader } from "./AppHeader";
import { FlyingBee } from "./FlyingBee";
import { SiteFooter } from "./SiteFooter";

interface PageShellProps {
  title: string;
  children: ReactNode;
  /**
   * "focus": single-task screens (practice, test) — content starts lower,
   * centred, with the small flying bee bottom-left like the designs.
   * "browse": lists and grids (home, sets) — content starts right under the bar.
   */
  layout?: "focus" | "browse";
  /** Browse pages whose top-left heading may sit beside the hexagons (like Home). */
  tightTop?: boolean;
  /** Leaves room for the BeeTrack progress bar at the bottom (and hides the decorative flying bee). */
  withBeeTrack?: boolean;
  /** Hide the honeycomb nav (a new student can't leave the welcome check-in anyway). */
  hideNav?: boolean;
  className?: string;
}

export function PageShell({ title, children, layout = "browse", tightTop = false, withBeeTrack = false, hideNav = false, className }: PageShellProps) {
  return (
    <div className="honeycomb-page flex min-h-screen flex-col bg-cream">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <AppHeader title={title} showNav={!hideNav} />
      <main
        id="main"
        tabIndex={-1}
        className={cn(
          "relative flex-1 px-5 pb-16 outline-none sm:px-8 lg:px-20",
          // On desktop the hexagons overhang ~90px below the bar; start content below them.
          layout === "focus" ? "pt-8 sm:pt-10 lg:pt-28 sm:pb-44" : tightTop ? "pt-6 lg:pt-5" : "pt-6 lg:pt-24",
          withBeeTrack && "pb-32 sm:pb-32",
          className,
        )}
      >
        {/* Honeycomb clusters in the side margins on wide screens only, so they never sit behind text. */}
        <CombCluster className="absolute left-0 top-40 hidden w-[60px] 2xl:block" />
        <CombCluster flip className="absolute bottom-24 right-0 hidden w-[60px] 2xl:block" />
        {children}
        {layout === "focus" && !withBeeTrack && (
          <FlyingBee className="absolute bottom-0 left-0 hidden w-[300px] sm:block lg:w-[340px]" />
        )}
      </main>
      {layout === "browse" && <SiteFooter />}
    </div>
  );
}
