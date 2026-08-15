import { Star } from "lucide-react";

export function RatingStars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm text-foreground">
      <Star className="h-3.5 w-3.5 fill-accent text-accent" />
      <span className="font-medium">{rating.toFixed(1)}</span>
    </span>
  );
}
