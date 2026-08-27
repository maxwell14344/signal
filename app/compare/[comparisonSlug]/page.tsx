import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllComparisons,
  getComparisonBySlug,
  findComparisonByToolPair,
} from "@/lib/db/queries";
import { truncateDescription } from "@/lib/seo";
import { ToolLogo } from "@/components/ToolLogo";
import { TldrBlock } from "@/components/TldrBlock";
import { FeatureMatrixTable } from "@/components/FeatureMatrixTable";
import { VerdictBlock } from "@/components/VerdictBlock";
import { AuthorByline } from "@/components/AuthorByline";
import { QuickVerdict } from "@/components/QuickVerdict";

export async function generateStaticParams() {
  const comparisons = await getAllComparisons();
  return comparisons.map((c) => ({ comparisonSlug: c.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ comparisonSlug: string }>;
}): Promise<Metadata> {
  const { comparisonSlug } = await params;
  const comparison = await getComparisonBySlug(comparisonSlug);
  if (!comparison) return {};
  const title = `${comparison.toolA.name} vs ${comparison.toolB.name}: Which One Should You Choose?`;
  const description = truncateDescription(
    comparison.quickVerdict ||
      comparison.tldr?.join(" ") ||
      `An in-depth, practitioner comparison of ${comparison.toolA.name} and ${comparison.toolB.name} — pricing, features, and which one actually fits your team.`
  );
  return {
    title,
    description,
    alternates: { canonical: `/compare/${comparison.slug}` },
    openGraph: { title, description, type: "article", url: `/compare/${comparison.slug}` },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ comparisonSlug: string }>;
}) {
  const { comparisonSlug } = await params;
  let comparison = await getComparisonBySlug(comparisonSlug);

  if (!comparison) {
    // handle reversed-order slugs, e.g. "zendesk-vs-intercom" -> canonical "intercom-vs-zendesk"
    const parts = comparisonSlug.split("-vs-");
    if (parts.length === 2) {
      const reversedMatch = await findComparisonByToolPair(parts[1], parts[0]);
      if (reversedMatch) {
        permanentRedirect(`/compare/${reversedMatch.slug}`);
      }
    }
    notFound();
  }

  const { toolA, toolB } = comparison;

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-3 flex items-center gap-2 text-xs text-muted">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground">{toolA.name} vs {toolB.name}</span>
        </div>

        <h1 className="text-2xl tracking-tight sm:text-3xl">
          {toolA.name} vs {toolB.name}: Which One Should You Choose?
        </h1>

        <div className="mt-4 flex items-center gap-6">
          <Link href={`/tools/${toolA.slug}`} className="flex items-center gap-2 hover:text-accent">
            <ToolLogo name={toolA.name} logo={toolA.logoUrl} website={toolA.website} size={32} />
            <span className="font-medium">{toolA.name}</span>
          </Link>
          <span className="text-muted">vs</span>
          <Link href={`/tools/${toolB.slug}`} className="flex items-center gap-2 hover:text-accent">
            <ToolLogo name={toolB.name} logo={toolB.logoUrl} website={toolB.website} size={32} />
            <span className="font-medium">{toolB.name}</span>
          </Link>
        </div>

        <div className="mt-2">
          <AuthorByline author={comparison.author} lastVerifiedAt={comparison.lastVerifiedAt} />
        </div>

        <QuickVerdict text={comparison.quickVerdict} />

        <div className="mt-10 space-y-12">
          <TldrBlock tldr={comparison.tldr ?? []} />

          <div>
            <h2 className="mb-4 text-lg">Feature comparison</h2>
            <FeatureMatrixTable
              rows={comparison.featureMatrix ?? []}
              toolAName={toolA.name}
              toolBName={toolB.name}
            />
          </div>

          <VerdictBlock verdict={comparison.verdict} />

          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href={`/tools/${toolA.slug}`}
              className="rounded-lg border border-border bg-surface p-5 card-shadow transition hover:border-accent/40"
            >
              <p className="eyebrow">Read the full review</p>
              <p className="mt-1 font-medium text-foreground">{toolA.name} →</p>
            </Link>
            <Link
              href={`/tools/${toolB.slug}`}
              className="rounded-lg border border-border bg-surface p-5 card-shadow transition hover:border-accent/40"
            >
              <p className="eyebrow">Read the full review</p>
              <p className="mt-1 font-medium text-foreground">{toolB.name} →</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
