"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";

interface ToolOption {
  id: number;
  name: string;
}

export function ToolPicker({
  label,
  fieldName,
  tools,
  initialSelectedId,
}: {
  label: string;
  fieldName: string;
  tools: ToolOption[];
  initialSelectedId?: number | null;
}) {
  const [selectedId, setSelectedId] = useState<number | null>(initialSelectedId ?? null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const selected = tools.find((t) => t.id === selectedId);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return tools.filter((t) => t.name.toLowerCase().includes(q)).slice(0, 8);
  }, [query, tools]);

  return (
    <div>
      <label className="mb-1.5 block text-sm text-muted">{label}</label>
      {selectedId && <input type="hidden" name={fieldName} value={selectedId} />}

      {selected ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-2/15 px-3 py-1.5 text-sm font-medium text-accent-2">
          {selected.name}
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="hover:text-negative"
            aria-label={`Clear ${label}`}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </span>
      ) : (
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
            placeholder="Search tools…"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent/50 focus:outline-none"
          />
          {open && results.length > 0 && (
            <div
              onMouseDown={(e) => e.preventDefault()}
              className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-y-auto rounded-lg border border-border bg-surface shadow-lg"
            >
              {results.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(t.id);
                    setQuery("");
                    setOpen(false);
                  }}
                  className="block w-full px-3 py-2 text-left text-sm text-body hover:bg-surface-2"
                >
                  {t.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
