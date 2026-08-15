import { getAllTools, getCategoryBySlug } from "@/lib/tools";
import { ToolCard } from "./ToolCard";

export function AllToolsGrid() {
  const tools = getAllTools();

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-8">
        <p className="text-sm font-medium text-accent">All reviews</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Every tool, reviewed
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard
            key={tool.slug}
            tool={tool}
            categoryName={getCategoryBySlug(tool.category)?.name}
          />
        ))}
      </div>
    </section>
  );
}
