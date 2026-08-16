import Link from "next/link";
import { getAllAuthors } from "@/lib/db/queries";

export default async function AdminAuthorsPage() {
  const authors = await getAllAuthors();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl">Authors</h1>
        <Link
          href="/admin/authors/new"
          className="rounded-full bg-accent px-4 py-2 text-xs font-medium text-accent-foreground transition hover:opacity-90"
        >
          New author
        </Link>
      </div>
      <div className="mt-6 divide-y divide-border rounded-lg border border-border bg-surface card-shadow">
        {authors.map((a) => (
          <Link
            key={a.id}
            href={`/admin/authors/${a.id}/edit`}
            className="flex items-center gap-3 p-4 transition hover:bg-surface-2"
          >
            {a.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={a.avatarUrl} alt={a.name} className="h-9 w-9 rounded-full border border-border object-cover" />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-2 text-sm font-semibold text-accent">
                {a.name.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <p className="font-medium text-foreground">{a.name}</p>
              <p className="text-xs text-muted">{a.credentials ?? a.slug}</p>
            </div>
            <span className="text-sm text-muted">Edit →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
