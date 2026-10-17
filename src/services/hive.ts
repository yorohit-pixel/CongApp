/**
 * The student's hive: honey to spend, streak, and bee accessories.
 * BACKEND: keep honey, purchases and game results on the server and check
 * the balance there before a purchase. Thrown errors are shown to the child.
 */
import { findAccessory } from "@/data/accessories";
import { honeyDrops } from "@/lib/honey";
import { computeStreak } from "@/lib/streak";
import type { AccessoryId, AccessorySlot, GameResultInput, HiveState } from "@/lib/types";
import { db, delay, persist } from "./mock/db";

function buildHive(): HiveState {
  const { history, hive } = db();
  const gameHoney = hive.games.reduce((sum, g) => sum + g.honey, 0);
  const earned = honeyDrops(history) + gameHoney;
  const activity = [...history.map((s) => s.completedAt), ...hive.games.map((g) => g.completedAt)];
  return {
    honey: { earned, spent: hive.spent, balance: earned - hive.spent },
    streak: computeStreak(activity),
    owned: [...hive.owned],
    equipped: { ...hive.equipped },
    gamesPlayed: hive.games.length,
  };
}

export async function getHive(): Promise<HiveState> {
  return delay(buildHive(), 60);
}

export async function buyAccessory(id: AccessoryId): Promise<HiveState> {
  const item = findAccessory(id);
  if (!item) throw new Error("We couldn't find that item.");
  const hive = db().hive;
  if (hive.owned.includes(id)) return delay(buildHive(), 60);
  const { balance } = buildHive().honey;
  if (balance < item.price) throw new Error(`You need ${item.price - balance} more honey drops for that. Keep practicing!`);
  hive.spent += item.price;
  hive.owned.push(id);
  hive.equipped[item.slot] = id; // put it on straight away
  persist();
  return delay(buildHive(), 120);
}

/** Wear an owned item (replaces whatever is in that slot). */
export async function equipAccessory(id: AccessoryId): Promise<HiveState> {
  const item = findAccessory(id);
  const hive = db().hive;
  if (!item || !hive.owned.includes(id)) throw new Error("You don't have that item yet.");
  hive.equipped[item.slot] = id;
  persist();
  return delay(buildHive(), 60);
}

export async function takeOffAccessory(slot: AccessorySlot): Promise<HiveState> {
  delete db().hive.equipped[slot];
  persist();
  return delay(buildHive(), 60);
}

/** One honey drop per first-try answer; also counts the day toward the streak. */
export async function recordGameResult(result: GameResultInput): Promise<HiveState> {
  db().hive.games.push({ game: result.game, completedAt: new Date().toISOString(), honey: result.firstTryCorrect });
  persist();
  return delay(buildHive(), 60);
}
