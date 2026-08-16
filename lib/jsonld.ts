const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

interface ToolForJsonLd {
  slug: string;
  name: string;
  tldr: string[];
  rating: number | string | null;
  sentimentQuotes: { quote: string }[];
  pricingPlans: { name: string; price: string; notes?: string }[];
}

export function toolJsonLd(tool: ToolForJsonLd) {
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
            ratingValue: Number(tool.rating),
            bestRating: 5,
            worstRating: 1,
            ratingCount: Math.max(tool.sentimentQuotes?.length ?? 0, 1),
          },
        }
      : {}),
    offers: (tool.pricingPlans ?? []).map((plan) => ({
      "@type": "Offer",
      name: plan.name,
      price: plan.price,
      description: plan.notes ?? "",
    })),
  };
}

export { SITE_URL };
