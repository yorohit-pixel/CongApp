import type { Accessory, AccessoryId, AccessorySlot } from "@/lib/types";

/** The honey shop catalogue. Prices are in honey drops (one drop per word spelled right). */
export const ACCESSORIES: Accessory[] = [
  { id: "flower", name: "Daisy", slot: "head", price: 10 },
  { id: "bow", name: "Big bow", slot: "head", price: 12 },
  { id: "party-hat", name: "Party hat", slot: "head", price: 15 },
  { id: "headphones", name: "Headphones", slot: "head", price: 30 },
  { id: "top-hat", name: "Top hat", slot: "head", price: 40 },
  { id: "wizard-hat", name: "Wizard hat", slot: "head", price: 50 },
  { id: "crown", name: "Crown", slot: "head", price: 75 },
  { id: "glasses", name: "Reading glasses", slot: "face", price: 15 },
  { id: "sunglasses", name: "Sunglasses", slot: "face", price: 25 },
  { id: "star-glasses", name: "Star glasses", slot: "face", price: 35 },
  { id: "bowtie", name: "Bow tie", slot: "neck", price: 12 },
  { id: "scarf", name: "Cosy scarf", slot: "neck", price: 20 },
  { id: "medal", name: "Gold medal", slot: "neck", price: 45 },
];

export const SLOT_NAMES: Record<AccessorySlot, string> = { head: "Hats & more", face: "Glasses", neck: "Neck" };

const byId = new Map(ACCESSORIES.map((a) => [a.id, a]));
export function findAccessory(id: AccessoryId): Accessory | undefined {
  return byId.get(id);
}
