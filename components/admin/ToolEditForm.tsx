"use client";

import { useActionState } from "react";
import { updateToolAction } from "@/lib/actions/tools";
import type { ToolRow, CategoryRow } from "@/lib/db/queries";
import { CategoryPicker } from "./CategoryPicker";

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  min,
  max,
  step,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm text-muted">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        min={min}
        max={max}
        step={step}
        defaultValue={defaultValue ?? ""}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
      />
    </div>
  );
}

function JsonField({
  label,
  name,
  defaultValue,
  rows = 5,
}: {
  label: string;
  name: string;
  defaultValue: unknown;
  rows?: number;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm text-muted">
        {label} <span className="text-xs">(JSON)</span>
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={JSON.stringify(defaultValue ?? [], null, 2)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs text-foreground focus:border-accent/50 focus:outline-none"
      />
    </div>
  );
}

export function ToolEditForm({
  tool,
  categories,
  primaryCategoryId,
  secondaryCategoryIds,
}: {
  tool: ToolRow;
  categories: CategoryRow[];
  primaryCategoryId: number | null;
  secondaryCategoryIds: number[];
}) {
  const boundAction = updateToolAction.bind(null, tool.id);
  const [state, formAction, pending] = useActionState(boundAction, undefined);

  const categoryOptions = categories.map((c) => ({ id: c.id, name: c.name }));

  return (
    <form action={formAction} className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <CategoryPicker
          label="Primary category"
          fieldName="primaryCategoryId"
          categories={categoryOptions}
          initialSelectedIds={primaryCategoryId ? [primaryCategoryId] : []}
          multiple={false}
        />
        <CategoryPicker
          label="Secondary categories"
          fieldName="secondaryCategoryIds"
          categories={categoryOptions}
          initialSelectedIds={secondaryCategoryIds}
          multiple={true}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Slug" name="slug" defaultValue={tool.slug} />
        <Field label="Name" name="name" defaultValue={tool.name} />
        <Field label="Website" name="website" defaultValue={tool.website} />
        <Field label="Logo URL" name="logoUrl" defaultValue={tool.logoUrl} />
        <Field
          label="Rating (1.0-5.0)"
          name="rating"
          defaultValue={tool.rating}
          type="number"
          min={1}
          max={5}
          step={0.1}
        />
        <div className="flex items-center gap-2 pt-6">
          <input
            id="trending"
            name="trending"
            type="checkbox"
            defaultChecked={tool.trending ?? false}
            className="h-4 w-4 rounded border-border"
          />
          <label htmlFor="trending" className="text-sm text-body">Trending</label>
        </div>
      </div>

      <Field label="Tagline" name="tagline" defaultValue={tool.tagline} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Pricing model" name="pricingModel" defaultValue={tool.pricingModel} />
        <Field label="Starting price" name="pricingStartingPrice" defaultValue={tool.pricingStartingPrice} />
      </div>

      <div>
        <label htmlFor="pricingBreakdown" className="mb-1.5 block text-sm text-muted">
          Pricing breakdown <span className="text-xs">(reader-voiced judgment on the pricing table)</span>
        </label>
        <textarea
          id="pricingBreakdown"
          name="pricingBreakdown"
          rows={4}
          defaultValue={tool.pricingBreakdown ?? ""}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="verdict" className="mb-1.5 block text-sm text-muted">Verdict</label>
        <textarea
          id="verdict"
          name="verdict"
          rows={4}
          defaultValue={tool.verdict ?? ""}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <JsonField label="TLDR" name="tldr" defaultValue={tool.tldr} />
        <JsonField label="Channels" name="channels" defaultValue={tool.channels} />
        <JsonField label="Key features" name="keyFeatures" defaultValue={tool.keyFeatures} />
        <JsonField label="Capabilities" name="capabilities" defaultValue={tool.capabilities} rows={10} />
        <JsonField label="Company info" name="companyInfo" defaultValue={tool.companyInfo} />
        <JsonField label="FAQ" name="faq" defaultValue={tool.faq} rows={8} />
        <JsonField label="Scorecard" name="scorecard" defaultValue={tool.scorecard} rows={8} />
        <JsonField label="Pricing plans" name="pricingPlans" defaultValue={tool.pricingPlans} rows={8} />
        <JsonField label="Pros" name="pros" defaultValue={tool.pros} />
        <JsonField label="Cons" name="cons" defaultValue={tool.cons} />
        <JsonField label="Sentiment quotes" name="sentimentQuotes" defaultValue={tool.sentimentQuotes} rows={8} />
        <JsonField label="Best for" name="bestFor" defaultValue={tool.bestFor} />
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
