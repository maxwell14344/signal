"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { tools } from "@/lib/db/schema";

function parseJsonField(formData: FormData, key: string, fallback: unknown) {
  const raw = String(formData.get(key) ?? "");
  if (!raw.trim()) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(`Invalid JSON in "${key}" field.`);
  }
}

export async function updateToolAction(
  toolId: number,
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  try {
    const slug = String(formData.get("slug") ?? "");

    const values = {
      slug,
      name: String(formData.get("name") ?? ""),
      logoUrl: String(formData.get("logoUrl") ?? "") || null,
      website: String(formData.get("website") ?? ""),
      tagline: String(formData.get("tagline") ?? ""),
      tldr: parseJsonField(formData, "tldr", []),
      channels: parseJsonField(formData, "channels", []),
      keyFeatures: parseJsonField(formData, "keyFeatures", []),
      companyInfo: parseJsonField(formData, "companyInfo", {}),
      faq: parseJsonField(formData, "faq", []),
      scorecard: parseJsonField(formData, "scorecard", []),
      pricingModel: String(formData.get("pricingModel") ?? "") || null,
      pricingStartingPrice: String(formData.get("pricingStartingPrice") ?? "") || null,
      pricingPlans: parseJsonField(formData, "pricingPlans", []),
      pros: parseJsonField(formData, "pros", []),
      cons: parseJsonField(formData, "cons", []),
      sentimentQuotes: parseJsonField(formData, "sentimentQuotes", []),
      bestFor: parseJsonField(formData, "bestFor", []),
      verdict: String(formData.get("verdict") ?? "") || null,
      rating: String(formData.get("rating") ?? "") || null,
      trending: formData.get("trending") === "on",
      updatedAt: new Date(),
    };

    const current = await db.select().from(tools).where(eq(tools.id, toolId)).limit(1);
    const nextVersion = (current[0]?.version ?? 0) + 1;

    await db
      .update(tools)
      .set({ ...values, version: nextVersion })
      .where(eq(tools.id, toolId));

    revalidatePath(`/tools/${slug}`);
    revalidatePath("/");
    revalidatePath("/categories");
    revalidatePath("/sitemap.xml");

    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }
}

export async function markToolVerifiedAction(toolId: number, slug: string) {
  await db.update(tools).set({ lastVerifiedAt: new Date() }).where(eq(tools.id, toolId));
  revalidatePath(`/tools/${slug}`);
}
