"use client";

import { useActionState } from "react";
import { createUseCasePageAction } from "@/lib/actions/use-cases";

export function NewUseCasePageForm() {
  const [state, formAction, pending] = useActionState(createUseCasePageAction, undefined);

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm text-muted">Title</label>
        <input
          id="title"
          name="title"
          required
          placeholder="e.g. Best AI Support Tools for Real Estate"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="slug" className="mb-1.5 block text-sm text-muted">
          Slug <span className="text-xs">(optional — derived from title if left blank)</span>
        </label>
        <input
          id="slug"
          name="slug"
          placeholder="e.g. real-estate"
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
