"use client";

import { useState } from "react";
import { GRADE_OPTIONS } from "@/lib/grades";
import type { Grade } from "@/lib/types";
import { BuzzSays } from "../buddy/BuzzSays";
import { ChoiceGroup } from "../ui/ChoiceGroup";
import { TextField } from "../ui/Field";
import { ArrowRightIcon } from "../ui/Icons";
import { PillButton } from "../ui/PillButton";

/** Onboarding "Tell me about you": an optional first name, then "What grade are you in?" */
export function GradePicker({
  initial,
  initialName = "",
  onDone,
}: {
  initial: Grade | null;
  initialName?: string;
  onDone: (grade: Grade, name: string) => void;
}) {
  const [grade, setGrade] = useState<Grade | null>(initial);
  const [name, setName] = useState(initialName);
  const [error, setError] = useState(false);
  return (
    <form
      className="mx-auto flex max-w-3xl flex-col items-center text-center"
      onSubmit={(e) => {
        e.preventDefault();
        if (grade === null) setError(true);
        else onDone(grade, name.trim());
      }}
    >
      <div className="w-full max-w-md text-left">
        <TextField
          id="student-name"
          label="What's your first name? (You can skip this.)"
          placeholder="type your name"
          autoComplete="off"
          value={name}
          maxLength={30}
          onChange={(e) => setName(e.target.value)}
          inputClassName="text-center text-xl"
        />
      </div>
      <ChoiceGroup<Grade>
        name="grade"
        legend="What grade are you in?"
        legendClassName="mx-auto mb-6 mt-8 text-[1.8rem]"
        className="flex flex-col items-center [&>div]:justify-center"
        options={GRADE_OPTIONS}
        size="lg"
        value={grade}
        onChange={(g) => {
          setGrade(g);
          setError(false);
        }}
      />
      <p className="mt-4 min-h-8 text-lg font-bold text-[#B71C1C]" aria-live="polite">
        {error ? "Pick your grade first." : ""}
      </p>
      <PillButton type="submit" size="lg" className="mt-2" icon={<ArrowRightIcon size="2.4rem" />}>
        Next
      </PillButton>
      <BuzzSays className="mt-12 w-full text-left" text="Tell me a little about you, so I can pick the right words." />
    </form>
  );
}
