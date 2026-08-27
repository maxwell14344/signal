export function QuickVerdict({ text }: { text: string | null }) {
  if (!text) return null;

  return (
    <blockquote className="mt-6 rounded-lg border-l-4 border-accent bg-surface-2/60 px-5 py-4">
      <p className="eyebrow mb-2 text-accent">Quick answer</p>
      <p className="text-[15px] leading-relaxed text-foreground">{text}</p>
    </blockquote>
  );
}
