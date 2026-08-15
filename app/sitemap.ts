import type { MetadataRoute } from "next";
import { getAllCategories, getAllTools } from "@/lib/tools";

const SITE_URL = "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = getAllTools();
  const categories = getAllCategories();

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...categories.map((cat) => ({
      url: `${SITE_URL}/categories/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    ...tools.map((tool) => ({
      url: `${SITE_URL}/tools/${tool.slug}`,
      lastModified: new Date(tool.lastUpdated),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
