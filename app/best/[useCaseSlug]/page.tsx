import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { getAllUseCasePages, getUseCasePageBySlug } from "@/lib/db/queries";
import { ToolLogo } from "@/components/ToolLogo";
import { RatingStars } from "@/components/RatingStars";
import { PriceBadge } from "@/components/PriceBadge";
import { AuthorByline } from "@/components/AuthorByline";

export async function generateStaticParams() {
  const pages = await getAllUseCasePages();
  return pages.map((p) => ({ useCaseSlug: p.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ useCaseSlug: string }>;
}): Promise<Metadata> {
  const { useCaseSlug } = await params;
  const page = await getUseCasePageBySlug(useCaseSlug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.intro ?? undefined,
  };
}

export default async function UseCasePage({
  params,
}: {
  params: Promise<{ useCaseSlug: string }>;
}) {
  const { useCaseSlug } = await params;
  const page = await getUseCasePageBySlug(useCaseSlug);
  if (!page) notFound();

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-3 flex items-center gap-2 text-xs text-muted">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground">{page.title}</span>
        </div>

        <h1 className="text-2xl tracking-tight sm:text-3xl">{page.title}</h1>
        {page.intro && <p className="mt-4 text-[15px] leading-relaxed text-body">{page.intro}</p>}

        <div className="mt-2">
          <AuthorByline author={page.author} lastVerifiedAt={page.lastVerifiedAt} />
        </div>

        <div className="mt-10 space-y-4">
          {page.entries.map((entry, i) =>
            entry.tool ? (
              <div
                key={entry.id}
                className="rounded-lg border border-border bg-surface p-6 card-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="eyebrow w-5 shrink-0 text-accent">{i + 1}</span>
                    <ToolLogo name={entry.tool.name} logo={entry.tool.logoUrl} website={entry.tool.website} size={40} />
                    <div>
                      <Link
                        href={`/tools/${entry.tool.slug}`}
                        className="font-medium text-foreground hover:text-accent"
                      >
                        {entry.tool.name}
                      </Link>
                      <div className="mt-0.5 flex items-center gap-2">
                        <RatingStars rating={entry.tool.rating} />
                        {entry.tool.pricingStartingPrice && (
                          <PriceBadge price={entry.tool.pricingStartingPrice} />
                        )}
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/tools/${entry.tool.slug}`}
                    className="flex shrink-0 items-center gap-1 text-xs text-muted hover:text-accent"
                  >
                    Full review
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
                <p className="mt-4 text-[15px] leading-relaxed text-body">{entry.blurb}</p>
              </div>
            ) : null
          )}
        </div>
      </div>
    </main>
  );
}
