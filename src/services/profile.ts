/** Student profile. BACKEND: tie this to the signed-in account. */
import type { StudentProfile } from "@/lib/types";
import { db, delay, persist, resetDb } from "./mock/db";

export async function getProfile(): Promise<StudentProfile> {
  return delay(db().profile, 60);
}

export async function updateProfile(patch: Partial<Omit<StudentProfile, "id" | "joinedAt">>): Promise<StudentProfile> {
  db().profile = { ...db().profile, ...patch };
  persist();
  return delay(db().profile, 60);
}

/** Demo only: restore the original mock data. */
export async function resetDemoData(): Promise<void> {
  resetDb();
  await delay(null, 60);
}
