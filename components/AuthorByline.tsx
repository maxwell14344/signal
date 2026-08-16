import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { AuthorRow } from "@/lib/db/queries";

function formatDate(date: Date | string | null | undefined) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function AuthorByline({
  author,
  lastVerifiedAt,
}: {
  author?: AuthorRow;
  lastVerifiedAt?: Date | string | null;
}) {
  if (!author) return null;
  const verified = formatDate(lastVerifiedAt);

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
      <span>
        Reviewed by{" "}
        <Link href={`/authors/${author.slug}`} className="font-medium text-foreground hover:text-accent">
          {author.name}
        </Link>
      </span>
      {verified && (
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-positive" />
          Last verified {verified}
        </span>
      )}
    </div>
  );
}
