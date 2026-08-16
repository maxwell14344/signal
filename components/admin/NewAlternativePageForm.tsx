"use client";

import { useActionState } from "react";
import { createAlternativePageAction } from "@/lib/actions/alternatives";
import { ToolPicker } from "./ToolPicker";

export function NewAlternativePageForm({ tools }: { tools: { id: number; name: string }[] }) {
  const [state, formAction, pending] = useActionState(createAlternativePageAction, undefined);

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      <ToolPicker label="Anchor tool" fieldName="anchorToolId" tools={tools} />
      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm text-muted">Title</label>
        <input
          id="title"
          name="title"
          required
          placeholder="e.g. Best Zendesk Alternatives"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
        />
      </div>

      <p className="text-xs text-muted">
        Intro and entries can be filled in on the next screen.
      </p>

      {state?.error && <p className="text-sm text-negative">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create page"}
      </button>
    </form>
  );
}
