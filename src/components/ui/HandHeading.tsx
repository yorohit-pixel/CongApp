import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { CombMark } from "../decor/BeeDecor";

/** Handwritten navy section heading ("My Word Hives", "Community Hive") with a little honeycomb mark. */
export function HandHeading({
  children,
  as: Tag = "h2",
  className,
  id,
}: {
  children: ReactNode;
  as?: "h2" | "h3";
  className?: string;
  id?: string;
}) {
  return (
    <Tag id={id} className={cn("font-hand text-[2.6rem] leading-tight text-ink lg:text-[3.1rem]", className)}>
      <CombMark className="mr-2 -mt-1" />
      {children}
    </Tag>
  );
}
