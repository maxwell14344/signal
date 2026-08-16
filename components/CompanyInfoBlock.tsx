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
    <div>
      <h2 className="mb-4 text-lg">Company</h2>
      <dl className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-surface p-5 card-shadow sm:grid-cols-4">
        {rows.map((r) => (
          <div key={r.label}>
            <dt className="eyebrow">{r.label}</dt>
            <dd className="mt-1 text-sm text-body">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
