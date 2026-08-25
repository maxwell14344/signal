import Link from "next/link";
import { getAllTools } from "@/lib/db/queries";
import { SearchBox } from "./SearchBox";
import { LogoMark } from "./LogoMark";

export async function Navbar() {
  const tools = await getAllTools();

  const searchItems = tools.map((t) => ({
    slug: t.slug,
    name: t.name,
    tagline: t.tagline,
    category: t.primaryCategory?.name ?? "",
  }));

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark size={28} />
          <span className="font-heading text-lg text-foreground">NorthStark</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          <Link href="/categories" className="transition hover:text-foreground">
            Categories
          </Link>
          <Link href="/methodology" className="transition hover:text-foreground">
            Methodology
          </Link>
          <Link href="/authors/maxwell-timothy" className="transition hover:text-foreground">
            About
          </Link>
        </nav>

        <SearchBox items={searchItems} />
      </div>
    </header>
  );
}
