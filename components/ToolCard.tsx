import Link from "next/link";
import type { Tool } from "@/lib/schema";
import { ToolLogo } from "./ToolLogo";
import { RatingStars } from "./RatingStars";
import { PriceBadge } from "./PriceBadge";

export function ToolCard({
  tool,
  categoryName,
}: {
  tool: Tool;
  categoryName?: string;
}) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 transition hover:border-accent/40 hover:bg-surface-2"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <ToolLogo name={tool.name} logo={tool.logo} />
          <div>
            <h3 className="font-medium text-foreground group-hover:text-accent transition-colors">
              {tool.name}
            </h3>
            {categoryName && (
              <p className="text-xs text-muted">{categoryName}</p>
            )}
          </div>
        </div>
        <RatingStars rating={tool.rating} />
      </div>

      <p className="text-sm text-muted line-clamp-2">{tool.tagline}</p>

      <div className="mt-auto flex items-center justify-between">
        <PriceBadge price={tool.pricing.startingPrice} />
        {tool.trending && (
          <span className="text-xs font-medium text-accent">Trending</span>
        )}
      </div>
    </Link>
  );
}
