"use client";

import { useActionState } from "react";
import { updateComparisonAction } from "@/lib/actions/comparisons";

interface ComparisonForForm {
  id: number;
  slug: string;
  tldr: string[] | null;
  quickVerdict: string | null;
  featureMatrix: unknown;
  verdict: string | null;
}

export function ComparisonEditForm({ comparison }: { comparison: ComparisonForForm }) {
  const boundAction = updateComparisonAction.bind(null, comparison.id, comparison.slug);
  const [state, formAction, pending] = useActionState(boundAction, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="tldr" className="mb-1.5 block text-sm text-muted">TLDR (JSON array)</label>
        <textarea
          id="tldr"
          name="tldr"
          rows={6}
          defaultValue={JSON.stringify(comparison.tldr ?? [], null, 2)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs text-foreground focus:border-accent/50 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="quickVerdict" className="mb-1.5 block text-sm text-muted">
          Quick verdict <span className="text-xs">(short, AI-quotable answer shown at the top of the page — "which one should I use," in 4-5 sentences)</span>
        </label>
        <textarea
          id="quickVerdict"
          name="quickVerdict"
          rows={4}
          defaultValue={comparison.quickVerdict ?? ""}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="featureMatrix" className="mb-1.5 block text-sm text-muted">Feature matrix (JSON array)</label>
        <textarea
          id="featureMatrix"
          name="featureMatrix"
          rows={8}
          defaultValue={JSON.stringify(comparison.featureMatrix ?? [], null, 2)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs text-foreground focus:border-accent/50 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="verdict" className="mb-1.5 block text-sm text-muted">Verdict</label>
        <textarea
          id="verdict"
          name="verdict"
          rows={5}
          defaultValue={comparison.verdict ?? ""}
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
