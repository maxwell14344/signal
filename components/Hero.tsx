import { ArrowRight } from "lucide-react";
import { getHeroShortlistTools } from "@/lib/db/queries";
import { ToolLogo } from "./ToolLogo";

const TAG_LABEL: Record<string, string> = {
  "ai-chatbots": "AI chatbot",
  "ai-support-agents": "AI support agent",
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

export async function Hero() {
  const shortlist = await getHeroShortlistTools();
  const rated = shortlist.filter((t) => t.rating != null);
  const avgRating = rated.length
    ? rated.reduce((sum, t) => sum + Number(t.rating), 0) / rated.length
    : null;

  return (
    <section className="relative overflow-hidden border-b border-border bg-grid">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 15% 0%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 55%)",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:py-20 lg:grid-cols-[1fr_420px] lg:items-center">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Built to help you decide, not just browse
          </div>

          <h1 className="text-4xl tracking-tight sm:text-5xl">
            Stop guessing. Start building{" "}
            <span className="text-accent">the right support stack</span>.
          </h1>

          <p className="mt-6 max-w-xl text-lg text-body">
            NorthStark helps growing businesses choose the right customer
            support software — matched to your budget, the features you
            actually need, and the stage your team is at. Structured
            reviews, real pricing, honest scorecards, and side-by-side
            comparisons for every decision along the way.
          </p>

          <form action="/tools" method="GET" className="mt-8 flex max-w-lg flex-col gap-3 sm:flex-row">
            <input
              type="text"
              name="q"
              placeholder='What are you trying to solve? e.g. "support for a SaaS"'
              className="w-full rounded-full border border-border bg-surface px-5 py-3 text-sm text-foreground focus:border-accent/50 focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-90"
            >
              Find tools
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        {shortlist.length > 0 && (
          <div className="rounded-2xl border-2 border-foreground bg-surface p-2 card-shadow">
            <div className="flex items-center justify-between px-3 py-2.5">
              <p className="text-sm font-medium text-foreground">Your shortlist</p>
              {avgRating != null && (
                <span className="rounded-full bg-accent/12 px-2.5 py-1 text-xs font-medium text-accent">
                  Avg {avgRating.toFixed(1)}★
                </span>
              )}
            </div>
            <div className="space-y-2">
              {shortlist.map((tool) => (
                <div
                  key={tool.slug}
                  className="card-hover flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-3"
                >
                  <ToolLogo name={tool.name} logo={tool.logoUrl} website={tool.website} size={36} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{tool.name}</p>
                    <p className="text-xs text-muted">
                      {tool.primaryCategory ? TAG_LABEL[tool.primaryCategory.slug] ?? tool.primaryCategory.name : ""}
                    </p>
                  </div>
                  {tool.rating != null && (
                    <span className="font-heading text-foreground">{Number(tool.rating).toFixed(1)}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
