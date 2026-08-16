import { eq, and, desc } from "drizzle-orm";
import { db } from "./client";
import {
  tools,
  categories,
  toolCategories,
  authors,
  comparisons,
  alternativePages,
  alternativeEntries,
  useCasePages,
  useCaseToolEntries,
} from "./schema";

export type ToolRow = typeof tools.$inferSelect;
export type CategoryRow = typeof categories.$inferSelect;
export type AuthorRow = typeof authors.$inferSelect;

async function attachCategories(toolRows: ToolRow[]) {
  if (toolRows.length === 0) return [];
  const links = await db.select().from(toolCategories);
  const allCategories = await db.select().from(categories);
  const categoryById = new Map(allCategories.map((c) => [c.id, c]));

  return toolRows.map((t) => {
    const toolLinks = links.filter((l) => l.toolId === t.id);
    const primary = toolLinks.find((l) => l.isPrimary);
    const secondary = toolLinks.filter((l) => !l.isPrimary);
    return {
      ...t,
      primaryCategory: primary ? categoryById.get(primary.categoryId) : undefined,
      secondaryCategories: secondary.map((l) => categoryById.get(l.categoryId)).filter(Boolean),
    };
  });
}

export async function getAllTools() {
  const rows = await db.select().from(tools).where(eq(tools.status, "published")).orderBy(desc(tools.dateAdded));
  return attachCategories(rows);
}

export async function getToolById(id: number) {
  const rows = await db.select().from(tools).where(eq(tools.id, id)).limit(1);
  return rows[0];
}

export async function getToolBySlug(slug: string) {
  const rows = await db.select().from(tools).where(eq(tools.slug, slug)).limit(1);
  if (!rows[0]) return undefined;
  const [withCategories] = await attachCategories(rows);
  const author = rows[0].authorId
    ? (await db.select().from(authors).where(eq(authors.id, rows[0].authorId)).limit(1))[0]
    : undefined;
  return { ...withCategories, author };
}

export async function getTrendingTools() {
  const all = await getAllTools();
  return all.filter((t) => t.trending);
}

export async function getToolsByCategory(categorySlug: string) {
  const cat = await getCategoryBySlug(categorySlug);
  if (!cat) return [];
  const all = await getAllTools();
  return all.filter(
    (t) =>
      t.primaryCategory?.slug === categorySlug ||
      t.secondaryCategories.some((c) => c?.slug === categorySlug)
  );
}

export async function getRelatedTools(tool: Awaited<ReturnType<typeof getToolBySlug>>, limit = 3) {
  if (!tool?.primaryCategory) return [];
  const all = await getToolsByCategory(tool.primaryCategory.slug);
  return all.filter((t) => t.slug !== tool.slug).slice(0, limit);
}

export async function getAllCategories() {
  return db.select().from(categories).orderBy(categories.sortOrder);
}

export async function getCategoryById(id: number) {
  const rows = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return rows[0];
}

export async function getCategoryBySlug(slug: string) {
  const rows = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return rows[0];
}

export async function getCategoryToolCount(slug: string) {
  const t = await getToolsByCategory(slug);
  return t.length;
}

export async function getAuthorBySlug(slug: string) {
  const rows = await db.select().from(authors).where(eq(authors.slug, slug)).limit(1);
  return rows[0];
}

// Comparisons
export async function getAllComparisons() {
  return db.select().from(comparisons).where(eq(comparisons.status, "published"));
}

export async function getComparisonById(id: number) {
  const rows = await db.select().from(comparisons).where(eq(comparisons.id, id)).limit(1);
  if (!rows[0]) return undefined;
  const row = rows[0];
  const [toolA] = await db.select().from(tools).where(eq(tools.id, row.toolAId)).limit(1);
  const [toolB] = await db.select().from(tools).where(eq(tools.id, row.toolBId)).limit(1);
  return { ...row, toolA, toolB };
}

export async function getComparisonBySlug(slug: string) {
  const rows = await db.select().from(comparisons).where(eq(comparisons.slug, slug)).limit(1);
  if (!rows[0]) return undefined;
  const row = rows[0];
  const [toolA] = await db.select().from(tools).where(eq(tools.id, row.toolAId)).limit(1);
  const [toolB] = await db.select().from(tools).where(eq(tools.id, row.toolBId)).limit(1);
  const author = row.authorId
    ? (await db.select().from(authors).where(eq(authors.id, row.authorId)).limit(1))[0]
    : undefined;
  return { ...row, toolA, toolB, author };
}

export async function findComparisonByToolPair(toolASlug: string, toolBSlug: string) {
  const [a] = await db.select().from(tools).where(eq(tools.slug, toolASlug)).limit(1);
  const [b] = await db.select().from(tools).where(eq(tools.slug, toolBSlug)).limit(1);
  if (!a || !b) return undefined;
  const rows = await db
    .select()
    .from(comparisons)
    .where(
      and(eq(comparisons.toolAId, a.id), eq(comparisons.toolBId, b.id))
    );
  if (rows[0]) return rows[0];
  const reversed = await db
    .select()
    .from(comparisons)
    .where(and(eq(comparisons.toolAId, b.id), eq(comparisons.toolBId, a.id)));
  return reversed[0];
}

// Alternatives
export async function getAllAlternativePages() {
  return db.select().from(alternativePages).where(eq(alternativePages.status, "published"));
}

export async function getAlternativePageBySlug(slug: string) {
  const rows = await db.select().from(alternativePages).where(eq(alternativePages.slug, slug)).limit(1);
  if (!rows[0]) return undefined;
  const page = rows[0];
  const [anchorTool] = await db.select().from(tools).where(eq(tools.id, page.anchorToolId)).limit(1);
  const entries = await db
    .select()
    .from(alternativeEntries)
    .where(eq(alternativeEntries.pageId, page.id))
    .orderBy(alternativeEntries.sortOrder);
  const entryTools = await Promise.all(
    entries.map(async (e) => {
      const [t] = await db.select().from(tools).where(eq(tools.id, e.toolId)).limit(1);
      return { ...e, tool: t };
    })
  );
  const author = page.authorId
    ? (await db.select().from(authors).where(eq(authors.id, page.authorId)).limit(1))[0]
    : undefined;
  return { ...page, anchorTool, entries: entryTools, author };
}

// Use-case pages
export async function getAllUseCasePages() {
  return db.select().from(useCasePages).where(eq(useCasePages.status, "published"));
}

export async function getUseCasePageBySlug(slug: string) {
  const rows = await db.select().from(useCasePages).where(eq(useCasePages.slug, slug)).limit(1);
  if (!rows[0]) return undefined;
  const page = rows[0];
  const entries = await db
    .select()
    .from(useCaseToolEntries)
    .where(eq(useCaseToolEntries.pageId, page.id))
    .orderBy(useCaseToolEntries.sortOrder);
  const entryTools = await Promise.all(
    entries.map(async (e) => {
      const [t] = await db.select().from(tools).where(eq(tools.id, e.toolId)).limit(1);
      return { ...e, tool: t };
    })
  );
  const author = page.authorId
    ? (await db.select().from(authors).where(eq(authors.id, page.authorId)).limit(1))[0]
    : undefined;
  return { ...page, entries: entryTools, author };
}
