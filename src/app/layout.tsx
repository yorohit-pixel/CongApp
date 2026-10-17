import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible, Open_Sans, Patrick_Hand } from "next/font/google";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import "./globals.css";

// Fonts are downloaded at build time by Next.js and served locally.
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans", display: "swap" });
const patrickHand = Patrick_Hand({ subsets: ["latin"], weight: "400", variable: "--font-patrick", display: "swap" });
const atkinson = Atkinson_Hyperlegible({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-atkinson", display: "swap" });

export const metadata: Metadata = {
  title: "Bee Spelling",
  description: "Friendly reading and spelling practice for kids, one word at a time.",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#2F497B",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-text-size="normal" className={`${openSans.variable} ${patrickHand.variable} ${atkinson.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
