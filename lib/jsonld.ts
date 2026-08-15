import type { Tool } from "./schema";

const SITE_URL = "https://example.com";

export function toolJsonLd(tool: Tool) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: tool.name,
    description: tool.tldr.join(" "),
    url: `${SITE_URL}/tools/${tool.slug}`,
    brand: {
      "@type": "Brand",
      name: tool.name,
    },
    ...(tool.rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: tool.rating,
            bestRating: 5,
            worstRating: 1,
            ratingCount: Math.max(tool.sentiment.length, 1),
          },
        }
      : {}),
    offers: tool.pricing.plans.map((plan) => ({
      "@type": "Offer",
      name: plan.name,
      price: plan.price,
      description: plan.notes ?? "",
    })),
  };
}
