import type { ScorecardEntry } from "@/lib/db/schema";

export function ScorecardBlock({ scorecard }: { scorecard: ScorecardEntry[] }) {
  if (!scorecard || scorecard.length === 0) return null;

  const overall = scorecard.reduce((sum, s) => sum + s.score, 0) / scorecard.length;

  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-lg">Our scorecard</h2>
        <span className="eyebrow">Overall {overall.toFixed(1)}/5</span>
      </div>
      <div className="space-y-4 rounded-lg border border-border bg-surface p-5 card-shadow">
        {scorecard.map((entry) => (
          <div key={entry.dimension}>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{entry.dimension}</span>
              <span className="text-sm text-muted">{entry.score}/5</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${(entry.score / 5) * 100}%` }}
              />
            </div>
            {entry.note && (
              <p className="mt-1.5 text-xs text-muted">{entry.note}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
