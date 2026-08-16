"use client";

import { useActionState } from "react";
import { updateCategoryAction } from "@/lib/actions/categories";
import type { CategoryRow } from "@/lib/db/queries";

export function CategoryEditForm({ category }: { category: CategoryRow }) {
  const boundAction = updateCategoryAction.bind(null, category.id);
  const [state, formAction, pending] = useActionState(boundAction, undefined);

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      <div>
        <label htmlFor="slug" className="mb-1.5 block text-sm text-muted">Slug</label>
        <input
          id="slug"
          name="slug"
          defaultValue={category.slug}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm text-muted">Name</label>
        <input
          id="name"
          name="name"
          defaultValue={category.name}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm text-muted">Description</label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={category.description}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="icon" className="mb-1.5 block text-sm text-muted">Icon</label>
          <input
            id="icon"
            name="icon"
            defaultValue={category.icon ?? ""}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="sortOrder" className="mb-1.5 block text-sm text-muted">Sort order</label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={category.sortOrder ?? 0}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
          />
        </div>
      </div>

      {state?.error && <p className="text-sm text-negative">{state.error}</p>}
      {state?.success && <p className="text-sm text-positive">Saved.</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
