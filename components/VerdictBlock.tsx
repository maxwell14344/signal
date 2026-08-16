export function VerdictBlock({ verdict }: { verdict: string | null }) {
  if (!verdict) return null;

  return (
    <div>
      <h2 className="mb-4 text-lg">Our verdict</h2>
      <div className="rounded-lg border border-border bg-surface-2 p-6">
        <p className="text-[15px] leading-relaxed text-body">{verdict}</p>
      </div>
    </div>
  );
}
