import type { CapabilityNote } from "@/lib/db/schema";

export function CapabilitiesList({ capabilities }: { capabilities: CapabilityNote[] }) {
  if (!capabilities || capabilities.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 text-lg">How it actually works</h2>
      <div className="space-y-4">
        {capabilities.map((cap) => (
          <div key={cap.area} className="rounded-lg border border-border bg-surface p-5 card-shadow">
            <h3 className="mb-1.5 font-medium text-foreground">{cap.area}</h3>
            <p className="text-[15px] leading-relaxed text-body">{cap.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
