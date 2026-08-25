import Link from "next/link";
import { Check, X } from "lucide-react";
import type { getToolBySlug } from "@/lib/db/queries";
import { ToolLogo } from "./ToolLogo";
import { ScrollHint } from "./ScrollHint";

type MatrixTool = NonNullable<Awaited<ReturnType<typeof getToolBySlug>>>;

function scoreFor(tool: MatrixTool, dimension: string): number | null {
  return tool.scorecard?.find((s) => s.dimension === dimension)?.score ?? null;
}

function ScoreCell({ score }: { score: number | null }) {
  if (score == null) return <span className="text-muted">—</span>;
  return <span className="font-medium text-foreground">{score}/5</span>;
}

function hasFreePlan(tool: MatrixTool): boolean {
  return (
    tool.pricingPlans?.some(
      (p) => /free/i.test(p.name) || /^\$?0(\.00)?(\s|\/|$)/.test(p.price.trim())
    ) ?? false
  );
}

interface Row {
  label: string;
  render: (tool: MatrixTool) => React.ReactNode;
}

const ROWS: Row[] = [
  {
    label: "Overall rating",
    render: (t) => (t.rating != null ? `${Number(t.rating).toFixed(1)} / 5` : <span className="text-muted">Not yet rated</span>),
  },
  {
    label: "Starting price",
    render: (t) => t.pricingStartingPrice || <span className="text-muted">Not publicly documented</span>,
  },
  {
    label: "Pricing model",
    render: (t) => t.pricingModel || <span className="text-muted">—</span>,
  },
  {
    label: "Free plan available",
    render: (t) => (hasFreePlan(t) ? <Check className="mx-auto h-4 w-4 text-positive" /> : <X className="mx-auto h-4 w-4 text-negative" />),
  },
  {
    label: "Ease of setup",
    render: (t) => <ScoreCell score={scoreFor(t, "Ease of Setup")} />,
  },
  {
    label: "AI quality",
    render: (t) => <ScoreCell score={scoreFor(t, "AI Quality")} />,
  },
  {
    label: "Omnichannel support",
    render: (t) => <ScoreCell score={scoreFor(t, "Omnichannel Support")} />,
  },
  {
    label: "Pricing value",
    render: (t) => <ScoreCell score={scoreFor(t, "Pricing Value")} />,
  },
  {
    label: "Vendor support quality",
    render: (t) => <ScoreCell score={scoreFor(t, "Vendor Support Quality")} />,
  },
  {
    label: "Channels supported",
    render: (t) => (t.channels && t.channels.length > 0 ? t.channels.join(", ") : <span className="text-muted">—</span>),
  },
  {
    label: "Key features",
    render: (t) =>
      t.keyFeatures && t.keyFeatures.length > 0 ? (
        <ul className="space-y-1 text-left">
          {t.keyFeatures.slice(0, 3).map((f, i) => (
            <li key={i} className="text-xs leading-snug">{f}</li>
          ))}
        </ul>
      ) : (
        <span className="text-muted">—</span>
      ),
  },
  {
    label: "Best for",
    render: (t) => (t.bestFor && t.bestFor.length > 0 ? t.bestFor[0] : <span className="text-muted">—</span>),
  },
];

export function ComparisonMatrix({ tools }: { tools: MatrixTool[] }) {
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
            {ROWS.map((row) => (
              <tr key={row.label} className="border-b border-border last:border-none">
                <td className="p-4 text-body">{row.label}</td>
                {tools.map((t) => (
                  <td key={t.slug} className="p-4 text-center">
                    {row.render(t)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollHint>
    </div>
  );
}
