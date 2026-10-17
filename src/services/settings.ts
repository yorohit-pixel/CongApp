/** Accessibility settings. BACKEND: store per student so they follow them across devices. */
import type { AccessibilitySettings } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/types";
import { db, delay, persist } from "./mock/db";

export async function getSettings(): Promise<AccessibilitySettings> {
  return delay({ ...DEFAULT_SETTINGS, ...db().settings }, 0);
}

export async function saveSettings(settings: AccessibilitySettings): Promise<AccessibilitySettings> {
  db().settings = settings;
  persist();
  return delay(settings, 0);
}
