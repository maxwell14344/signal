import { getAllTools } from "@/lib/db/queries";
import { ToolCard } from "./ToolCard";

export async function AllToolsGrid() {
  const tools = await getAllTools();

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-8">
        <p className="eyebrow text-accent">All reviews</p>
        <h2 className="mt-1 text-2xl sm:text-3xl">Every tool, reviewed</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} categoryName={tool.primaryCategory?.name} />
        ))}
      </div>
    </section>
  );
}
