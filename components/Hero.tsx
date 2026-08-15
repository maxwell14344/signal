import { getAllCategories, getAllTools } from "@/lib/tools";

export function Hero() {
  const toolCount = getAllTools().length;
  const categoryCount = getAllCategories().length;

  return (
    <section className="relative overflow-hidden border-b border-border bg-grid">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-6 py-24 text-center sm:py-32">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          New tools added daily
        </div>

        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
          Know what an AI tool{" "}
          <span className="text-accent">actually does</span> before you pay
          for it
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
          Structured reviews with real pricing, honest pros and cons, and
          what people are actually saying on Reddit, X, and Hacker News —
          not another list of logos.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#trending"
            className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:opacity-90"
          >
            See what&apos;s trending
          </a>
          <a
            href="#categories"
            className="rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition hover:bg-surface"
          >
            Browse categories
          </a>
        </div>

        <div className="mt-14 flex items-center justify-center gap-10 text-sm text-muted">
          <div>
            <span className="text-xl font-semibold text-foreground">
              {toolCount}
            </span>{" "}
            tools reviewed
          </div>
          <div>
            <span className="text-xl font-semibold text-foreground">
              {categoryCount}
            </span>{" "}
            categories
          </div>
          <div>
            <span className="text-xl font-semibold text-foreground">
              Daily
            </span>{" "}
            updates
          </div>
        </div>
      </div>
    </section>
  );
}
