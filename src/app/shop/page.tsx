"use client";

import Link from "next/link";
import { useState } from "react";
import { BuzzSays } from "@/components/buddy/BuzzSays";
import { BeeMascot } from "@/components/layout/BeeMascot";
import { PageShell } from "@/components/layout/PageShell";
import { HoneyDropIcon } from "@/components/ui/Icons";
import { PillButton, PillLink } from "@/components/ui/PillButton";
import { LoadingState } from "@/components/ui/Status";
import { useBuddy } from "@/context/BuddyProvider";
import { ACCESSORIES, BADGE_PRIZES, findAccessory, SLOT_NAMES } from "@/data/accessories";
import { useAsync } from "@/hooks/useAsync";
import { cn } from "@/lib/cn";
import type { Accessory, AccessoryId, AccessorySlot, HiveState } from "@/lib/types";
import { buyAccessory, claimBadgePrize, equipAccessory, getEarnedBadgeCount, takeOffAccessory } from "@/services";

/** Slots with things to buy (outfits and shoes are badge prizes only). */
const SLOTS: AccessorySlot[] = ["head", "face", "neck"];

/** The honey shop: spend honey drops on things for Buzz to wear. */
export default function ShopPage() {
  const { hive, setHive, beeColor } = useBuddy();
  const [preview, setPreview] = useState<AccessoryId | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const badges = useAsync(getEarnedBadgeCount, []);

  if (!hive) {
    return (
      <PageShell title="Honey Shop">
        <LoadingState />
      </PageShell>
    );
  }

  // The mirror shows what Buzz wears now, with the previewed item swapped into its slot.
  const mirror = { ...hive.equipped };
  const previewItem = preview ? findAccessory(preview) : undefined;
  if (previewItem) mirror[previewItem.slot] = previewItem.id;
  const mirrorWearing = Object.values(mirror) as AccessoryId[];

  const act = async (run: () => Promise<HiveState>, success: string) => {
    setBusy(true);
    try {
      setHive(await run());
      setMessage(success);
      setPreview(null);
      badges.reload(); // new things can earn the fashion badges
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Something went wrong. Try again!");
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageShell title="Honey Shop">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[22rem_1fr] lg:items-start">
        {/* Mirror */}
        <aside aria-label="Buzz's mirror" className="card-pop rounded-[2.5rem] bg-white p-7 text-center lg:sticky lg:top-6">
          <div className="mx-auto grid h-56 w-56 place-items-center rounded-full border-2 border-dashed border-ink/40 bg-cream">
            <BeeMascot color={beeColor} wearing={mirrorWearing} className="h-auto w-44" />
          </div>
          {previewItem && !hive.owned.includes(previewItem.id) && (
            <p className="mt-3 text-base font-bold text-ink">Trying on: {previewItem.name}</p>
          )}
          {/* What just happened (bought, wearing, not enough honey), right where the student is looking. */}
          <p role="status" className="mt-3 min-h-6 text-base font-bold text-ink">
            {message ?? ""}
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#FFF6DA] px-5 py-2 text-[1.6rem] font-bold text-ink">
            <HoneyDropIcon size="2rem" />
            {hive.honey.balance}
            <span className="text-lg">honey</span>
          </p>
          <p className="mt-2 text-base text-ink">Spell words right to earn more. Every right word = 1 drop.</p>
          <PillLink href="/personalized" variant="gold" className="mt-4">
            Earn Honey
          </PillLink>
        </aside>

        <div className="grid gap-8">
          <section aria-labelledby="slot-prizes" className="rounded-[2.5rem] border-2 border-dashed border-ink/40 bg-[#FFF6DA] p-5 sm:p-6">
            <h2 id="slot-prizes" className="font-hand text-[2.4rem] leading-tight text-ink">
              Badge Prizes
            </h2>
            <p className="text-lg text-ink">
              Outfits you can't buy with honey. Earn badges to unlock them!{" "}
              <span className="font-bold">
                You have {badges.data ?? "…"} {badges.data === 1 ? "badge" : "badges"}.
              </span>{" "}
              <Link href="/badges" className="font-bold underline underline-offset-4">
                See my badges
              </Link>
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {BADGE_PRIZES.map((item) => {
                const owned = hive.owned.includes(item.id);
                const wearing = hive.equipped[item.slot] === item.id;
                const need = (item.badgesNeeded ?? 0) - (badges.data ?? 0);
                return (
                  <li
                    key={item.id}
                    className={cn(
                      "card-pop flex flex-col items-center rounded-[2rem] border-2 bg-white p-4 text-center",
                      wearing ? "border-[#2E7D32]" : preview === item.id ? "border-gold" : "border-transparent",
                    )}
                  >
                    <BeeMascot color={beeColor} wearing={[item.id]} className="mt-6 h-auto w-28" />
                    <h3 className="mt-4 text-lg font-bold leading-tight text-ink">{item.name}</h3>
                    <p className="text-base font-bold text-ink">
                      {owned ? (wearing ? "✓ Wearing" : "✓ Yours") : need > 0 ? `🔒 ${item.badgesNeeded} badges` : "✓ Unlocked!"}
                    </p>
                    <div className="mt-3 flex w-full flex-col gap-2">
                      {wearing ? (
                        <PillButton onClick={() => act(() => takeOffAccessory(item.slot), `I took off the ${item.name.toLowerCase()}.`)} disabled={busy} className="min-h-12 w-full px-3 text-base">
                          Take Off<span className="sr-only"> {item.name}</span>
                        </PillButton>
                      ) : need > 0 && !owned ? (
                        <p className="rounded-full bg-cream px-3 py-2 text-sm font-bold text-ink">
                          {need} more {need === 1 ? "badge" : "badges"}
                        </p>
                      ) : (
                        <PillButton
                          variant="gold"
                          onClick={() => act(() => claimBadgePrize(item.id), owned ? `Now I'm wearing the ${item.name.toLowerCase()}.` : `Wow, a ${item.name.toLowerCase()}! You earned it with your badges!`)}
                          disabled={busy}
                          className="min-h-12 w-full px-3 text-base"
                        >
                          {owned ? "Wear It" : "Claim It"}
                          <span className="sr-only"> {item.name}</span>
                        </PillButton>
                      )}
                      {!wearing && (
                        <button
                          type="button"
                          onClick={() => setPreview(preview === item.id ? null : item.id)}
                          aria-pressed={preview === item.id}
                          className="min-h-11 rounded-full text-base font-bold text-ink underline underline-offset-4 hover:bg-black/5"
                        >
                          {preview === item.id ? "Stop Trying On" : "Try On"}
                          <span className="sr-only"> {item.name}</span>
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
          {SLOTS.map((slot) => (
            <section key={slot} aria-labelledby={`slot-${slot}`}>
              <h2 id={`slot-${slot}`} className="font-hand text-[2.4rem] leading-tight text-ink">
                {SLOT_NAMES[slot]}
              </h2>
              <ul className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {ACCESSORIES.filter((a) => a.slot === slot && a.badgesNeeded === undefined).map((item) => (
                  <ShopItem
                    key={item.id}
                    item={item}
                    owned={hive.owned.includes(item.id)}
                    wearing={hive.equipped[item.slot] === item.id}
                    previewing={preview === item.id}
                    balance={hive.honey.balance}
                    busy={busy}
                    beeColor={beeColor}
                    onPreview={() => setPreview(preview === item.id ? null : item.id)}
                    onBuy={() => act(() => buyAccessory(item.id), `Yay! I love my new ${item.name.toLowerCase()}! Thank you!`)}
                    onWear={() => act(() => equipAccessory(item.id), `Now I'm wearing the ${item.name.toLowerCase()}.`)}
                    onTakeOff={() => act(() => takeOffAccessory(item.slot), `I took off the ${item.name.toLowerCase()}.`)}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
      <BuzzSays
        className="mx-auto mt-12 max-w-3xl"
        text={message ?? "Pick something for me to wear! Tap “Try On” to see how it looks first."}
      />
    </PageShell>
  );
}

function ShopItem({
  item,
  owned,
  wearing,
  previewing,
  balance,
  busy,
  beeColor,
  onPreview,
  onBuy,
  onWear,
  onTakeOff,
}: {
  item: Accessory;
  owned: boolean;
  wearing: boolean;
  previewing: boolean;
  balance: number;
  busy: boolean;
  beeColor: Parameters<typeof BeeMascot>[0]["color"];
  onPreview: () => void;
  onBuy: () => void;
  onWear: () => void;
  onTakeOff: () => void;
}) {
  const short = item.price - balance;
  return (
    <li
      className={cn(
        "card-pop flex flex-col items-center rounded-[2rem] border-2 bg-white p-4 text-center",
        wearing ? "border-[#2E7D32]" : previewing ? "border-gold" : "border-transparent",
      )}
    >
      <BeeMascot color={beeColor} wearing={[item.id]} className="mt-6 h-auto w-28" />
      <h3 className="mt-2 text-lg font-bold leading-tight text-ink">{item.name}</h3>
      {owned ? (
        <p className="text-base font-bold text-ink">{wearing ? "✓ Wearing" : "✓ Yours"}</p>
      ) : (
        <p className="inline-flex items-center gap-1 text-base font-bold text-ink">
          <HoneyDropIcon size="1.2rem" />
          {item.price}
        </p>
      )}
      <div className="mt-3 flex w-full flex-col gap-2">
        {owned ? (
          wearing ? (
            <PillButton onClick={onTakeOff} disabled={busy} className="min-h-12 w-full px-3 text-base">
              Take Off
              <span className="sr-only"> {item.name}</span>
            </PillButton>
          ) : (
            <PillButton variant="gold" onClick={onWear} disabled={busy} className="min-h-12 w-full px-3 text-base">
              Wear It
              <span className="sr-only"> {item.name}</span>
            </PillButton>
          )
        ) : short > 0 ? (
          <p className="rounded-full bg-cream px-3 py-2 text-sm font-bold text-ink">Need {short} more</p>
        ) : (
          <PillButton variant="gold" onClick={onBuy} disabled={busy} className="min-h-12 w-full px-3 text-base">
            Buy
            <span className="sr-only"> {item.name}</span>
          </PillButton>
        )}
        {!wearing && (
          <button
            type="button"
            onClick={onPreview}
            aria-pressed={previewing}
            className="min-h-11 rounded-full text-base font-bold text-ink underline underline-offset-4 hover:bg-black/5"
          >
            {previewing ? "Stop Trying On" : "Try On"}
            <span className="sr-only"> {item.name}</span>
          </button>
        )}
      </div>
    </li>
  );
}
