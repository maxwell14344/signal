import Link from "next/link";
import { getAllCategories } from "@/lib/tools";

export function Footer() {
  const categories = getAllCategories();

  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="text-lg font-semibold tracking-tight">
              Signal
            </span>
          </div>
          <p className="mt-3 text-sm text-muted">
            Structured, AI-citable reviews of AI tools — pricing, pros/cons,
            and real sentiment from Reddit, X, and Hacker News. New tools
            added regularly.
          </p>
        </div>

        <div className="flex gap-16">
          <div>
            <h4 className="text-sm font-medium text-foreground">
              Categories
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-muted">
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
            <h4 className="text-sm font-medium text-foreground">Coming soon</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>Ask Signal — AI tool chatbot</li>
              <li>Submit a tool</li>
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
