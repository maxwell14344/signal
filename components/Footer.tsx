import Link from "next/link";
import {
  getAllCategories,
  getAllComparisons,
  getAllAlternativePages,
  getAllUseCasePages,
} from "@/lib/db/queries";
import { db } from "@/lib/db/client";
import { tools } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const FOOTER_CATEGORY_COUNT = 5;
const FOOTER_LINK_COUNT = 2;

export async function Footer() {
  const [allCategories, comparisons, alternatives, useCases] = await Promise.all([
    getAllCategories(),
    getAllComparisons(),
    getAllAlternativePages(),
    getAllUseCasePages(),
  ]);

  const categories = allCategories.slice(0, FOOTER_CATEGORY_COUNT);

  const comparisonLinks = await Promise.all(
    comparisons.slice(0, FOOTER_LINK_COUNT).map(async (c) => {
      const [[a], [b]] = await Promise.all([
        db.select().from(tools).where(eq(tools.id, c.toolAId)).limit(1),
        db.select().from(tools).where(eq(tools.id, c.toolBId)).limit(1),
      ]);
      return { slug: c.slug, label: `${a?.name} vs ${b?.name}` };
    })
  );

  return (
    <footer className="mt-24 border-t border-border bg-surface-2/40">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="max-w-sm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="font-heading text-lg text-foreground">NorthStack</span>
          </div>
          <p className="mt-3 text-sm text-muted">
            NorthStack guides you toward the right customer support stack for
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
              <li>Ask NorthStack — coming soon</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border px-6 py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} NorthStack. All product names and
        trademarks belong to their respective owners.
      </div>
    </footer>
  );
}
