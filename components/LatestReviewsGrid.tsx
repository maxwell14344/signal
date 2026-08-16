import Link from "next/link";
import { getAllTools } from "@/lib/db/queries";
import { ToolCard } from "./ToolCard";

const LATEST_COUNT = 6;

export async function LatestReviewsGrid() {
  const tools = (await getAllTools()).slice(0, LATEST_COUNT);
  if (tools.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="eyebrow text-accent">Fresh</p>
          <h2 className="mt-1 text-2xl sm:text-3xl">Latest reviews</h2>
        </div>
        <Link href="/tools" className="text-sm text-muted hover:text-accent">
          View all tools →
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} categoryName={tool.primaryCategory?.name} />
        ))}
      </div>
    </section>
  );
}
