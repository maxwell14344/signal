import Link from "next/link";
import { ToolLogo } from "./ToolLogo";
import { RatingStars } from "./RatingStars";
import { PriceBadge } from "./PriceBadge";

interface ToolCardTool {
  slug: string;
  name: string;
  logoUrl?: string | null;
  website?: string | null;
  tagline: string;
  rating: number | string | null;
  trending?: boolean | null;
  pricingStartingPrice?: string | null;
}

export function ToolCard({
  tool,
  categoryName,
}: {
  tool: ToolCardTool;
  categoryName?: string;
}) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex flex-col gap-4 rounded-lg border border-border bg-surface p-5 card-shadow transition hover:border-accent/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <ToolLogo name={tool.name} logo={tool.logoUrl} website={tool.website} />
          <div>
            <h3 className="font-medium text-foreground transition-colors group-hover:text-accent">
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
        {tool.pricingStartingPrice && <PriceBadge price={tool.pricingStartingPrice} />}
        {tool.trending && (
          <span className="text-xs font-medium text-accent">Trending</span>
        )}
      </div>
    </Link>
  );
}
