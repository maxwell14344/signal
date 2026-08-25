"use client";

import { useActionState } from "react";
import { updateSiteSettingsAction } from "@/lib/actions/settings";
import { CategoryPicker } from "./CategoryPicker";
import type { SiteSettings } from "@/lib/db/queries";

export function SiteSettingsForm({
  settings,
  categories,
  tools,
}: {
  settings: SiteSettings;
  categories: { slug: string; name: string }[];
  tools: { slug: string; name: string }[];
}) {
  const [state, formAction, pending] = useActionState(updateSiteSettingsAction, undefined);
  const categoryOptions = categories.map((c) => ({ id: c.slug, name: c.name }));
  const toolOptions = tools.map((t) => ({ id: t.slug, name: t.name }));

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      <div>
        <label htmlFor="toolsPerPage" className="mb-1.5 block text-sm text-muted">
          Tools per page <span className="text-xs">(on /tools)</span>
        </label>
        <input
          id="toolsPerPage"
          name="toolsPerPage"
          type="number"
          min={1}
          max={100}
          defaultValue={settings.toolsPerPage}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
        />
      </div>

      <CategoryPicker
        label="Featured categories on homepage"
        fieldName="homepageCategorySlugs"
        categories={categoryOptions}
        initialSelectedIds={settings.homepageCategorySlugs}
        multiple
      />
      <p className="text-xs text-muted">
        Pick 4-6. If none are selected, the homepage falls back to the first
        6 categories by sort order.
      </p>

      <CategoryPicker
        label="Hero shortlist tools"
        fieldName="heroShortlistToolSlugs"
        categories={toolOptions}
        initialSelectedIds={settings.heroShortlistToolSlugs}
        multiple
      />
      <p className="text-xs text-muted">
        Pick 3-5 to feature in the homepage hero. If none are selected, it
        falls back to the highest-rated tool in each category.
      </p>

      <div>
        <label htmlFor="contactEmail" className="mb-1.5 block text-sm text-muted">
          Contact form recipient email
        </label>
        <input
          id="contactEmail"
          name="contactEmail"
          type="email"
          defaultValue={settings.contactEmail}
          placeholder="you@example.com"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
        />
        <p className="mt-1.5 text-xs text-muted">
          Messages submitted on /contact are emailed here.
        </p>
      </div>

      {state?.error && <p className="text-sm text-negative">{state.error}</p>}
      {state?.success && <p className="text-sm text-positive">Saved.</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save site settings"}
      </button>
    </form>
  );
}
