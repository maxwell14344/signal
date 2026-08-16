"use client";

import { useActionState } from "react";
import { createComparisonAction } from "@/lib/actions/comparisons";
import { ToolPicker } from "./ToolPicker";

export function NewComparisonForm({ tools }: { tools: { id: number; name: string }[] }) {
  const [state, formAction, pending] = useActionState(createComparisonAction, undefined);

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      <ToolPicker label="Tool A" fieldName="toolAId" tools={tools} />
      <ToolPicker label="Tool B" fieldName="toolBId" tools={tools} />

      {state?.error && <p className="text-sm text-negative">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create comparison"}
      </button>
    </form>
  );
}
