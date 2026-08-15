import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import {
  getAllTools,
  getCategoryBySlug,
  getRelatedTools,
  getToolBySlug,
} from "@/lib/tools";
import { toolJsonLd } from "@/lib/jsonld";
import { ToolLogo } from "@/components/ToolLogo";
import { RatingStars } from "@/components/RatingStars";
import { PriceBadge } from "@/components/PriceBadge";
import { CategoryTag } from "@/components/CategoryTag";
import { TldrBlock } from "@/components/TldrBlock";
import { PricingTable } from "@/components/PricingTable";
import { ProsConsList } from "@/components/ProsConsList";
import { SentimentQuotes } from "@/components/SentimentQuotes";
import { ToolCard } from "@/components/ToolCard";

export function generateStaticParams() {
  return getAllTools().map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  return {
    title: `${tool.name} Review — Pricing, Pros/Cons & Sentiment`,
    description: tool.tldr.join(" "),
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const category = getCategoryBySlug(tool.category);
  const related = getRelatedTools(tool);
  const jsonLd = toolJsonLd(tool);

  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-3 flex items-center gap-2 text-xs text-muted">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          {category && (
            <>
              <Link
                href={`/categories/${category.slug}`}
                className="hover:text-foreground"
              >
                {category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-foreground">{tool.name}</span>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <ToolLogo name={tool.name} logo={tool.logo} size={56} />
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {tool.name}
              </h1>
              <p className="mt-1 text-muted">{tool.tagline}</p>
            </div>
          </div>
          <a
            href={tool.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition hover:opacity-90"
          >
            Visit site
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <RatingStars rating={tool.rating} />
          <PriceBadge price={tool.pricing.startingPrice} />
          {category && (
            <CategoryTag name={category.name} slug={category.slug} />
          )}
        </div>

        <div className="mt-10 space-y-12">
          <TldrBlock tldr={tool.tldr} />
          <PricingTable pricing={tool.pricing} />
          <ProsConsList pros={tool.pros} cons={tool.cons} />
          <SentimentQuotes quotes={tool.sentiment} />

          {tool.bestFor.length > 0 && (
            <div>
              <h2 className="mb-4 text-lg font-semibold">Best for</h2>
              <div className="flex flex-wrap gap-2">
                {tool.bestFor.map((use, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
                  >
                    {use}
                  </span>
                ))}
              </div>
            </div>
          )}

          {related.length > 0 && (
            <div>
              <h2 className="mb-4 text-lg font-semibold">Related tools</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {related.map((r) => (
                  <ToolCard key={r.slug} tool={r} categoryName={category?.name} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
