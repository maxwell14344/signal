import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllCategories,
  getCategoryBySlug,
  getToolsByCategory,
} from "@/lib/db/queries";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ToolCard } from "@/components/ToolCard";

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: `Best ${category.name} — Reviewed & Scored`,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const tools = (await getToolsByCategory(category.slug)).sort(
    (a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0)
  );

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-3 flex items-center gap-2 text-xs text-muted">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-foreground">Categories</Link>
          <span>/</span>
          <span className="text-foreground">{category.name}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/12 text-accent">
            <CategoryIcon icon={category.icon} className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl tracking-tight sm:text-3xl">
              Best {category.name}
            </h1>
            <p className="mt-1 text-body">{category.description}</p>
          </div>
        </div>

        {tools.length > 0 ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        ) : (
          <p className="mt-10 rounded-lg border border-dashed border-border bg-surface p-8 text-center text-muted">
            No tools reviewed in this category yet — check back soon.
          </p>
        )}
      </div>
    </main>
  );
}
