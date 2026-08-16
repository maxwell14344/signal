"use client";

import { useActionState } from "react";
import { updateUseCasePageAction } from "@/lib/actions/use-cases";

interface PageForForm {
  id: number;
  slug: string;
  title: string;
  intro: string | null;
  entries: { tool?: { slug: string } | null; blurb: string }[];
}

export function UseCasePageEditForm({ page }: { page: PageForForm }) {
  const boundAction = updateUseCasePageAction.bind(null, page.id, page.slug);
  const [state, formAction, pending] = useActionState(boundAction, undefined);

  const entriesJson = JSON.stringify(
    page.entries.map((e) => ({ toolSlug: e.tool?.slug ?? "", blurb: e.blurb })),
    null,
    2
  );

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm text-muted">Title</label>
        <input
          id="title"
          name="title"
          defaultValue={page.title}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="intro" className="mb-1.5 block text-sm text-muted">Intro</label>
        <textarea
          id="intro"
          name="intro"
          rows={5}
          defaultValue={page.intro ?? ""}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="entries" className="mb-1.5 block text-sm text-muted">
          Entries <span className="text-xs">(JSON array of {"{toolSlug, blurb}"}, order = display order)</span>
        </label>
        <textarea
          id="entries"
          name="entries"
          rows={16}
          defaultValue={entriesJson}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs text-foreground focus:border-accent/50 focus:outline-none"
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
