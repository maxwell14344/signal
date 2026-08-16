"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { put } from "@vercel/blob";
import { db } from "@/lib/db/client";
import { authors } from "@/lib/db/schema";

async function maybeUploadAvatar(formData: FormData, slug: string): Promise<string | null> {
  const file = formData.get("avatar");
  if (!(file instanceof File) || file.size === 0) return null;
  const ext = file.name.split(".").pop() || "jpg";
  const blob = await put(`authors/${slug}-${Date.now()}.${ext}`, file, {
    access: "public",
    addRandomSuffix: false,
  });
  return blob.url;
}

export async function createAuthorAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const slug = String(formData.get("slug") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();

  if (!slug || !name || !bio) {
    return { error: "Slug, name, and bio are required." };
  }

  const existing = await db.select().from(authors).where(eq(authors.slug, slug)).limit(1);
  if (existing[0]) return { error: `An author with slug "${slug}" already exists.` };

  let avatarUrl: string | null = null;
  try {
    avatarUrl = await maybeUploadAvatar(formData, slug);
  } catch (err) {
    return { error: err instanceof Error ? `Avatar upload failed: ${err.message}` : "Avatar upload failed." };
  }

  const sameAsRaw = String(formData.get("sameAs") ?? "");
  const sameAs = sameAsRaw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const [row] = await db
    .insert(authors)
    .values({
      slug,
      name,
      bio,
      credentials: String(formData.get("credentials") ?? "") || null,
      avatarUrl,
      sameAs,
    })
    .returning({ id: authors.id });

  revalidatePath("/");
  redirect(`/admin/authors/${row.id}/edit`);
}

export async function updateAuthorAction(
  authorId: number,
  slug: string,
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  try {
    const sameAsRaw = String(formData.get("sameAs") ?? "");
    const sameAs = sameAsRaw
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const newAvatarUrl = await maybeUploadAvatar(formData, slug);

    const values: Record<string, unknown> = {
      name: String(formData.get("name") ?? ""),
      bio: String(formData.get("bio") ?? ""),
      credentials: String(formData.get("credentials") ?? "") || null,
      sameAs,
    };
    if (newAvatarUrl) values.avatarUrl = newAvatarUrl;

    await db.update(authors).set(values).where(eq(authors.id, authorId));

    revalidatePath(`/authors/${slug}`);
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }
}
