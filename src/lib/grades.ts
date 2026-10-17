import type { Grade } from "./types";

export function gradeLabel(grade: Grade): string {
  return grade === 0 ? "Kindergarten" : `Grade ${grade}`;
}

export const GRADE_OPTIONS: Array<{ value: Grade; label: string; ariaLabel: string }> = (
  [0, 1, 2, 3, 4, 5, 6, 7, 8] as Grade[]
).map((g) => ({ value: g, label: g === 0 ? "K" : String(g), ariaLabel: gradeLabel(g) }));
