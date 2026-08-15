import { Check, X } from "lucide-react";

export function ProsConsList({
  pros,
  cons,
}: {
  pros: string[];
  cons: string[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-border bg-surface p-5">
        <h3 className="mb-3 text-sm font-medium text-positive">Pros</h3>
        <ul className="space-y-2">
          {pros.map((pro, i) => (
            <li key={i} className="flex gap-2 text-sm text-foreground">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-positive" />
              <span>{pro}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5">
        <h3 className="mb-3 text-sm font-medium text-negative">Cons</h3>
        <ul className="space-y-2">
          {cons.map((con, i) => (
            <li key={i} className="flex gap-2 text-sm text-foreground">
              <X className="mt-0.5 h-4 w-4 shrink-0 text-negative" />
              <span>{con}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
