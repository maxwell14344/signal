import type { CompanyInfo } from "@/lib/db/schema";

export function CompanyInfoBlock({ info }: { info: CompanyInfo | null | undefined }) {
  if (!info) return null;
  const rows = [
    { label: "Founded", value: info.founded },
    { label: "Headquarters", value: info.hq },
    { label: "Funding", value: info.funding },
    { label: "Employees", value: info.employees },
  ].filter((r) => r.value);

  if (rows.length === 0) return null;

  return (
    <div className="border-t border-border pt-6">
      <p className="mb-3 text-xs text-muted">
        Company details — for context, not a scoring factor.
      </p>
      <dl className="flex flex-wrap gap-x-8 gap-y-2 text-xs text-muted">
        {rows.map((r) => (
          <div key={r.label} className="flex gap-1.5">
            <dt className="font-medium">{r.label}:</dt>
            <dd>{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
