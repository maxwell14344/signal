"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { useCasePages, useCaseToolEntries, tools } from "@/lib/db/schema";

interface EntryInput {
  toolSlug: string;
  blurb: string;
}

function parseEntries(formData: FormData): EntryInput[] {
  const raw = String(formData.get("entries") ?? "[]");
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error();
    return parsed;
  } catch {
    throw new Error('Entries must be valid JSON, e.g. [{"toolSlug":"crisp","blurb":"..."}]');
  }
}

async function syncEntries(pageId: number, entries: EntryInput[]) {
  await db.delete(useCaseToolEntries).where(eq(useCaseToolEntries.pageId, pageId));
  for (let i = 0; i < entries.length; i++) {
    const [t] = await db.select().from(tools).where(eq(tools.slug, entries[i].toolSlug)).limit(1);
    if (!t) throw new Error(`Tool not found: ${entries[i].toolSlug}`);
    await db.insert(useCaseToolEntries).values({
      pageId,
      toolId: t.id,
      blurb: entries[i].blurb,
      sortOrder: i,
    });
  }
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createUseCasePageAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();

  if (!title) return { error: "Title is required." };

  const slug = slugInput ? slugify(slugInput) : slugify(title.replace(/^Best AI Support Tools for /i, ""));
  if (!slug) return { error: "Could not derive a slug — provide one explicitly." };

  const existing = await db.select().from(useCasePages).where(eq(useCasePages.slug, slug)).limit(1);
  if (existing[0]) return { error: `A use-case page with slug "${slug}" already exists.` };

  const [row] = await db
    .insert(useCasePages)
    .values({ slug, title, intro: "" })
    .returning({ id: useCasePages.id });

  revalidatePath("/");
  redirect(`/admin/use-cases/${row.id}/edit`);
}

export async function updateUseCasePageAction(
  pageId: number,
  slug: string,
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  try {
    const title = String(formData.get("title") ?? "");
    const intro = String(formData.get("intro") ?? "") || null;
    const entries = parseEntries(formData);

    const current = await db.select().from(useCasePages).where(eq(useCasePages.id, pageId)).limit(1);
    const nextVersion = (current[0]?.version ?? 0) + 1;

    await db
      .update(useCasePages)
      .set({ title, intro, version: nextVersion, updatedAt: new Date() })
      .where(eq(useCasePages.id, pageId));

    await syncEntries(pageId, entries);

    revalidatePath(`/best/${slug}`);
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }
}
