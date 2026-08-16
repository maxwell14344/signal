import { getAllCategories, getAllTools } from "@/lib/db/queries";

export async function Hero() {
  const [toolCount, categoryCount] = await Promise.all([
    getAllTools().then((t) => t.length),
    getAllCategories().then((c) => c.length),
  ]);

  return (
    <section className="relative overflow-hidden border-b border-border bg-grid">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-6 py-24 text-center sm:py-32">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          New tools added weekly
        </div>

        <h1 className="text-4xl tracking-tight sm:text-6xl">
          Find the AI support tool that{" "}
          <span className="text-accent">actually handles</span> your customers
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-body">
          Human-verified reviews of AI chatbots, support agents, and CX
          platforms — real pricing, honest scorecards, and a written verdict
          on every tool. Not another logo directory.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#trending"
            className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:opacity-90"
          >
            See what&apos;s trending
          </a>
          <a
            href="/categories"
            className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-medium text-foreground transition hover:bg-surface-2"
          >
            Browse categories
          </a>
        </div>

        <div className="mt-14 flex items-center justify-center gap-10 text-sm text-muted">
          <div>
            <span className="font-heading text-xl text-foreground">
              {toolCount}
            </span>{" "}
            tools reviewed
          </div>
          <div>
            <span className="font-heading text-xl text-foreground">
              {categoryCount}
            </span>{" "}
            categories
          </div>
          <div>
            <span className="font-heading text-xl text-foreground">
              Weekly
            </span>{" "}
            updates
          </div>
        </div>
      </div>
    </section>
  );
}
