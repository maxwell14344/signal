import { Star } from "lucide-react";

export function RatingStars({ rating }: { rating: number | string | null }) {
  const value = rating != null ? Number(rating) : 0;
  return (
    <span className="inline-flex items-center gap-1 text-sm text-foreground">
      <Star className="h-3.5 w-3.5 fill-accent text-accent" />
      <span className="font-medium">{value.toFixed(1)}</span>
    </span>
  );
}
