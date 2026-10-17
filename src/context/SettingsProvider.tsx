"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getSettings, saveSettings } from "@/services";
import type { AccessibilitySettings } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/types";

interface SettingsContextValue {
  settings: AccessibilitySettings;
  updateSettings: (patch: Partial<AccessibilitySettings>) => void;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  updateSettings: () => undefined,
});

/** Mirrors settings onto <html> data attributes; globals.css does the rest. */
function applyToDocument(s: AccessibilitySettings) {
  const root = document.documentElement;
  root.dataset.textSize = s.textSize;
  root.toggleAttribute("data-easy-read", s.easyReadFont);
  root.toggleAttribute("data-extra-spacing", s.extraSpacing);
  root.dataset.tint = s.backgroundTint;
  root.toggleAttribute("data-plain-bg", !s.honeycombBackground);
  root.toggleAttribute("data-reduce-motion", s.reduceMotion);
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    let cancelled = false;
    getSettings().then((s) => {
      if (!cancelled) setSettings(s);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => applyToDocument(settings), [settings]);

  const updateSettings = useCallback((patch: Partial<AccessibilitySettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      void saveSettings(next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ settings, updateSettings }), [settings, updateSettings]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}
