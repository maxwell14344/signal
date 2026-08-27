import Link from "next/link";
import type { Metadata } from "next";
import { getAllTools, getToolBySlug } from "@/lib/db/queries";
import { ComparisonMatrix } from "@/components/ComparisonMatrix";
import { ToolPickerForm } from "@/components/ToolPickerForm";

export const metadata: Metadata = {
  title: "Compare Tools",
  description: "Pick any two or three AI customer support tools and compare them side by side.",
  alternates: { canonical: "/compare/matrix" },
  robots: { index: false, follow: true },
};

export default async function CompareMatrixPage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string; c?: string }>;
}) {
  const { a, b, c } = await searchParams;
  const allTools = await getAllTools();

  const requestedSlugs = [a, b, c].filter((s): s is string => !!s);
  const uniqueSlugs = Array.from(new Set(requestedSlugs)).slice(0, 3);

  const resolved = await Promise.all(uniqueSlugs.map((slug) => getToolBySlug(slug)));
  const selectedTools = resolved.filter((t): t is NonNullable<typeof t> => !!t);

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-3 flex items-center gap-2 text-xs text-muted">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/compare" className="hover:text-foreground">Compare</Link>
          <span>/</span>
          <span className="text-foreground">Build a comparison</span>
        </div>

        <p className="eyebrow text-accent">Decision engine</p>
        <h1 className="mt-1 text-2xl tracking-tight sm:text-3xl">Compare any tools, side by side</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Pick two or three tools. Every criterion below comes straight from
          our review data — pricing, scorecard dimensions, channels, and
          more — so it stays accurate as new tools get added.
        </p>

        <div className="mt-8">
          <ToolPickerForm
            tools={allTools.map((t) => ({ slug: t.slug, name: t.name }))}
            initial={{ a, b, c }}
          />
        </div>

        <div className="mt-10">
          {selectedTools.length < 2 ? (
            <p className="rounded-lg border border-border bg-surface p-8 text-center text-sm text-muted card-shadow">
              Pick at least two tools above to see a side-by-side comparison.
            </p>
          ) : (
            <ComparisonMatrix tools={selectedTools} />
          )}
        </div>
      </div>
    </main>
  );
}
