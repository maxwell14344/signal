import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Methodology",
  description: "How NorthStark scores AI customer support tools and sources sentiment.",
};

const DIMENSIONS = [
  {
    name: "Ease of Setup",
    desc: "How fast a team can go from signup to a working, customer-facing deployment â€” based on documented onboarding flows and what independent reviewers report about time-to-launch.",
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
    desc: "Whether the published (or documented) pricing is predictable and fair for what you get â€” usage-based AI billing that can spike unexpectedly scores lower here, even if the base price looks cheap.",
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
          Every tool on NorthStark is scored against the same five-dimension
          rubric below, and every fact â€” pricing, features, sentiment quotes
          â€” comes from a real source: official pricing pages, vendor
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
          verified&quot; date â€” the last time someone actually re-checked
          pricing and facts against the live source, not just when the page
          was first published. Pricing and product details change often in
          this category; a stale review is worse than no review.
        </p>

        <h2 className="mt-10 mb-4 text-lg">Who writes this</h2>
        <p className="text-[15px] leading-relaxed text-body">
          NorthStark is written and scored by{" "}
          <Link href="/authors/maxwell-timothy" className="text-accent hover:underline">
            Maxwell Timothy
          </Link>
          , who works in customer support tooling. Every tool is scored
          against the same rubric, and no tool pays for placement, a better
          score, or inclusion.
        </p>
      </div>
    </main>
  );
}
