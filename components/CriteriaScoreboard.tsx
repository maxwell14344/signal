import { SCORING_GROUPS, SCORING_CRITERIA } from "@/lib/scoringCriteria";
import type { CriterionScore } from "@/lib/db/schema";

export function CriteriaScoreboard({ scores }: { scores: CriterionScore[] }) {
  if (!scores || scores.length === 0) return null;

  const scoreByKey = new Map(scores.map((s) => [s.key, s]));
  const overall = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg">Full scoring breakdown</h2>
        <span className="eyebrow">
          Overall {overall.toFixed(1)}/5 · {scores.length}/{SCORING_CRITERIA.length} criteria scored
        </span>
      </div>

      <div className="space-y-6">
        {SCORING_GROUPS.map((group) => {
          const criteriaInGroup = SCORING_CRITERIA.filter((c) => c.group === group);
          const scoredInGroup = criteriaInGroup.filter((c) => scoreByKey.has(c.key));
          if (scoredInGroup.length === 0) return null;

          return (
            <div key={group} className="rounded-lg border border-border bg-surface p-5 card-shadow">
              <h3 className="mb-3 text-sm font-medium text-foreground">{group}</h3>
              <div className="space-y-4">
                {scoredInGroup.map((c) => {
                  const entry = scoreByKey.get(c.key)!;
                  return (
                    <div key={c.key}>
                      <div className="mb-1.5 flex items-center justify-between gap-3">
                        <span className="text-sm text-body">{c.label}</span>
                        <span className="shrink-0 text-sm text-muted">{entry.score}/5</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{ width: `${(entry.score / 5) * 100}%` }}
                        />
                      </div>
                      {entry.note && <p className="mt-1.5 text-xs text-muted">{entry.note}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
