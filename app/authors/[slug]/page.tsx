import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAuthorBySlug, getAllTools } from "@/lib/db/queries";
import { truncateDescription } from "@/lib/seo";
import { ToolCard } from "@/components/ToolCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) return {};
  const description = truncateDescription(author.bio);
  return {
    title: author.name,
    description,
    alternates: { canonical: `/authors/${author.slug}` },
    openGraph: { title: author.name, description, type: "profile", url: `/authors/${author.slug}` },
    twitter: { card: "summary", title: author.name, description },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) notFound();

  const allTools = await getAllTools();
  const reviewed = allTools.filter((t) => t.authorId === author.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    description: author.bio,
    jobTitle: author.credentials ?? undefined,
    sameAs: author.sameAs ?? [],
  };

  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="mb-3 flex items-center gap-2 text-xs text-muted">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground">{author.name}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-surface-2 text-xl font-semibold text-accent">
            {author.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl tracking-tight">{author.name}</h1>
            {author.credentials && <p className="text-muted">{author.credentials}</p>}
          </div>
        </div>

        <p className="mt-6 text-[15px] leading-relaxed text-body">{author.bio}</p>

        <p className="mt-4 text-sm text-muted">
          Read the{" "}
          <Link href="/methodology" className="text-accent hover:underline">
            full methodology and conflict-of-interest disclosure
          </Link>
          .
        </p>

        {reviewed.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 text-lg">Reviewed by {author.name}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {reviewed.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} categoryName={tool.primaryCategory?.name} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
