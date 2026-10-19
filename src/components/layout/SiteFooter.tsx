import Link from "next/link";
import { Meadow } from "../decor/BeeDecor";
import { BeeMascot } from "./BeeMascot";

const LINKS = [
  { href: "/games", label: "Games" },
  { href: "/shop", label: "Honey Shop" },
  { href: "/badges", label: "Badges" },
  { href: "/streak", label: "Streak" },
  { href: "/settings?tab=profile", label: "My Profile" },
  { href: "/settings", label: "Settings" },
];

/** Navy footer with a row of honeycomb and quick links. */
export function SiteFooter() {
  return (
    <footer className="mt-10">
      <Meadow />
      <div className="honeycomb-bar bg-navy px-5 py-8 text-white sm:px-8 lg:px-20">
      <div className="mx-auto flex max-w-[1250px] flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <BeeMascot className="h-auto w-16" />
          <div>
            <p className="font-hand text-[2rem] leading-none">BuzzWords</p>
            <p className="text-base text-white/90">A little practice every day makes a big buzz.</p>
          </div>
        </div>
        <nav aria-label="More pages">
          <ul className="flex flex-wrap gap-2">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center rounded-full border-2 border-white/70 px-4 text-base font-bold text-white hover:bg-white hover:text-navy"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      </div>
    </footer>
  );
}
