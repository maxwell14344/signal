import Link from "next/link";
import { getAllCategories } from "@/lib/db/queries";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl">Categories</h1>
        <Link
          href="/admin/categories/new"
          className="rounded-full bg-accent px-4 py-2 text-xs font-medium text-accent-foreground transition hover:opacity-90"
        >
          New category
        </Link>
      </div>
      <div className="mt-6 divide-y divide-border rounded-lg border border-border bg-surface card-shadow">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/admin/categories/${cat.id}/edit`}
            className="flex items-center justify-between p-4 transition hover:bg-surface-2"
          >
            <div>
              <p className="font-medium text-foreground">{cat.name}</p>
              <p className="text-xs text-muted">{cat.slug}</p>
            </div>
            <span className="text-sm text-muted">Edit →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
