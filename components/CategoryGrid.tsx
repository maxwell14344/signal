import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllCategories, getCategoryToolCount } from "@/lib/db/queries";
import { CategoryIcon } from "./CategoryIcon";

export async function CategoryGrid({ showHeading = true }: { showHeading?: boolean }) {
  const categories = await getAllCategories();
  const counts = await Promise.all(categories.map((c) => getCategoryToolCount(c.slug)));

  return (
    <section id="categories" className="mx-auto max-w-6xl px-6 py-20">
      {showHeading && (
        <div className="mb-8">
          <p className="eyebrow text-accent">Browse</p>
          <h2 className="mt-1 text-2xl sm:text-3xl">Find tools by category</h2>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat, i) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="group flex flex-col gap-4 rounded-lg border border-border bg-surface p-6 card-shadow transition hover:border-accent/40"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/12 text-accent">
                <CategoryIcon icon={cat.icon} className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-accent" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">{cat.name}</h3>
              <p className="mt-1 text-sm text-muted line-clamp-2">{cat.description}</p>
            </div>
            <p className="mt-auto text-xs text-muted">{counts[i]} tools</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
