"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";

interface CategoryOption {
  id: number;
  name: string;
}

export function CategoryPicker({
  label,
  fieldName,
  categories,
  initialSelectedIds,
  multiple,
}: {
  label: string;
  fieldName: string;
  categories: CategoryOption[];
  initialSelectedIds: number[];
  multiple: boolean;
}) {
  const [selectedIds, setSelectedIds] = useState<number[]>(initialSelectedIds);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const selected = categories.filter((c) => selectedIds.includes(c.id));

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return categories
      .filter((c) => !selectedIds.includes(c.id) && c.name.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, categories, selectedIds]);

  function select(id: number) {
    setSelectedIds(multiple ? [...selectedIds, id] : [id]);
    setQuery("");
    setOpen(false);
  }

  function remove(id: number) {
    setSelectedIds(selectedIds.filter((x) => x !== id));
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm text-muted">{label}</label>

      {selectedIds.map((id) => (
        <input key={id} type="hidden" name={fieldName} value={id} />
      ))}

      <div className="mb-2 flex flex-wrap gap-1.5">
        {selected.map((c) => (
          <span
            key={c.id}
            className="inline-flex items-center gap-1 rounded-full bg-accent-2/15 px-2.5 py-1 text-xs font-medium text-accent-2"
          >
            {c.name}
            <button
              type="button"
              onClick={() => remove(c.id)}
              className="hover:text-negative"
              aria-label={`Remove ${c.name}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        {!multiple && selected.length === 0 && (
          <span className="text-xs text-muted">No primary category set</span>
        )}
      </div>

      {(multiple || selected.length === 0) && (
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder="Search categories…"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
          />
          {open && results.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-y-auto rounded-lg border border-border bg-surface shadow-lg">
              {results.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => select(c.id)}
                  className="block w-full px-3 py-2 text-left text-sm text-body hover:bg-surface-2"
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
