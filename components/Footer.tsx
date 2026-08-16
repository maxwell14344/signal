import Link from "next/link";
import { getAllCategories } from "@/lib/db/queries";

export async function Footer() {
  const categories = await getAllCategories();

  return (
    <footer className="mt-24 border-t border-border bg-surface-2/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="font-heading text-lg text-foreground">Signal</span>
          </div>
          <p className="mt-3 text-sm text-muted">
            Structured, human-verified reviews of AI customer support tools —
            chatbots, AI agents, WhatsApp AI, helpdesk automation, and CX
            platforms. Written and scored by Maxwell Timothy.
          </p>
        </div>

        <div className="flex gap-16">
          <div>
            <h4 className="eyebrow mb-3">Categories</h4>
            <ul className="space-y-2 text-sm text-muted">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="transition hover:text-foreground"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="eyebrow mb-3">Trust</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link href="/methodology" className="transition hover:text-foreground">
                  Methodology & scoring
                </Link>
              </li>
              <li>
                <Link href="/authors/maxwell-timothy" className="transition hover:text-foreground">
                  About the author
                </Link>
              </li>
              <li>Ask Signal — coming soon</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border px-6 py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} Signal. All product names and trademarks
        belong to their respective owners.
      </div>
    </footer>
  );
}
