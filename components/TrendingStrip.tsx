import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getTrendingTools } from "@/lib/db/queries";
import { ToolLogo } from "./ToolLogo";
import { PriceBadge } from "./PriceBadge";
import { ScrollHint } from "./ScrollHint";

export async function TrendingStrip() {
  const trending = await getTrendingTools();
  if (trending.length === 0) return null;

  return (
    <section id="trending" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="eyebrow text-accent">Right now</p>
          <h2 className="mt-1 text-2xl sm:text-3xl">
            Trending in AI support
          </h2>
        </div>
      </div>

      <ScrollHint className="no-scrollbar -mx-6 flex gap-4 overflow-x-auto px-6 pb-2">
        {trending.map((tool) => {
          const quote = tool.sentimentQuotes?.[0];

          return (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group flex w-[320px] shrink-0 flex-col gap-4 rounded-lg border border-border bg-surface p-6 card-shadow transition hover:border-accent/40"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ToolLogo name={tool.name} logo={tool.logoUrl} website={tool.website} size={36} />
                  <div>
                    <p className="font-medium text-foreground">{tool.name}</p>
                    {tool.primaryCategory && (
                      <p className="text-xs text-muted">{tool.primaryCategory.name}</p>
                    )}
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted transition group-hover:text-accent" />
              </div>

              <p className="text-sm leading-snug text-body">{tool.tagline}</p>

              {quote && (
                <p className="border-l-2 border-accent/40 pl-3 text-xs italic text-muted line-clamp-2">
                  &ldquo;{quote.quote}&rdquo;
                </p>
              )}

              <div className="mt-auto">
                {tool.pricingStartingPrice && (
                  <PriceBadge price={tool.pricingStartingPrice} />
                )}
              </div>
            </Link>
          );
        })}
      </ScrollHint>
    </section>
  );
}
