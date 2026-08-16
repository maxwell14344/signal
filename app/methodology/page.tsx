import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Methodology",
  description: "How Signal scores AI customer support tools, sources sentiment, and discloses conflicts of interest.",
};

const DIMENSIONS = [
  {
    name: "Ease of Setup",
    desc: "How fast a team can go from signup to a working, customer-facing deployment — based on documented onboarding flows and what independent reviewers report about time-to-launch.",
  },
  {
    name: "AI Quality",
    desc: "How well the AI actually resolves conversations without hallucinating or losing context, based on independent review data (G2, Trustpilot, Capterra) where available, and product design signals (guardrails against stale data, escalation logic) where it isn't.",
  },
  {
    name: "Omnichannel Support",
    desc: "How many real support channels (web chat, WhatsApp, email, voice, social DMs) the tool covers natively, versus bolted on or missing entirely.",
  },
  {
    name: "Pricing Value",
    desc: "Whether the published (or documented) pricing is predictable and fair for what you get — usage-based AI billing that can spike unexpectedly scores lower here, even if the base price looks cheap.",
  },
  {
    name: "Vendor Support Quality",
    desc: "How responsive and reliable the vendor itself is, based on independent review volume and sentiment, not vendor marketing claims.",
  },
];

export default function MethodologyPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <p className="eyebrow text-accent">Trust</p>
        <h1 className="mt-2 text-3xl tracking-tight">Methodology</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-body">
          Every tool on Signal is scored against the same five-dimension
          rubric below, and every fact — pricing, features, sentiment quotes
          — comes from a real source: official pricing pages, vendor
          documentation, or independent reviews on G2, Capterra, Trustpilot,
          Reddit, and Hacker News. We don&apos;t fabricate quotes or invent
          numbers. Where something isn&apos;t publicly documented, the page
          says so instead of guessing.
        </p>

        <h2 className="mt-10 mb-4 text-lg">The scorecard</h2>
        <div className="space-y-5">
          {DIMENSIONS.map((d) => (
            <div key={d.name} className="rounded-lg border border-border bg-surface p-5 card-shadow">
              <h3 className="font-medium text-foreground">{d.name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-body">{d.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-10 mb-4 text-lg">Freshness &amp; &quot;last verified&quot;</h2>
        <p className="text-[15px] leading-relaxed text-body">
          Every tool, comparison, and alternatives page carries a &quot;last
          verified&quot; date — the last time someone actually re-checked
          pricing and facts against the live source, not just when the page
          was first published. Pricing and product details change often in
          this category; a stale review is worse than no review.
        </p>

        <h2 className="mt-10 mb-4 text-lg">Conflicts of interest</h2>
        <p className="text-[15px] leading-relaxed text-body">
          Signal is written by{" "}
          <Link href="/authors/maxwell-timothy" className="text-accent hover:underline">
            Maxwell Timothy
          </Link>
          , who works in Growth and Marketing at Heyy and has previously
          written contributed content for Chatbase and Crisp — all three are
          reviewed on this site. Each is scored against the exact same
          rubric as every other tool on the same page, and any comparison
          involving one of them discloses the relationship explicitly at the
          top rather than burying it here. No tool on this site pays for
          placement, a better score, or inclusion — there is currently no
          affiliate or sponsorship program running on Signal. If that ever
          changes, this page will say so first.
        </p>
      </div>
    </main>
  );
}
