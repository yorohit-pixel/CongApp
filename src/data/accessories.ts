import type { Accessory, AccessoryId, AccessorySlot } from "@/lib/types";

/** The honey shop catalogue. Prices are in honey drops (one drop per word spelled right). */
export const ACCESSORIES: Accessory[] = [
  { id: "flower", name: "Daisy", slot: "head", price: 10 },
  { id: "bow", name: "Big Bow", slot: "head", price: 12 },
  { id: "party-hat", name: "Party Hat", slot: "head", price: 15 },
  { id: "headphones", name: "Headphones", slot: "head", price: 30 },
  { id: "top-hat", name: "Top Hat", slot: "head", price: 40 },
  { id: "wizard-hat", name: "Wizard Hat", slot: "head", price: 50 },
  { id: "crown", name: "Crown", slot: "head", price: 75 },
  { id: "glasses", name: "Reading Glasses", slot: "face", price: 15 },
  { id: "sunglasses", name: "Sunglasses", slot: "face", price: 25 },
  { id: "star-glasses", name: "Star Glasses", slot: "face", price: 35 },
  { id: "bowtie", name: "Bow Tie", slot: "neck", price: 12 },
  { id: "scarf", name: "Cosy Scarf", slot: "neck", price: 20 },
  { id: "medal", name: "Gold Medal", slot: "neck", price: 45 },
  // Badge prizes: clothing that can't be bought, only unlocked by earning badges.
  { id: "sweater", name: "Cozy Sweater", slot: "body", price: 0, badgesNeeded: 3 },
  { id: "rain-boots", name: "Rain Boots", slot: "feet", price: 0, badgesNeeded: 6 },
  { id: "tutu", name: "Sparkly Tutu", slot: "body", price: 0, badgesNeeded: 10 },
  { id: "cape", name: "Superhero Cape", slot: "body", price: 0, badgesNeeded: 15 },
  { id: "jacket", name: "Champion Jacket", slot: "body", price: 0, badgesNeeded: 20 },
  { id: "royal-robe", name: "Royal Robe", slot: "body", price: 0, badgesNeeded: 25 },
];

export const BADGE_PRIZES = ACCESSORIES.filter((a) => a.badgesNeeded !== undefined);

export const SLOT_NAMES: Record<AccessorySlot, string> = { head: "Hats & More", face: "Glasses", neck: "Neck", body: "Outfits", feet: "Shoes" };

const byId = new Map(ACCESSORIES.map((a) => [a.id, a]));
export function findAccessory(id: AccessoryId): Accessory | undefined {
  return byId.get(id);
}
