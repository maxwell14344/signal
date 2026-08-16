import { Check } from "lucide-react";

export function KeyFeaturesList({ features }: { features: string[] }) {
  if (!features || features.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 text-lg">Key features</h2>
      <ul className="space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex gap-2.5 text-[15px] leading-relaxed text-body">
            <Check className="mt-1 h-4 w-4 shrink-0 text-accent" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
