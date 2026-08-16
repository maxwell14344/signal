"use client";

import { useActionState } from "react";
import { createAuthorAction } from "@/lib/actions/authors";

export function NewAuthorForm() {
  const [state, formAction, pending] = useActionState(createAuthorAction, undefined);

  return (
    <form action={formAction} encType="multipart/form-data" className="max-w-lg space-y-4">
      <div>
        <label htmlFor="slug" className="mb-1.5 block text-sm text-muted">Slug</label>
        <input
          id="slug"
          name="slug"
          required
          placeholder="e.g. jane-doe"
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
        <label htmlFor="credentials" className="mb-1.5 block text-sm text-muted">Credentials / title</label>
        <input
          id="credentials"
          name="credentials"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="bio" className="mb-1.5 block text-sm text-muted">Bio</label>
        <textarea
          id="bio"
          name="bio"
          rows={6}
          required
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="avatar" className="mb-1.5 block text-sm text-muted">Avatar image</label>
        <input
          id="avatar"
          name="avatar"
          type="file"
          accept="image/*"
          className="w-full text-sm text-body file:mr-3 file:rounded-full file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-foreground"
        />
      </div>

      {state?.error && <p className="text-sm text-negative">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create author"}
      </button>
    </form>
  );
}
