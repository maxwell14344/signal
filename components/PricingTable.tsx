import type { PricingPlan } from "@/lib/db/schema";

export function PricingTable({
  model,
  plans,
}: {
  model?: string | null;
  plans: PricingPlan[];
}) {
  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-lg">Pricing</h2>
        {model && <span className="eyebrow">{model}</span>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="rounded-lg border border-border bg-surface p-5 card-shadow"
          >
            <p className="eyebrow">{plan.name}</p>
            <p className="mt-2 text-2xl font-heading text-foreground">
              {plan.price}
            </p>
            <p className="text-xs text-muted">{plan.billing}</p>
            {plan.notes && (
              <p className="mt-3 text-sm text-body">{plan.notes}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
