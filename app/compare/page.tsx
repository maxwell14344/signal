import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getAllComparisonsWithNames, getAllTools } from "@/lib/db/queries";
import { ToolPickerForm } from "@/components/ToolPickerForm";

export const metadata: Metadata = {
  title: "All Comparisons",
  description: "Every tool-vs-tool comparison on NorthStark.",
};

export default async function CompareIndexPage() {
  const [withNames, allTools] = await Promise.all([getAllComparisonsWithNames(), getAllTools()]);

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="mb-3 flex items-center gap-2 text-xs text-muted">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground">Compare</span>
        </div>

        <p className="eyebrow text-accent">Buying guides</p>
        <h1 className="mt-1 text-2xl tracking-tight sm:text-3xl">Compare tools</h1>
        <p className="mt-2 text-sm text-muted">
          Pick any two or three tools for a straight, criteria-by-criteria
          comparison — or read one of our in-depth, written comparisons below.
        </p>

        <div className="mt-6">
          <ToolPickerForm tools={allTools.map((t) => ({ slug: t.slug, name: t.name }))} initial={{}} />
        </div>

        <h2 className="mt-12 mb-4 text-sm font-medium text-foreground">In-depth comparisons</h2>
        <div className="space-y-3">
          {withNames.map((c) => (
            <Link
              key={c.slug}
              href={`/compare/${c.slug}`}
              className="card-hover group flex items-center justify-between rounded-lg border border-border bg-surface px-5 py-4 text-sm text-body card-shadow"
            >
              {c.label}
              <ArrowRight className="h-4 w-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-accent" />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
