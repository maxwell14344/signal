import { Sparkles } from "lucide-react";

export function TldrBlock({ tldr }: { tldr: string[] }) {
  return (
    <div
      className="rounded-lg border border-accent/25 bg-accent/[0.06] p-6"
      data-ai-summary="true"
    >
      <div className="eyebrow mb-3 flex items-center gap-2 text-accent">
        <Sparkles className="h-3.5 w-3.5" />
        TL;DR
      </div>
      <ul className="space-y-2 text-[15px] leading-relaxed text-body">
        {tldr.map((point, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
