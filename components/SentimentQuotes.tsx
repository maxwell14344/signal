import { ExternalLink } from "lucide-react";
import type { SentimentQuote } from "@/lib/db/schema";

const TONE_STYLES: Record<string, string> = {
  positive: "border-l-positive",
  negative: "border-l-negative",
  mixed: "border-l-accent-2",
};

const TONE_LABEL: Record<string, string> = {
  positive: "Positive",
  negative: "Negative",
  mixed: "Mixed",
};

export function SentimentQuotes({ quotes }: { quotes: SentimentQuote[] }) {
  if (!quotes || quotes.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 text-lg">What people are saying</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {quotes.map((q, i) => (
          <a
            key={i}
            href={q.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`block rounded-lg border border-border ${TONE_STYLES[q.sentiment]} border-l-4 bg-surface p-5 card-shadow transition hover:bg-surface-2`}
          >
            <p className="text-sm italic leading-relaxed text-body">
              &ldquo;{q.quote}&rdquo;
            </p>
            <div className="mt-3 flex items-center justify-between text-xs text-muted">
              <span>
                {q.source} · {TONE_LABEL[q.sentiment]}
              </span>
              <ExternalLink className="h-3.5 w-3.5" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
