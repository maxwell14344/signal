import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getCategoryBySlug, getTrendingTools } from "@/lib/tools";
import { ToolLogo } from "./ToolLogo";
import { PriceBadge } from "./PriceBadge";

export function TrendingStrip() {
  const trending = getTrendingTools();
  if (trending.length === 0) return null;

  return (
    <section id="trending" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-sm font-medium text-accent">Right now</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            What people are losing it over
          </h2>
        </div>
      </div>

      <div className="no-scrollbar -mx-6 flex gap-4 overflow-x-auto px-6 pb-2">
        {trending.map((tool) => {
          const category = getCategoryBySlug(tool.category);
          const quote = tool.sentiment[0];

          return (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group flex w-[320px] shrink-0 flex-col gap-4 rounded-2xl border border-border bg-surface p-6 transition hover:border-accent/40 hover:bg-surface-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ToolLogo name={tool.name} logo={tool.logo} size={36} />
                  <div>
                    <p className="font-medium">{tool.name}</p>
                    {category && (
                      <p className="text-xs text-muted">{category.name}</p>
                    )}
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted transition group-hover:text-accent" />
              </div>

              <p className="text-sm font-medium leading-snug text-foreground">
                {tool.hotTake}
              </p>

              {quote && (
                <p className="border-l-2 border-accent/40 pl-3 text-xs italic text-muted line-clamp-2">
                  &ldquo;{quote.quote}&rdquo;
                </p>
              )}

              <div className="mt-auto">
                <PriceBadge price={tool.pricing.startingPrice} />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
