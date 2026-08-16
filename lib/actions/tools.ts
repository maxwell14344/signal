"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { tools, toolCategories } from "@/lib/db/schema";

export async function createToolAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const slug = String(formData.get("slug") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();
  const tagline = String(formData.get("tagline") ?? "").trim();

  if (!slug || !name || !website || !tagline) {
    return { error: "Slug, name, website, and tagline are required." };
  }

  const existing = await db.select().from(tools).where(eq(tools.slug, slug)).limit(1);
  if (existing[0]) {
    return { error: `A tool with slug "${slug}" already exists.` };
  }

  const [row] = await db
    .insert(tools)
    .values({
      slug,
      name,
      website,
      tagline,
      tldr: [],
      dateAdded: new Date(),
    })
    .returning({ id: tools.id });

  const primaryCategoryId = formData.get("primaryCategoryId");
  if (primaryCategoryId) {
    await db.insert(toolCategories).values({
      toolId: row.id,
      categoryId: Number(primaryCategoryId),
      isPrimary: true,
    });
  }

  revalidatePath("/");
  revalidatePath("/categories");
  redirect(`/admin/tools/${row.id}/edit`);
}

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

    const ratingRaw = String(formData.get("rating") ?? "");
    let rating: string | null = null;
    if (ratingRaw.trim()) {
      const num = Number(ratingRaw);
      if (Number.isNaN(num)) throw new Error("Rating must be a number.");
      if (num < 1 || num > 5) throw new Error("Rating must be between 1.0 and 5.0.");
      rating = num.toFixed(1);
    }

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
      rating,
      trending: formData.get("trending") === "on",
      updatedAt: new Date(),
    };

    const current = await db.select().from(tools).where(eq(tools.id, toolId)).limit(1);
    const nextVersion = (current[0]?.version ?? 0) + 1;

    await db
      .update(tools)
      .set({ ...values, version: nextVersion })
      .where(eq(tools.id, toolId));

    const primaryCategoryId = formData.get("primaryCategoryId");
    const secondaryCategoryIds = formData.getAll("secondaryCategoryIds").map(Number);

    await db.delete(toolCategories).where(eq(toolCategories.toolId, toolId));
    if (primaryCategoryId) {
      await db.insert(toolCategories).values({
        toolId,
        categoryId: Number(primaryCategoryId),
        isPrimary: true,
      });
    }
    for (const catId of secondaryCategoryIds) {
      if (catId && catId !== Number(primaryCategoryId)) {
        await db.insert(toolCategories).values({ toolId, categoryId: catId, isPrimary: false });
      }
    }

    revalidatePath(`/tools/${slug}`);
    revalidatePath("/categories");
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
