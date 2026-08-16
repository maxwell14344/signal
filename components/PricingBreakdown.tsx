export function PricingBreakdown({ text }: { text: string | null }) {
  if (!text) return null;

  return (
    <div className="rounded-lg border-l-2 border-accent/40 bg-accent/[0.04] p-5">
      <p className="eyebrow mb-2 text-accent">What this actually means</p>
      <p className="text-[15px] leading-relaxed text-body">{text}</p>
    </div>
  );
}
