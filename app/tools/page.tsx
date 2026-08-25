import Link from "next/link";
import type { Metadata } from "next";
import { getAllTools, getSiteSettings } from "@/lib/db/queries";
import { ToolCard } from "@/components/ToolCard";

export const metadata: Metadata = {
  title: "All Tools",
  description: "Every AI customer support tool reviewed on NorthStark.",
};

export default async function ToolsIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page: pageParam, q } = await searchParams;
  const [allTools, settings] = await Promise.all([getAllTools(), getSiteSettings()]);

  const query = (q ?? "").trim();
  const filteredTools = query
    ? allTools.filter((t) => {
        const haystack = [t.name, t.tagline, t.primaryCategory?.name].filter(Boolean).join(" ").toLowerCase();
        return haystack.includes(query.toLowerCase());
      })
    : allTools;

  const perPage = settings.toolsPerPage || 12;
  const totalPages = Math.max(1, Math.ceil(filteredTools.length / perPage));
  const currentPage = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);
  const start = (currentPage - 1) * perPage;
  const pageTools = filteredTools.slice(start, start + perPage);

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/tools?${qs}` : "/tools";
  };

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
        {query ? (
          <p className="mt-2 text-sm text-muted">
            {filteredTools.length} results for &ldquo;{query}&rdquo; ·{" "}
            <Link href="/tools" className="text-accent hover:underline">Clear search</Link>
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted">{allTools.length} tools</p>
        )}

        {filteredTools.length === 0 ? (
          <p className="mt-10 text-sm text-muted">
            No tools matched that search. Try a broader term, or{" "}
            <Link href="/tools" className="text-accent hover:underline">browse everything</Link>.
          </p>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pageTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} categoryName={tool.primaryCategory?.name} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={pageHref(p)}
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
