export function PriceBadge({ price }: { price: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs font-medium text-foreground">
      {price}
    </span>
  );
}
