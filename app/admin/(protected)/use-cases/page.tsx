import Link from "next/link";
import { getAllUseCasePages } from "@/lib/db/queries";

export default async function AdminUseCasesPage() {
  const pages = await getAllUseCasePages();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl">Use-case pages</h1>
        <Link
          href="/admin/use-cases/new"
          className="rounded-full bg-accent px-4 py-2 text-xs font-medium text-accent-foreground transition hover:opacity-90"
        >
          New use-case page
        </Link>
      </div>
      <div className="mt-6 divide-y divide-border rounded-lg border border-border bg-surface card-shadow">
        {pages.map((p) => (
          <Link
            key={p.id}
            href={`/admin/use-cases/${p.id}/edit`}
            className="flex items-center justify-between p-4 transition hover:bg-surface-2"
          >
            <div>
              <p className="font-medium text-foreground">{p.title}</p>
              <p className="text-xs text-muted">{p.slug}</p>
            </div>
            <span className="text-sm text-muted">Edit →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
