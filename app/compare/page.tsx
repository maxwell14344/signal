import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getAllComparisons } from "@/lib/db/queries";
import { db } from "@/lib/db/client";
import { tools } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const metadata: Metadata = {
  title: "All Comparisons",
  description: "Every tool-vs-tool comparison on NorthStack.",
};

export default async function CompareIndexPage() {
  const comparisons = await getAllComparisons();
  const withNames = await Promise.all(
    comparisons.map(async (c) => {
      const [[a], [b]] = await Promise.all([
        db.select().from(tools).where(eq(tools.id, c.toolAId)).limit(1),
        db.select().from(tools).where(eq(tools.id, c.toolBId)).limit(1),
      ]);
      return { ...c, label: `${a?.name} vs ${b?.name}` };
    })
  );

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="mb-3 flex items-center gap-2 text-xs text-muted">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground">Compare</span>
        </div>

        <p className="eyebrow text-accent">Buying guides</p>
        <h1 className="mt-1 text-2xl tracking-tight sm:text-3xl">All comparisons</h1>

        <div className="mt-8 space-y-3">
          {withNames.map((c) => (
            <Link
              key={c.id}
              href={`/compare/${c.slug}`}
              className="group flex items-center justify-between rounded-lg border border-border bg-surface px-5 py-4 text-sm text-body card-shadow transition hover:border-accent/40"
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
