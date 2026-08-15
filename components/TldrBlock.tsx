import { Sparkles } from "lucide-react";

export function TldrBlock({ tldr }: { tldr: string[] }) {
  return (
    <div
      className="rounded-2xl border border-accent/30 bg-accent/[0.06] p-6"
      data-ai-summary="true"
    >
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-accent">
        <Sparkles className="h-4 w-4" />
        TL;DR
      </div>
      <ul className="space-y-2 text-sm leading-relaxed text-foreground">
        {tldr.map((point, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
