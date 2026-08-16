"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { alternativePages, alternativeEntries, tools } from "@/lib/db/schema";

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
  await db.delete(alternativeEntries).where(eq(alternativeEntries.pageId, pageId));
  for (let i = 0; i < entries.length; i++) {
    const [t] = await db.select().from(tools).where(eq(tools.slug, entries[i].toolSlug)).limit(1);
    if (!t) throw new Error(`Tool not found: ${entries[i].toolSlug}`);
    await db.insert(alternativeEntries).values({
      pageId,
      toolId: t.id,
      blurb: entries[i].blurb,
      sortOrder: i,
    });
  }
}

export async function createAlternativePageAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const anchorToolId = Number(formData.get("anchorToolId") ?? "");
  const title = String(formData.get("title") ?? "").trim();

  if (!anchorToolId || !title) {
    return { error: "Anchor tool and title are required." };
  }

  const [anchor] = await db.select().from(tools).where(eq(tools.id, anchorToolId)).limit(1);
  if (!anchor) return { error: "Anchor tool not found." };

  const slug = `${anchor.slug}-alternatives`;
  const existing = await db.select().from(alternativePages).where(eq(alternativePages.slug, slug)).limit(1);
  if (existing[0]) return { error: `An alternatives page for ${anchor.name} already exists.` };

  const [row] = await db
    .insert(alternativePages)
    .values({ slug, anchorToolId, title, intro: "" })
    .returning({ id: alternativePages.id });

  revalidatePath("/");
  redirect(`/admin/alternatives/${row.id}/edit`);
}

export async function updateAlternativePageAction(
  pageId: number,
  slug: string,
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  try {
    const title = String(formData.get("title") ?? "");
    const intro = String(formData.get("intro") ?? "") || null;
    const entries = parseEntries(formData);

    const current = await db.select().from(alternativePages).where(eq(alternativePages.id, pageId)).limit(1);
    const nextVersion = (current[0]?.version ?? 0) + 1;

    await db
      .update(alternativePages)
      .set({ title, intro, version: nextVersion, updatedAt: new Date() })
      .where(eq(alternativePages.id, pageId));

    await syncEntries(pageId, entries);

    revalidatePath(`/alternatives/${slug}`);
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }
}
