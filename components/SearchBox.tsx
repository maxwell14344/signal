"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";

interface SearchItem {
  slug: string;
  name: string;
  tagline: string;
  category: string;
}

export function SearchBox({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return items
      .filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.tagline.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [query, items]);

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-sm focus-within:border-accent/50">
        <Search className="h-4 w-4 shrink-0 text-muted" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search tools..."
          className="w-full bg-transparent text-foreground placeholder:text-muted focus:outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="text-muted hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-surface shadow-xl">
          {results.map((item) => (
            <Link
              key={item.slug}
              href={`/tools/${item.slug}`}
              className="block border-b border-border px-4 py-2.5 last:border-none hover:bg-surface-2"
            >
              <p className="text-sm font-medium text-foreground">
                {item.name}
              </p>
              <p className="truncate text-xs text-muted">{item.tagline}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
