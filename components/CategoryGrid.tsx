import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllCategories, getCategoryToolCount, getSiteSettings } from "@/lib/db/queries";
import { CategoryIcon } from "./CategoryIcon";

const SHORT_LABEL: Record<string, string> = {
  "ai-chatbots": "AI",
  "ai-support-agents": "AI",
  "live-chat-shared-inbox": "INBOX",
  "helpdesk-ticketing-automation": "HELPDESK",
  "whatsapp-social-messaging-ai": "MESSAGING",
  "knowledge-base-ai-self-service": "KNOWLEDGE",
  "conversational-commerce": "COMMERCE",
  "ai-voice-agents": "VOICE",
  "ai-email-support": "EMAIL",
  "cx-analytics-qa": "ANALYTICS",
  "agent-assist-copilot": "COPILOT",
  "contact-center-ai": "CCAAS",
};

export async function CategoryGrid({
  showHeading = true,
  featured = false,
}: {
  showHeading?: boolean;
  featured?: boolean;
}) {
  const allCategories = await getAllCategories();

  let categories = allCategories;
  if (featured) {
    const settings = await getSiteSettings();
    if (settings.homepageCategorySlugs.length > 0) {
      const slugSet = new Set(settings.homepageCategorySlugs);
      categories = allCategories.filter((c) => slugSet.has(c.slug));
    } else {
      categories = allCategories.slice(0, 6);
    }
  }

  if (featured) {
    return (
      <section id="categories" className="mx-auto max-w-6xl px-6 py-20">
        {showHeading && (
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl">What kind of support stack are you building?</h2>
            <p className="mt-2 text-body">Start with the job to be done, not a giant wall of software logos.</p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group flex flex-col gap-3 rounded-lg border border-border bg-surface p-6 card-shadow transition hover:border-accent/40"
            >
              <p className="eyebrow text-muted">
                {String(i + 1).padStart(2, "0")} · {SHORT_LABEL[cat.slug] ?? cat.name.split(" ")[0].toUpperCase()}
              </p>
              <h3 className="font-medium text-foreground">{cat.name}</h3>
              <p className="text-sm leading-relaxed text-muted">{cat.description}</p>
            </Link>
          ))}
        </div>

        <Link href="/categories" className="mt-6 inline-block text-sm text-muted hover:text-accent">
          View all categories →
        </Link>
      </section>
    );
  }

  const counts = await Promise.all(categories.map((c) => getCategoryToolCount(c.slug)));

  return (
    <section id="categories" className="mx-auto max-w-6xl px-6 py-20">
      {showHeading && (
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="eyebrow text-accent">Browse</p>
            <h2 className="mt-1 text-2xl sm:text-3xl">Find tools by category</h2>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat, i) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="group flex flex-col gap-4 rounded-lg border border-border bg-surface p-6 card-shadow transition hover:border-accent/40"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/12 text-accent">
                <CategoryIcon icon={cat.icon} className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-accent" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">{cat.name}</h3>
              <p className="mt-1 text-sm text-muted line-clamp-2">{cat.description}</p>
            </div>
            <p className="mt-auto text-xs text-muted">{counts[i]} tools</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
