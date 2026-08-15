import type { Pricing } from "@/lib/schema";

export function PricingTable({ pricing }: { pricing: Pricing }) {
  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">Pricing</h2>
        <span className="text-xs text-muted">{pricing.model}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pricing.plans.map((plan) => (
          <div
            key={plan.name}
            className="rounded-xl border border-border bg-surface p-5"
          >
            <p className="text-sm font-medium text-muted">{plan.name}</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {plan.price}
            </p>
            <p className="text-xs text-muted">{plan.billing}</p>
            {plan.notes && (
              <p className="mt-3 text-sm text-muted">{plan.notes}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
