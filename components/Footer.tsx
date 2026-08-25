import Link from "next/link";
import {
  getAllCategories,
  getAllComparisonsWithNames,
  getAllAlternativePages,
  getAllUseCasePages,
} from "@/lib/db/queries";

const FOOTER_CATEGORY_COUNT = 5;
const FOOTER_LINK_COUNT = 2;

export async function Footer() {
  const [allCategories, comparisons, alternatives, useCases] = await Promise.all([
    getAllCategories(),
    getAllComparisonsWithNames(),
    getAllAlternativePages(),
    getAllUseCasePages(),
  ]);

  const categories = allCategories.slice(0, FOOTER_CATEGORY_COUNT);
  const comparisonLinks = comparisons.slice(0, FOOTER_LINK_COUNT);

  return (
    <footer className="mt-24 border-t border-border bg-surface-2/40">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="max-w-sm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="font-heading text-lg text-foreground">NorthStark</span>
          </div>
          <p className="mt-3 text-sm text-muted">
            NorthStark guides you toward the right customer support stack for
            your business — structured, human-verified reviews of AI
            chatbots, AI agents, live chat, and helpdesk platforms. Written
            and scored by Maxwell Timothy.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <h4 className="eyebrow mb-3">Categories</h4>
            <ul className="space-y-2 text-sm text-muted">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/categories/${cat.slug}`} className="transition hover:text-foreground">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/categories" className="mt-2 inline-block text-xs text-muted hover:text-accent">
              View all →
            </Link>
          </div>

          <div>
            <h4 className="eyebrow mb-3">Compare</h4>
            <ul className="space-y-2 text-sm text-muted">
              {comparisonLinks.map((c) => (
                <li key={c.slug}>
                  <Link href={`/compare/${c.slug}`} className="transition hover:text-foreground">
                    {c.label}
                  </Link>
                </li>
              ))}
              {alternatives.slice(0, 1).map((a) => (
                <li key={a.slug}>
                  <Link href={`/alternatives/${a.slug}`} className="transition hover:text-foreground">
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/compare" className="mt-2 inline-block text-xs text-muted hover:text-accent">
              View all →
            </Link>
          </div>

          <div>
            <h4 className="eyebrow mb-3">Use Cases</h4>
            <ul className="space-y-2 text-sm text-muted">
              {useCases.slice(0, FOOTER_LINK_COUNT + 1).map((u) => (
                <li key={u.slug}>
                  <Link href={`/best/${u.slug}`} className="transition hover:text-foreground">
                    {u.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/best" className="mt-2 inline-block text-xs text-muted hover:text-accent">
              View all →
            </Link>
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
              <li>
                <Link href="/contact" className="transition hover:text-foreground">
                  Contact us
                </Link>
              </li>
              <li>Ask NorthStark — coming soon</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border px-6 py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} NorthStark. All product names and
        trademarks belong to their respective owners.
      </div>
    </footer>
  );
}
