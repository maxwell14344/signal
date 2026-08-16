"use client";

import { useActionState } from "react";
import { createToolAction } from "@/lib/actions/tools";
import { CategoryPicker } from "./CategoryPicker";
import type { CategoryRow } from "@/lib/db/queries";

export function NewToolForm({ categories }: { categories: CategoryRow[] }) {
  const [state, formAction, pending] = useActionState(createToolAction, undefined);
  const categoryOptions = categories.map((c) => ({ id: c.id, name: c.name }));

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      <div>
        <label htmlFor="slug" className="mb-1.5 block text-sm text-muted">Slug</label>
        <input
          id="slug"
          name="slug"
          required
          placeholder="e.g. help-scout"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm text-muted">Name</label>
        <input
          id="name"
          name="name"
          required
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="website" className="mb-1.5 block text-sm text-muted">Website</label>
        <input
          id="website"
          name="website"
          required
          placeholder="https://…"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="tagline" className="mb-1.5 block text-sm text-muted">Tagline</label>
        <input
          id="tagline"
          name="tagline"
          required
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
        />
      </div>

      <CategoryPicker
        label="Primary category"
        fieldName="primaryCategoryId"
        categories={categoryOptions}
        initialSelectedIds={[]}
        multiple={false}
      />

      <p className="text-xs text-muted">
        Everything else (pricing, TLDR, scorecard, FAQ, etc.) can be filled
        in on the next screen after creating the tool.
      </p>

      {state?.error && <p className="text-sm text-negative">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create tool"}
      </button>
    </form>
  );
}
