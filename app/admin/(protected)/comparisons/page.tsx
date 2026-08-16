import Link from "next/link";
import { getAllComparisons } from "@/lib/db/queries";
import { db } from "@/lib/db/client";
import { tools } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function AdminComparisonsPage() {
  const comparisons = await getAllComparisons();
  const withTools = await Promise.all(
    comparisons.map(async (c) => {
      const [a] = await db.select().from(tools).where(eq(tools.id, c.toolAId)).limit(1);
      const [b] = await db.select().from(tools).where(eq(tools.id, c.toolBId)).limit(1);
      return { ...c, toolAName: a?.name, toolBName: b?.name };
    })
  );

  return (
    <div>
      <h1 className="text-xl">Comparisons</h1>
      <div className="mt-6 divide-y divide-border rounded-lg border border-border bg-surface card-shadow">
        {withTools.map((c) => (
          <Link
            key={c.id}
            href={`/admin/comparisons/${c.id}/edit`}
            className="flex items-center justify-between p-4 transition hover:bg-surface-2"
          >
            <div>
              <p className="font-medium text-foreground">
                {c.toolAName} vs {c.toolBName}
              </p>
              <p className="text-xs text-muted">{c.slug}</p>
            </div>
            <span className="text-sm text-muted">Edit →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
