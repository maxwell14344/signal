import Link from "next/link";
import { getTrendingTools, getAllTools } from "@/lib/db/queries";
import { ToolLogo } from "./ToolLogo";

const TAG_LABEL: Record<string, string> = {
  "ai-chatbots": "AI chatbot",
  "ai-support-agents": "AI agent",
  "live-chat-shared-inbox": "Inbox + AI",
  "helpdesk-ticketing-automation": "Helpdesk",
  "whatsapp-social-messaging-ai": "Messaging AI",
  "knowledge-base-ai-self-service": "Self-service AI",
  "conversational-commerce": "Commerce AI",
  "ai-voice-agents": "Voice AI",
  "ai-email-support": "Email AI",
  "cx-analytics-qa": "Analytics",
  "agent-assist-copilot": "Copilot",
  "contact-center-ai": "CCaaS",
};

const LIST_COUNT = 4;

export async function ShortlistCompareSection() {
  const trending = await getTrendingTools();
  const list = trending.length >= LIST_COUNT ? trending.slice(0, LIST_COUNT) : (await getAllTools()).slice(0, LIST_COUNT);

  if (list.length === 0) return null;

  return (
    <section id="trending" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-10">
        <h2 className="text-2xl sm:text-3xl">Shortlist, compare, decide.</h2>
        <p className="mt-2 text-body">
          A decision layer between &ldquo;I need support software&rdquo; and &ldquo;we just signed a 12-month contract.&rdquo;
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-border bg-surface card-shadow">
          {list.map((tool, i) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className={`group flex items-center gap-4 px-5 py-4 transition hover:bg-surface-2 ${i > 0 ? "border-t border-border" : ""}`}
            >
              <ToolLogo name={tool.name} logo={tool.logoUrl} website={tool.website} size={40} />
              <div className="flex flex-1 items-center gap-2.5">
                <p className="font-medium text-foreground">{tool.name}</p>
                {tool.primaryCategory && (
                  <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs text-muted">
                    {TAG_LABEL[tool.primaryCategory.slug] ?? tool.primaryCategory.name}
                  </span>
                )}
              </div>
              {tool.rating != null && (
                <span className="font-heading text-lg text-foreground">{Number(tool.rating).toFixed(1)}</span>
              )}
            </Link>
          ))}
        </div>

        <div className="flex flex-col justify-center rounded-lg border border-border bg-surface p-8 card-shadow">
          <p className="eyebrow text-accent">Decision engine</p>
          <h3 className="mt-2 text-xl">Compare what actually matters.</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Pricing, setup effort, AI capability, channels, integrations,
            automation, support, and who each tool is really built for.
          </p>
          <Link
            href="/compare"
            className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90"
          >
            Compare tools →
          </Link>
        </div>
      </div>
    </section>
  );
}
