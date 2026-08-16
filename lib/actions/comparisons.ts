"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { comparisons } from "@/lib/db/schema";

function parseJsonField(formData: FormData, key: string, fallback: unknown) {
  const raw = String(formData.get(key) ?? "");
  if (!raw.trim()) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(`Invalid JSON in "${key}" field.`);
  }
}

export async function updateComparisonAction(
  comparisonId: number,
  slug: string,
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  try {
    const values = {
      tldr: parseJsonField(formData, "tldr", []),
      featureMatrix: parseJsonField(formData, "featureMatrix", []),
      verdict: String(formData.get("verdict") ?? "") || null,
      updatedAt: new Date(),
    };

    const current = await db.select().from(comparisons).where(eq(comparisons.id, comparisonId)).limit(1);
    const nextVersion = (current[0]?.version ?? 0) + 1;

    await db
      .update(comparisons)
      .set({ ...values, version: nextVersion })
      .where(eq(comparisons.id, comparisonId));

    revalidatePath(`/compare/${slug}`);
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }
}
