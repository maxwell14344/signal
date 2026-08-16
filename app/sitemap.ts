import type { MetadataRoute } from "next";
import {
  getAllCategories,
  getAllTools,
  getAllComparisons,
  getAllAlternativePages,
  getAllUseCasePages,
} from "@/lib/db/queries";
import { SITE_URL } from "@/lib/jsonld";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tools, categories, comparisons, alternatives, useCases] = await Promise.all([
    getAllTools(),
    getAllCategories(),
    getAllComparisons(),
    getAllAlternativePages(),
    getAllUseCasePages(),
  ]);

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/methodology`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...categories.map((cat) => ({
      url: `${SITE_URL}/categories/${cat.slug}`,
      lastModified: cat.updatedAt ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...tools.map((tool) => ({
      url: `${SITE_URL}/tools/${tool.slug}`,
      lastModified: tool.updatedAt ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...comparisons.map((c) => ({
      url: `${SITE_URL}/compare/${c.slug}`,
      lastModified: c.updatedAt ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...alternatives.map((a) => ({
      url: `${SITE_URL}/alternatives/${a.slug}`,
      lastModified: a.updatedAt ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...useCases.map((u) => ({
      url: `${SITE_URL}/best/${u.slug}`,
      lastModified: u.updatedAt ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
