"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { categories } from "@/lib/db/schema";

export async function updateCategoryAction(
  categoryId: number,
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  try {
    const slug = String(formData.get("slug") ?? "");
    const values = {
      slug,
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      icon: String(formData.get("icon") ?? "") || null,
      sortOrder: Number(formData.get("sortOrder") ?? 0),
      updatedAt: new Date(),
    };

    await db.update(categories).set(values).where(eq(categories.id, categoryId));

    revalidatePath(`/categories/${slug}`);
    revalidatePath("/categories");
    revalidatePath("/");

    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }
}
