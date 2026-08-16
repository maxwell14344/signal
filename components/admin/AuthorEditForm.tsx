"use client";

import { useActionState } from "react";
import { updateAuthorAction } from "@/lib/actions/authors";
import type { AuthorRow } from "@/lib/db/queries";

export function AuthorEditForm({ author }: { author: AuthorRow }) {
  const boundAction = updateAuthorAction.bind(null, author.id, author.slug);
  const [state, formAction, pending] = useActionState(boundAction, undefined);

  return (
    <form action={formAction} encType="multipart/form-data" className="max-w-lg space-y-4">
      <div className="flex items-center gap-4">
        {author.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={author.avatarUrl}
            alt={author.name}
            className="h-16 w-16 rounded-full border border-border object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-surface-2 text-xl font-semibold text-accent">
            {author.name.charAt(0)}
          </div>
        )}
        <div className="flex-1">
          <label htmlFor="avatar" className="mb-1.5 block text-sm text-muted">
            Replace avatar
          </label>
          <input
            id="avatar"
            name="avatar"
            type="file"
            accept="image/*"
            className="w-full text-sm text-body file:mr-3 file:rounded-full file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-foreground"
          />
        </div>
      </div>

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm text-muted">Name</label>
        <input
          id="name"
          name="name"
          defaultValue={author.name}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="credentials" className="mb-1.5 block text-sm text-muted">Credentials / title</label>
        <input
          id="credentials"
          name="credentials"
          defaultValue={author.credentials ?? ""}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="bio" className="mb-1.5 block text-sm text-muted">Bio</label>
        <textarea
          id="bio"
          name="bio"
          rows={6}
          defaultValue={author.bio}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="sameAs" className="mb-1.5 block text-sm text-muted">
          Links <span className="text-xs">(one URL per line — LinkedIn, personal site, etc.)</span>
        </label>
        <textarea
          id="sameAs"
          name="sameAs"
          rows={4}
          defaultValue={(author.sameAs ?? []).join("\n")}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
        />
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
