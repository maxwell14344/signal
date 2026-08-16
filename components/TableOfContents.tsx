export interface TocItem {
  id: string;
  label: string;
}

export function TableOfContents({ items }: { items: TocItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="sticky top-24 hidden w-56 shrink-0 lg:block">
      <p className="eyebrow mb-3">Table of contents</p>
      <ul className="space-y-2 border-l border-border pl-4 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-muted transition hover:text-accent"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
