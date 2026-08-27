import type { Metadata } from "next";
import { CategoryGrid } from "@/components/CategoryGrid";

export const metadata: Metadata = {
  title: "AI Customer Support Categories",
  description:
    "Browse AI customer support tools by category — chatbots, AI support agents, helpdesk automation, WhatsApp AI, and more.",
  alternates: { canonical: "/categories" },
  openGraph: { title: "AI Customer Support Categories", type: "website", url: "/categories" },
};

export default function CategoriesIndexPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-4xl px-6 pt-16 text-center">
        <p className="eyebrow text-accent">Categories</p>
        <h1 className="mt-2 text-3xl tracking-tight sm:text-4xl">
          Every corner of the AI support stack
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-body">
          From website chatbots to full AI support agents — find the right
          category, then the right tool inside it.
        </p>
      </div>
      <CategoryGrid showHeading={false} />
    </main>
  );
}
