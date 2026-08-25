import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTABanner() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="flex flex-col items-start gap-6 rounded-2xl bg-foreground px-8 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-12">
        <div>
          <h2 className="text-2xl text-background sm:text-3xl">
            Tell NorthStark what you need.
          </h2>
          <p className="mt-2 max-w-xl text-sm text-background/70">
            Coming next: a guided stack finder that turns your team size,
            channels, budget and support goals into a practical shortlist.
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:opacity-90"
        >
          Build my shortlist
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
