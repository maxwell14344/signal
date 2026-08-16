import Link from "next/link";
import type { Metadata } from "next";
import { getAllTools, getSiteSettings } from "@/lib/db/queries";
import { ToolCard } from "@/components/ToolCard";

export const metadata: Metadata = {
  title: "All Tools",
  description: "Every AI customer support tool reviewed on NorthStack.",
};

export default async function ToolsIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const [allTools, settings] = await Promise.all([getAllTools(), getSiteSettings()]);

  const perPage = settings.toolsPerPage || 12;
  const totalPages = Math.max(1, Math.ceil(allTools.length / perPage));
  const currentPage = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);
  const start = (currentPage - 1) * perPage;
  const pageTools = allTools.slice(start, start + perPage);

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-3 flex items-center gap-2 text-xs text-muted">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground">All Tools</span>
        </div>

        <p className="eyebrow text-accent">All reviews</p>
        <h1 className="mt-1 text-2xl tracking-tight sm:text-3xl">Every tool, reviewed</h1>
        <p className="mt-2 text-sm text-muted">{allTools.length} tools</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pageTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} categoryName={tool.primaryCategory?.name} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={p === 1 ? "/tools" : `/tools?page=${p}`}
                className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm transition ${
                  p === currentPage
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border bg-surface text-body hover:border-accent/40"
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
