import Link from "next/link";
import { getFeaturedComparisons } from "@/lib/db/queries";
import { ToolLogo } from "./ToolLogo";

export async function ShortlistCompareSection() {
  const comparisons = await getFeaturedComparisons();
  if (comparisons.length === 0) return null;

  return (
    <section id="trending" className="mx-auto max-w-6xl px-6 py-14">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl">Shortlist, compare, decide.</h2>
        <p className="mt-2 text-body">
          A decision layer between &ldquo;I need support software&rdquo; and &ldquo;we just signed a 12-month contract.&rdquo;
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4 sm:grid-cols-2">
          {comparisons.map((c) => (
            <Link
              key={c.slug}
              href={`/compare/${c.slug}`}
              className="card-hover flex flex-col items-center gap-3 rounded-lg border border-border bg-surface p-6 text-center card-shadow"
            >
              <div className="flex items-center gap-3">
                <ToolLogo name={c.toolA?.name ?? "?"} logo={c.toolA?.logoUrl} website={c.toolA?.website} size={44} />
                <span className="text-xs font-medium text-muted">vs</span>
                <ToolLogo name={c.toolB?.name ?? "?"} logo={c.toolB?.logoUrl} website={c.toolB?.website} size={44} />
              </div>
              <p className="text-sm font-medium text-foreground">
                {c.toolA?.name} vs {c.toolB?.name}
              </p>
            </Link>
          ))}
        </div>

        <div className="flex flex-col justify-center rounded-lg border border-border bg-surface p-8 card-shadow">
          <p className="eyebrow text-accent">Decision engine</p>
          <h3 className="mt-2 text-xl">Compare what actually matters.</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Pricing, setup effort, AI capability, channels, integrations,
            automation, support, and who each tool is really built for.
          </p>
          <Link
            href="/compare"
            className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90"
          >
            Compare tools →
          </Link>
        </div>
      </div>
    </section>
  );
}
