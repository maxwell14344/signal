import type { Metadata } from "next";
import Link from "next/link";
import { SCORING_GROUPS, SCORING_CRITERIA } from "@/lib/scoringCriteria";

export const metadata: Metadata = {
  title: "Methodology",
  description: "How NorthStark scores AI customer support tools against a 25-criteria rubric, and where every fact comes from.",
  alternates: { canonical: "/methodology" },
};

const LEGACY_DIMENSIONS = [
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
          Every tool on NorthStark is scored against the same 25-criteria
          rubric below, and every fact — pricing, features, sentiment quotes
          — comes from a real source: official pricing pages, vendor
          documentation, or independent reviews on G2, Capterra, Trustpilot,
          Reddit, and Hacker News. We don&apos;t fabricate quotes or invent
          numbers. Where something isn&apos;t publicly documented, or a tool
          hasn&apos;t been scored against a given criterion yet, the page
          says so instead of guessing.
        </p>

        <h2 className="mt-10 mb-4 text-lg">The 25-criteria rubric</h2>
        <p className="text-[15px] leading-relaxed text-body">
          Every tool is judged against the same 25 criteria, grouped into
          six categories below. Each criterion is scored 0-5 with a note
          explaining the score, so a number is never presented without the
          reasoning behind it. We&apos;re re-scoring tools against this
          rubric in batches — a tool page will show whatever has been
          scored so far, clearly labeled, rather than padding out the rest
          with guesses.
        </p>

        <div className="mt-6 space-y-6">
          {SCORING_GROUPS.map((group) => (
            <div key={group} className="rounded-lg border border-border bg-surface p-5 card-shadow">
              <h3 className="font-medium text-foreground">{group}</h3>
              <ul className="mt-3 space-y-3">
                {SCORING_CRITERIA.filter((c) => c.group === group).map((c) => (
                  <li key={c.key}>
                    <p className="text-sm font-medium text-body">{c.label}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted">{c.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2 className="mt-10 mb-4 text-lg">Legacy 5-point scorecard</h2>
        <p className="text-[15px] leading-relaxed text-body">
          Tools we haven&apos;t re-scored against the 25-criteria rubric
          yet still carry an older, simpler 5-dimension scorecard. It&apos;s
          being phased out as tools are migrated to the fuller rubric
          above, but it&apos;s documented here for as long as it&apos;s
          still live on any tool page.
        </p>
        <div className="mt-4 space-y-5">
          {LEGACY_DIMENSIONS.map((d) => (
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
