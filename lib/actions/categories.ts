"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { categories } from "@/lib/db/schema";

export async function createCategoryAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const slug = String(formData.get("slug") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!slug || !name || !description) {
    return { error: "Slug, name, and description are required." };
  }

  const existing = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  if (existing[0]) {
    return { error: `A category with slug "${slug}" already exists.` };
  }

  const [row] = await db
    .insert(categories)
    .values({
      slug,
      name,
      description,
      icon: String(formData.get("icon") ?? "") || null,
      sortOrder: Number(formData.get("sortOrder") ?? 0),
    })
    .returning({ id: categories.id });

  revalidatePath("/categories");
  revalidatePath("/");
  redirect(`/admin/categories/${row.id}/edit`);
}

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
