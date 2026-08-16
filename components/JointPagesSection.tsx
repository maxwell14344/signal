import Link from "next/link";
import { ArrowRight, Split, ListChecks, Target } from "lucide-react";
import { getAllComparisons, getAllAlternativePages, getAllUseCasePages } from "@/lib/db/queries";
import { db } from "@/lib/db/client";
import { tools } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const PER_COLUMN = 2;

export async function JointPagesSection() {
  const [comparisons, alternatives, useCases] = await Promise.all([
    getAllComparisons(),
    getAllAlternativePages(),
    getAllUseCasePages(),
  ]);

  const comparisonsWithNames = await Promise.all(
    comparisons.slice(0, PER_COLUMN).map(async (c) => {
      const [[a], [b]] = await Promise.all([
        db.select().from(tools).where(eq(tools.id, c.toolAId)).limit(1),
        db.select().from(tools).where(eq(tools.id, c.toolBId)).limit(1),
      ]);
      return { ...c, label: `${a?.name} vs ${b?.name}` };
    })
  );

  if (comparisons.length === 0 && alternatives.length === 0 && useCases.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-8">
        <p className="eyebrow text-accent">Buying guides</p>
        <h2 className="mt-1 text-2xl sm:text-3xl">Comparisons, alternatives &amp; use-case guides</h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
            <Split className="h-4 w-4 text-accent" />
            Tool vs tool
          </div>
          <ul className="space-y-2">
            {comparisonsWithNames.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/compare/${c.slug}`}
                  className="group flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 text-sm text-body card-shadow transition hover:border-accent/40"
                >
                  {c.label}
                  <ArrowRight className="h-3.5 w-3.5 text-muted transition group-hover:translate-x-0.5 group-hover:text-accent" />
                </Link>
              </li>
            ))}
          </ul>
          {comparisons.length > PER_COLUMN && (
            <Link href="/compare" className="mt-3 inline-block text-xs text-muted hover:text-accent">
              View all comparisons →
            </Link>
          )}
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
            <ListChecks className="h-4 w-4 text-accent" />
            Alternatives
          </div>
          <ul className="space-y-2">
            {alternatives.slice(0, PER_COLUMN).map((a) => (
              <li key={a.id}>
                <Link
                  href={`/alternatives/${a.slug}`}
                  className="group flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 text-sm text-body card-shadow transition hover:border-accent/40"
                >
                  {a.title}
                  <ArrowRight className="h-3.5 w-3.5 text-muted transition group-hover:translate-x-0.5 group-hover:text-accent" />
                </Link>
              </li>
            ))}
          </ul>
          {alternatives.length > PER_COLUMN && (
            <Link href="/alternatives" className="mt-3 inline-block text-xs text-muted hover:text-accent">
              View all alternatives →
            </Link>
          )}
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
            <Target className="h-4 w-4 text-accent" />
            Best for your use case
          </div>
          <ul className="space-y-2">
            {useCases.slice(0, PER_COLUMN).map((u) => (
              <li key={u.id}>
                <Link
                  href={`/best/${u.slug}`}
                  className="group flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 text-sm text-body card-shadow transition hover:border-accent/40"
                >
                  {u.title}
                  <ArrowRight className="h-3.5 w-3.5 text-muted transition group-hover:translate-x-0.5 group-hover:text-accent" />
                </Link>
              </li>
            ))}
          </ul>
          {useCases.length > PER_COLUMN && (
            <Link href="/best" className="mt-3 inline-block text-xs text-muted hover:text-accent">
              View all use cases →
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
