"use client";

import { useEffect, useRef } from "react";
import { PillButton } from "./PillButton";

/** Accessible confirmation using the native <dialog> element (focus is trapped by the browser). */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="confirm-title"
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      className="m-auto w-[min(92vw,32rem)] rounded-[2.5rem] border border-black bg-cream p-8 text-ink backdrop:bg-black/40"
    >
      <h2 id="confirm-title" className="text-2xl font-bold">
        {title}
      </h2>
      <p className="mt-3 text-lg">{message}</p>
      <div className="mt-7 flex flex-wrap justify-end gap-3">
        <PillButton onClick={onCancel} autoFocus>
          Keep it
        </PillButton>
        <PillButton variant="gold" onClick={onConfirm}>
          {confirmLabel}
        </PillButton>
      </div>
    </dialog>
  );
}
