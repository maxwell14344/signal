import { Check, X } from "lucide-react";
import type { FeatureMatrixRow } from "@/lib/db/schema";

function Cell({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="mx-auto h-4 w-4 text-positive" />
    ) : (
      <X className="mx-auto h-4 w-4 text-negative" />
    );
  }
  return <span className="text-sm text-body">{value}</span>;
}

export function FeatureMatrixTable({
  rows,
  toolAName,
  toolBName,
}: {
  rows: FeatureMatrixRow[];
  toolAName: string;
  toolBName: string;
}) {
  if (!rows || rows.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface card-shadow">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="p-4 font-medium text-muted">Feature</th>
            <th className="p-4 text-center font-medium text-foreground">{toolAName}</th>
            <th className="p-4 text-center font-medium text-foreground">{toolBName}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border last:border-none">
              <td className="p-4 text-body">{row.feature}</td>
              <td className="p-4 text-center">
                <Cell value={row.toolA} />
              </td>
              <td className="p-4 text-center">
                <Cell value={row.toolB} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
