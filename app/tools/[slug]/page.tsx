import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { getAllTools, getRelatedTools, getToolBySlug } from "@/lib/db/queries";
import { toolJsonLd } from "@/lib/jsonld";
import { ToolLogo } from "@/components/ToolLogo";
import { RatingStars } from "@/components/RatingStars";
import { PriceBadge } from "@/components/PriceBadge";
import { CategoryTag } from "@/components/CategoryTag";
import { TldrBlock } from "@/components/TldrBlock";
import { PricingTable } from "@/components/PricingTable";
import { ProsConsList } from "@/components/ProsConsList";
import { SentimentQuotes } from "@/components/SentimentQuotes";
import { ChannelsList } from "@/components/ChannelsList";
import { KeyFeaturesList } from "@/components/KeyFeaturesList";
import { CompanyInfoBlock } from "@/components/CompanyInfoBlock";
import { ScorecardBlock } from "@/components/ScorecardBlock";
import { VerdictBlock } from "@/components/VerdictBlock";
import { FaqSection } from "@/components/FaqSection";
import { AuthorByline } from "@/components/AuthorByline";
import { TableOfContents } from "@/components/TableOfContents";
import { ToolCard } from "@/components/ToolCard";

export async function generateStaticParams() {
  const tools = await getAllTools();
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) return {};
  return {
    title: `${tool.name} Review — Pricing, Features & Scorecard`,
    description: tool.tldr.join(" "),
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const toolRaw = await getToolBySlug(slug);
  if (!toolRaw) notFound();

  const tool = {
    ...toolRaw,
    tldr: toolRaw.tldr ?? [],
    channels: toolRaw.channels ?? [],
    keyFeatures: toolRaw.keyFeatures ?? [],
    faq: toolRaw.faq ?? [],
    scorecard: toolRaw.scorecard ?? [],
    pricingPlans: toolRaw.pricingPlans ?? [],
    pros: toolRaw.pros ?? [],
    cons: toolRaw.cons ?? [],
    sentimentQuotes: toolRaw.sentimentQuotes ?? [],
    bestFor: toolRaw.bestFor ?? [],
  };

  const related = await getRelatedTools(tool);
  const jsonLd = toolJsonLd(tool);

  const toc = [
    { id: "tldr", label: "TL;DR" },
    { id: "pricing", label: "Pricing" },
    { id: "channels", label: "Channels" },
    { id: "features", label: "Key features" },
    tool.companyInfo ? { id: "company", label: "Company" } : null,
    { id: "scorecard", label: "Our scorecard" },
    { id: "pros-cons", label: "Pros & cons" },
    tool.sentimentQuotes?.length ? { id: "sentiment", label: "What people say" } : null,
    { id: "verdict", label: "Our verdict" },
    tool.faq?.length ? { id: "faq", label: "FAQ" } : null,
  ].filter((x): x is { id: string; label: string } => x !== null);

  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-3 flex items-center gap-2 text-xs text-muted">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          {tool.primaryCategory && (
            <>
              <Link
                href={`/categories/${tool.primaryCategory.slug}`}
                className="hover:text-foreground"
              >
                {tool.primaryCategory.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-foreground">{tool.name}</span>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <ToolLogo name={tool.name} logo={tool.logoUrl ?? undefined} size={56} />
            <div>
              <h1 className="text-2xl tracking-tight sm:text-3xl">{tool.name}</h1>
              <p className="mt-1 text-body">{tool.tagline}</p>
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
          {tool.pricingStartingPrice && <PriceBadge price={tool.pricingStartingPrice} />}
          {tool.primaryCategory && (
            <CategoryTag name={tool.primaryCategory.name} slug={tool.primaryCategory.slug} />
          )}
        </div>

        <div className="mt-2">
          <AuthorByline author={tool.author} lastVerifiedAt={tool.lastVerifiedAt} />
        </div>

        <div className="mt-10 flex gap-12">
          <TableOfContents items={toc} />

          <div className="min-w-0 flex-1 space-y-12">
            <div id="tldr">
              <TldrBlock tldr={tool.tldr} />
            </div>

            <div id="pricing">
              <PricingTable model={tool.pricingModel} plans={tool.pricingPlans} />
            </div>

            <div id="channels">
              <ChannelsList channels={tool.channels} />
            </div>

            <div id="features">
              <KeyFeaturesList features={tool.keyFeatures} />
            </div>

            {tool.companyInfo && (
              <div id="company">
                <CompanyInfoBlock info={tool.companyInfo} />
              </div>
            )}

            <div id="scorecard">
              <ScorecardBlock scorecard={tool.scorecard} />
            </div>

            <div id="pros-cons">
              <ProsConsList pros={tool.pros} cons={tool.cons} />
            </div>

            {tool.sentimentQuotes?.length > 0 && (
              <div id="sentiment">
                <SentimentQuotes quotes={tool.sentimentQuotes} />
              </div>
            )}

            {tool.bestFor?.length > 0 && (
              <div>
                <h2 className="mb-4 text-lg">Best for</h2>
                <div className="flex flex-wrap gap-2">
                  {tool.bestFor.map((use, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-body"
                    >
                      {use}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div id="verdict">
              <VerdictBlock verdict={tool.verdict} />
            </div>

            {tool.faq?.length > 0 && (
              <div id="faq">
                <FaqSection faq={tool.faq} />
              </div>
            )}

            {related.length > 0 && (
              <div>
                <h2 className="mb-4 text-lg">Related tools</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {related.map((r) => (
                    <ToolCard key={r.slug} tool={r} categoryName={tool.primaryCategory?.name} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
