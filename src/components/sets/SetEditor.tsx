"use client";

import { useRef, useState, type ReactNode } from "react";
import { makeId } from "@/lib/id";
import type { Language, WordSet, WordSetInput } from "@/lib/types";
import { TextField } from "../ui/Field";
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, TrashIcon } from "../ui/Icons";
import { PillButton, PillLink } from "../ui/PillButton";

interface DraftWord {
  id: string;
  text: string;
  definition: string;
}

/**
 * Create / edit form for a word set: name it, add words (one at a time or
 * comma-separated), give optional meanings, reorder and remove.
 */
export function SetEditor({
  initial,
  onSave,
  cancelHref,
  saveLabel = "Save set",
}: {
  initial?: WordSet;
  onSave: (input: WordSetInput) => Promise<void>;
  cancelHref: string;
  saveLabel?: string;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const language: Language = initial?.language ?? "en";
  const [words, setWords] = useState<DraftWord[]>(
    initial?.words.map((w) => ({ id: w.id, text: w.text, definition: w.definition ?? "" })) ?? [],
  );
  const [newWord, setNewWord] = useState("");
  const [newDefinition, setNewDefinition] = useState("");
  const [errors, setErrors] = useState<{ title?: string; words?: string; newWord?: string }>({});
  const [announcement, setAnnouncement] = useState("");
  const [saving, setSaving] = useState(false);
  const newWordRef = useRef<HTMLInputElement>(null);

  const addWords = () => {
    // "cat, dog, fish" adds three words at once (meaning only applies to a single word).
    const parts = newWord
      .split(/[,\n]/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length === 0) {
      setErrors((e) => ({ ...e, newWord: "Type a word to add." }));
      newWordRef.current?.focus();
      return;
    }
    const existing = new Set(words.map((w) => w.text.toLowerCase()));
    const fresh = parts.filter((p) => !existing.has(p.toLowerCase()));
    const skipped = parts.length - fresh.length;
    setWords((ws) => [
      ...ws,
      ...fresh.map((text) => ({ id: makeId("draft"), text, definition: parts.length === 1 ? newDefinition.trim() : "" })),
    ]);
    setNewWord("");
    setNewDefinition("");
    setErrors((e) => ({ ...e, newWord: undefined, words: undefined }));
    setAnnouncement(
      `${fresh.length ? `Added ${fresh.join(", ")}.` : ""}${skipped ? ` ${skipped} already in the list.` : ""}`.trim(),
    );
    newWordRef.current?.focus();
  };

  const move = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= words.length) return;
    const next = [...words];
    [next[index], next[target]] = [next[target], next[index]];
    setWords(next);
    setAnnouncement(`Moved ${words[index].text} to position ${target + 1}.`);
  };

  const remove = (index: number) => {
    setAnnouncement(`Removed ${words[index].text}.`);
    setWords(words.filter((_, i) => i !== index));
  };

  const updateWord = (index: number, patch: Partial<DraftWord>) => {
    setWords(words.map((w, i) => (i === index ? { ...w, ...patch } : w)));
  };

  const handleSave = async () => {
    const nextErrors: typeof errors = {};
    if (!title.trim()) nextErrors.title = "Give your set a name.";
    if (words.filter((w) => w.text.trim()).length === 0) nextErrors.words = "Add at least one word.";
    setErrors(nextErrors);
    if (nextErrors.title) return document.getElementById("set-title")?.focus();
    if (nextErrors.words) return newWordRef.current?.focus();
    setSaving(true);
    try {
      await onSave({
        title,
        description,
        language,
        words: words.map((w) => ({ id: w.id.startsWith("draft") ? undefined : w.id, text: w.text, definition: w.definition })),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      className="mx-auto max-w-4xl"
      onSubmit={(e) => {
        e.preventDefault();
        void handleSave();
      }}
      noValidate
    >
      <div className="grid gap-6 card-pop rounded-[2.5rem] bg-white p-6 sm:p-10">
        <TextField
          id="set-title"
          label="Set name"
          placeholder="for example: Week 7 spelling"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          maxLength={60}
        />
        <TextField
          id="set-description"
          label="About this set (optional)"
          placeholder="for example: words for Friday's quiz"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={120}
        />
      </div>

      <fieldset className="mt-8 card-pop rounded-[2.5rem] bg-white p-6 sm:p-10">
        <legend className="sr-only">Add a Word</legend>
        <h2 className="text-2xl font-bold text-ink">Add Words</h2>
        <p className="mt-1 text-base text-ink/80">Tip: type several words with commas between them to add them all at once.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <TextField
            id="new-word"
            label="Word"
            placeholder="type a word"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addWords();
              }
            }}
            error={errors.newWord ?? errors.words}
            inputRef={newWordRef}
          />
          <TextField
            id="new-definition"
            label="Meaning (optional)"
            placeholder="what it means"
            value={newDefinition}
            onChange={(e) => setNewDefinition(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addWords();
              }
            }}
          />
          <PillButton onClick={addWords} icon={<PlusIcon size="1.4em" />} className="md:mb-0">
            Add
          </PillButton>
        </div>
      </fieldset>

      <section aria-labelledby="word-list-title" className="mt-8">
        <h2 id="word-list-title" className="text-2xl font-bold text-ink">
          Words in this set ({words.length})
        </h2>
        <p className="sr-only" aria-live="polite">
          {announcement}
        </p>
        {words.length === 0 ? (
          <p className="mt-3 rounded-[2rem] border-2 border-dashed border-ink/40 px-6 py-8 text-center text-lg text-ink">
            No words yet. Add your first word above.
          </p>
        ) : (
          <ol className="mt-4 space-y-3">
            {words.map((word, index) => (
              <li key={word.id} className="grid items-center gap-3 rounded-[2rem] border border-black bg-white p-3 sm:grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,1.4fr)_auto] sm:pl-5">
                <span className="text-xl font-bold text-ink" aria-hidden="true">
                  {index + 1}.
                </span>
                <label className="sr-only" htmlFor={`word-${word.id}`}>
                  Word {index + 1}
                </label>
                <input
                  id={`word-${word.id}`}
                  value={word.text}
                  onChange={(e) => updateWord(index, { text: e.target.value })}
                  className="min-h-12 w-full min-w-0 rounded-full border border-black/40 px-4 text-xl font-bold text-ink"
                />
                <label className="sr-only" htmlFor={`def-${word.id}`}>
                  Meaning of word {index + 1}
                </label>
                <input
                  id={`def-${word.id}`}
                  value={word.definition}
                  placeholder="meaning (optional)"
                  onChange={(e) => updateWord(index, { definition: e.target.value })}
                  className="min-h-12 w-full min-w-0 rounded-full border border-black/40 px-4 text-lg text-ink placeholder:text-ink/60"
                />
                <div className="flex justify-end gap-2">
                  <IconSquare label={`Move ${word.text} up`} onClick={() => move(index, -1)} disabled={index === 0}>
                    <ChevronUpIcon size="1.4rem" />
                  </IconSquare>
                  <IconSquare label={`Move ${word.text} down`} onClick={() => move(index, 1)} disabled={index === words.length - 1}>
                    <ChevronDownIcon size="1.4rem" />
                  </IconSquare>
                  <IconSquare label={`Remove ${word.text}`} onClick={() => remove(index)}>
                    <TrashIcon size="1.5rem" />
                  </IconSquare>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      <div className="mt-10 flex flex-wrap justify-center gap-5">
        <PillLink href={cancelHref} size="lg">
          Cancel
        </PillLink>
        <PillButton type="submit" variant="gold" size="lg" disabled={saving}>
          {saving ? "Saving…" : saveLabel}
        </PillButton>
      </div>
    </form>
  );
}

function IconSquare({
  label,
  children,
  onClick,
  disabled,
}: {
  label: string;
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="grid h-12 w-12 place-items-center rounded-full border border-black bg-white text-ink hover:bg-[#FFF6DA] disabled:opacity-30"
    >
      {children}
    </button>
  );
}
