import { Fragment } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import type { getToolBySlug } from "@/lib/db/queries";
import { SCORING_GROUPS, SCORING_CRITERIA } from "@/lib/scoringCriteria";
import { ToolLogo } from "./ToolLogo";
import { ScrollHint } from "./ScrollHint";

type MatrixTool = NonNullable<Awaited<ReturnType<typeof getToolBySlug>>>;

function hasFreePlan(tool: MatrixTool): boolean {
  return (
    tool.pricingPlans?.some(
      (p) => /free/i.test(p.name) || /^\$?0(\.00)?(\s|\/|$)/.test(p.price.trim())
    ) ?? false
  );
}

function ScoreCell({ score, note }: { score: number | undefined; note?: string }) {
  if (score == null) return <span className="text-muted">—</span>;
  return (
    <span className="font-medium text-foreground" title={note}>
      {score}/5
    </span>
  );
}

export function ComparisonMatrix({ tools }: { tools: MatrixTool[] }) {
  const scoresByTool = tools.map((t) => new Map((t.criteriaScores ?? []).map((s) => [s.key, s])));
  const anyScored = scoresByTool.some((m) => m.size > 0);

  return (
    <div className="rounded-lg border border-border bg-surface card-shadow">
      <ScrollHint className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="p-4 font-medium text-muted">Criteria</th>
              {tools.map((t) => (
                <th key={t.slug} className="p-4 text-center font-medium text-foreground">
                  <Link href={`/tools/${t.slug}`} className="flex flex-col items-center gap-2 hover:text-accent">
                    <ToolLogo name={t.name} logo={t.logoUrl} website={t.website} size={32} />
                    {t.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border bg-surface-2/40">
              <td className="p-4 text-body">Overall rating</td>
              {tools.map((t) => (
                <td key={t.slug} className="p-4 text-center">
                  {t.rating != null ? `${Number(t.rating).toFixed(1)} / 5` : <span className="text-muted">Not yet rated</span>}
                </td>
              ))}
            </tr>
            <tr className="border-b border-border bg-surface-2/40">
              <td className="p-4 text-body">Starting price</td>
              {tools.map((t) => (
                <td key={t.slug} className="p-4 text-center">
                  {t.pricingStartingPrice || <span className="text-muted">Not publicly documented</span>}
                </td>
              ))}
            </tr>
            <tr className="border-b border-border bg-surface-2/40">
              <td className="p-4 text-body">Free plan available</td>
              {tools.map((t) => (
                <td key={t.slug} className="p-4 text-center">
                  {hasFreePlan(t) ? <Check className="mx-auto h-4 w-4 text-positive" /> : <X className="mx-auto h-4 w-4 text-negative" />}
                </td>
              ))}
            </tr>

            {SCORING_GROUPS.map((group) => (
              <Fragment key={group}>
                <tr className="border-b border-border">
                  <td colSpan={tools.length + 1} className="bg-surface-2/70 px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted">
                    {group}
                  </td>
                </tr>
                {SCORING_CRITERIA.filter((c) => c.group === group).map((c) => (
                  <tr key={c.key} className="border-b border-border last:border-none">
                    <td className="p-4 text-body">{c.label}</td>
                    {tools.map((t, i) => {
                      const entry = scoresByTool[i].get(c.key);
                      return (
                        <td key={t.slug} className="p-4 text-center">
                          <ScoreCell score={entry?.score} note={entry?.note} />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </ScrollHint>
      {!anyScored && (
        <p className="border-t border-border px-4 py-3 text-xs text-muted">
          None of the selected tools have been scored against the 25-criteria
          rubric yet — see the{" "}
          <Link href="/methodology" className="text-accent hover:underline">methodology page</Link>{" "}
          for what each criterion measures.
        </p>
      )}
    </div>
  );
}
