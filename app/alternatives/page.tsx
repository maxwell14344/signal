import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getAllAlternativePages } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "All Alternatives",
  description: "Every alternatives guide on NorthStark.",
};

export default async function AlternativesIndexPage() {
  const pages = await getAllAlternativePages();

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="mb-3 flex items-center gap-2 text-xs text-muted">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground">Alternatives</span>
        </div>

        <p className="eyebrow text-accent">Buying guides</p>
        <h1 className="mt-1 text-2xl tracking-tight sm:text-3xl">All alternatives guides</h1>

        <div className="mt-8 space-y-3">
          {pages.map((p) => (
            <Link
              key={p.id}
              href={`/alternatives/${p.slug}`}
              className="group flex items-center justify-between rounded-lg border border-border bg-surface px-5 py-4 text-sm text-body card-shadow transition hover:border-accent/40"
            >
              {p.title}
              <ArrowRight className="h-4 w-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-accent" />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
