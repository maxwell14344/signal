import Link from "next/link";
import { getAllTools } from "@/lib/db/queries";

export default async function AdminToolsPage() {
  const tools = await getAllTools();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl">Tools</h1>
        <div className="flex items-center gap-4">
          <a
            href="/tools"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted hover:text-accent"
          >
            View live site →
          </a>
          <Link
            href="/admin/tools/new"
            className="rounded-full bg-accent px-4 py-2 text-xs font-medium text-accent-foreground transition hover:opacity-90"
          >
            New tool
          </Link>
        </div>
      </div>

      <div className="mt-6 divide-y divide-border rounded-lg border border-border bg-surface card-shadow">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            href={`/admin/tools/${tool.id}/edit`}
            className="flex items-center justify-between p-4 transition hover:bg-surface-2"
          >
            <div>
              <p className="font-medium text-foreground">{tool.name}</p>
              <p className="text-xs text-muted">
                {tool.primaryCategory?.name ?? "Uncategorized"} · v{tool.version}
              </p>
            </div>
            <span className="text-sm text-muted">Edit →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
