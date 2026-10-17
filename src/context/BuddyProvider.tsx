"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getHive, getProfile, updateProfile } from "@/services";
import type { AccessoryId, BeeColor, HiveState } from "@/lib/types";

interface BuddyContextValue {
  /** The student's first name, or "" if they haven't said. */
  name: string;
  beeColor: BeeColor;
  setBeeColor: (color: BeeColor) => void;
  /** Honey, streak and accessories. Null until loaded. */
  hive: HiveState | null;
  /** What Buzz is wearing right now. */
  wearing: AccessoryId[];
  /** Use the HiveState a hive service returned (after buying, equipping, finishing a game). */
  setHive: (hive: HiveState) => void;
  /** Re-read profile and hive after practice or profile changes. */
  refresh: () => void;
}

const BuddyContext = createContext<BuddyContextValue>({
  name: "",
  beeColor: "gold",
  setBeeColor: () => undefined,
  hive: null,
  wearing: [],
  setHive: () => undefined,
  refresh: () => undefined,
});

/** Keeps the student's name, Buzz's look, honey and streak handy for every page. */
export function BuddyProvider({ children }: { children: ReactNode }) {
  const [name, setName] = useState("");
  const [beeColor, setColor] = useState<BeeColor>("gold");
  const [hive, setHive] = useState<HiveState | null>(null);

  const refresh = useCallback(() => {
    void getProfile().then((p) => {
      setName(p.displayName.trim());
      setColor(p.avatarColor);
    });
    void getHive().then(setHive);
  }, []);

  useEffect(refresh, [refresh]);

  const setBeeColor = useCallback((color: BeeColor) => {
    setColor(color);
    void updateProfile({ avatarColor: color });
  }, []);

  const wearing = useMemo(() => Object.values(hive?.equipped ?? {}) as AccessoryId[], [hive]);

  const value = useMemo(
    () => ({ name, beeColor, setBeeColor, hive, wearing, setHive, refresh }),
    [name, beeColor, setBeeColor, hive, wearing, refresh],
  );
  return <BuddyContext.Provider value={value}>{children}</BuddyContext.Provider>;
}

export function useBuddy() {
  return useContext(BuddyContext);
}
