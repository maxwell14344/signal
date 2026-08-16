"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { comparisons, tools } from "@/lib/db/schema";

export async function createComparisonAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const toolAId = Number(formData.get("toolAId") ?? "");
  const toolBId = Number(formData.get("toolBId") ?? "");

  if (!toolAId || !toolBId) {
    return { error: "Both tools are required." };
  }
  if (toolAId === toolBId) {
    return { error: "Choose two different tools." };
  }

  const [toolA] = await db.select().from(tools).where(eq(tools.id, toolAId)).limit(1);
  const [toolB] = await db.select().from(tools).where(eq(tools.id, toolBId)).limit(1);
  if (!toolA || !toolB) {
    return { error: "Could not find the selected tools." };
  }

  const existing = await db
    .select()
    .from(comparisons)
    .where(
      and(eq(comparisons.toolAId, toolAId), eq(comparisons.toolBId, toolBId))
    );
  const existingReversed = await db
    .select()
    .from(comparisons)
    .where(and(eq(comparisons.toolAId, toolBId), eq(comparisons.toolBId, toolAId)));
  if (existing[0] || existingReversed[0]) {
    return { error: `A comparison between ${toolA.name} and ${toolB.name} already exists.` };
  }

  const slug = `${toolA.slug}-vs-${toolB.slug}`;

  const [row] = await db
    .insert(comparisons)
    .values({ slug, toolAId, toolBId, tldr: [], featureMatrix: [] })
    .returning({ id: comparisons.id });

  revalidatePath("/");
  redirect(`/admin/comparisons/${row.id}/edit`);
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
