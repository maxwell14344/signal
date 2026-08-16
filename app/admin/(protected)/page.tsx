import Link from "next/link";
import {
  getAllTools,
  getAllCategories,
  getAllComparisons,
  getAllAlternativePages,
  getAllUseCasePages,
} from "@/lib/db/queries";

export default async function AdminDashboard() {
  const [tools, categories, comparisons, alternatives, useCases] = await Promise.all([
    getAllTools(),
    getAllCategories(),
    getAllComparisons(),
    getAllAlternativePages(),
    getAllUseCasePages(),
  ]);

  const stats = [
    { label: "Tools", count: tools.length, href: "/admin/tools" },
    { label: "Categories", count: categories.length, href: "/admin/categories" },
    { label: "Comparisons", count: comparisons.length, href: "/admin/comparisons" },
    { label: "Alternatives pages", count: alternatives.length, href: "/admin/tools" },
    { label: "Use-case pages", count: useCases.length, href: "/admin/tools" },
  ];

  return (
    <div>
      <h1 className="text-xl">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-lg border border-border bg-surface p-5 card-shadow transition hover:border-accent/40"
          >
            <p className="font-heading text-2xl text-foreground">{s.count}</p>
            <p className="mt-1 text-sm text-muted">{s.label}</p>
          </Link>
        ))}
      </div>
      <p className="mt-8 text-sm text-muted">
        Content edited here is the live source of truth for the deployed
        site. The JSON files in <code>content/</code> stay independently
        editable via git — use <code>npm run db:export</code> to snapshot
        admin edits back into JSON, or <code>npm run db:import</code> to push
        JSON edits into the database.
      </p>
    </div>
  );
}
