interface ToolOption {
  slug: string;
  name: string;
}

function ToolSelect({
  name,
  label,
  tools,
  value,
  optional,
}: {
  name: string;
  label: string;
  tools: ToolOption[];
  value?: string;
  optional?: boolean;
}) {
  return (
    <div className="flex-1">
      <label htmlFor={name} className="mb-1.5 block text-xs text-muted">{label}</label>
      <select
        id={name}
        name={name}
        defaultValue={value ?? ""}
        className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground focus:border-accent/50 focus:outline-none"
      >
        <option value="">{optional ? "— none —" : "Select a tool"}</option>
        {tools.map((t) => (
          <option key={t.slug} value={t.slug}>{t.name}</option>
        ))}
      </select>
    </div>
  );
}

export function ToolPickerForm({
  tools,
  initial,
}: {
  tools: ToolOption[];
  initial: { a?: string; b?: string; c?: string };
}) {
  return (
    <form
      action="/compare/matrix"
      method="GET"
      className="flex flex-col gap-4 rounded-lg border border-border bg-surface-2/40 p-5 sm:flex-row sm:items-end"
    >
      <ToolSelect name="a" label="Tool A" tools={tools} value={initial.a} />
      <ToolSelect name="b" label="Tool B" tools={tools} value={initial.b} />
      <ToolSelect name="c" label="Tool C (optional)" tools={tools} value={initial.c} optional />
      <button
        type="submit"
        className="shrink-0 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition hover:opacity-90"
      >
        Compare
      </button>
    </form>
  );
}
