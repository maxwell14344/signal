import Link from "next/link";
import { getAllAlternativePages } from "@/lib/db/queries";
import { db } from "@/lib/db/client";
import { tools } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function AdminAlternativesPage() {
  const pages = await getAllAlternativePages();
  const withAnchor = await Promise.all(
    pages.map(async (p) => {
      const [t] = await db.select().from(tools).where(eq(tools.id, p.anchorToolId)).limit(1);
      return { ...p, anchorName: t?.name };
    })
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl">Alternatives pages</h1>
        <Link
          href="/admin/alternatives/new"
          className="rounded-full bg-accent px-4 py-2 text-xs font-medium text-accent-foreground transition hover:opacity-90"
        >
          New alternatives page
        </Link>
      </div>
      <div className="mt-6 divide-y divide-border rounded-lg border border-border bg-surface card-shadow">
        {withAnchor.map((p) => (
          <Link
            key={p.id}
            href={`/admin/alternatives/${p.id}/edit`}
            className="flex items-center justify-between p-4 transition hover:bg-surface-2"
          >
            <div>
              <p className="font-medium text-foreground">{p.title}</p>
              <p className="text-xs text-muted">{p.slug} · anchor: {p.anchorName}</p>
            </div>
            <span className="text-sm text-muted">Edit →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
