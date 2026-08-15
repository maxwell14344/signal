import Link from "next/link";
import { getAllCategories, getAllTools } from "@/lib/tools";
import { SearchBox } from "./SearchBox";

export function Navbar() {
  const categories = getAllCategories();
  const tools = getAllTools();

  const searchItems = tools.map((t) => ({
    slug: t.slug,
    name: t.name,
    tagline: t.tagline,
    category: t.category,
  }));

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent" />
          <span className="text-lg font-semibold tracking-tight">Signal</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="transition hover:text-foreground"
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        <SearchBox items={searchItems} />
      </div>
    </header>
  );
}
