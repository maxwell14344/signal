import Link from "next/link";

export function CategoryTag({
  name,
  slug,
}: {
  name: string;
  slug: string;
}) {
  return (
    <Link
      href={`/categories/${slug}`}
      className="inline-flex items-center rounded-full bg-accent-2/15 px-2.5 py-1 text-xs font-medium text-accent-2 transition hover:bg-accent-2/25"
    >
      {name}
    </Link>
  );
}
