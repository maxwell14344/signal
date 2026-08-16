import type { FaqEntry } from "@/lib/db/schema";

export function faqJsonLd(faq: FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export function FaqSection({ faq }: { faq: FaqEntry[] }) {
  if (!faq || faq.length === 0) return null;

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faq)) }}
      />
      <h2 className="mb-4 text-lg">Frequently asked questions</h2>
      <div className="divide-y divide-border rounded-lg border border-border bg-surface card-shadow">
        {faq.map((item, i) => (
          <details key={i} className="group p-5">
            <summary className="cursor-pointer list-none text-[15px] font-medium text-foreground marker:content-none">
              {item.question}
            </summary>
            <p className="mt-2.5 text-sm leading-relaxed text-body">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
