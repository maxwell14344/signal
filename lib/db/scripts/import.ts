import "./_env";
import fs from "fs";
import path from "path";
import { eq } from "drizzle-orm";
import { db } from "../client";
import {
  categories,
  tools,
  toolCategories,
  authors,
  comparisons,
  alternativePages,
  alternativeEntries,
  useCasePages,
  useCaseToolEntries,
} from "../schema";

const FORCE = process.argv.includes("--force") || process.argv.some((a) => a.startsWith("--force="));
const FORCE_SLUG = process.argv.find((a) => a.startsWith("--force="))?.split("=")[1];
const DRY_RUN = process.argv.includes("--dry-run");

function shouldForce(slug: string) {
  if (FORCE_SLUG) return FORCE_SLUG === slug;
  return FORCE;
}

async function importCategories() {
  const file = path.join(process.cwd(), "content", "categories.json");
  if (!fs.existsSync(file)) return;
  const items = JSON.parse(fs.readFileSync(file, "utf-8"));

  for (const cat of items) {
    if (DRY_RUN) {
      console.log(`[dry-run] would upsert category: ${cat.slug}`);
      continue;
    }
    await db
      .insert(categories)
      .values({
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        sortOrder: cat.sortOrder ?? 0,
      })
      .onConflictDoUpdate({
        target: categories.slug,
        set: {
          name: cat.name,
          description: cat.description,
          icon: cat.icon,
          sortOrder: cat.sortOrder ?? 0,
          updatedAt: new Date(),
        },
      });
    console.log("Upserted category:", cat.slug);
  }
}

async function importTools() {
  const dir = path.join(process.cwd(), "content", "tools");
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

  const allCategories = await db.select().from(categories);
  const categoryBySlug = new Map(allCategories.map((c) => [c.slug, c.id]));
  const allAuthors = await db.select().from(authors);
  const authorBySlug = new Map(allAuthors.map((a) => [a.slug, a.id]));

  for (const file of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8"));
    const jsonUpdated = new Date(raw.lastVerifiedAt ?? raw.dateAdded ?? 0);

    const existing = await db
      .select()
      .from(tools)
      .where(eq(tools.slug, raw.slug))
      .limit(1);

    if (existing[0] && !shouldForce(raw.slug)) {
      const dbUpdated = existing[0].updatedAt ? new Date(existing[0].updatedAt) : new Date(0);
      if (dbUpdated > jsonUpdated) {
        console.warn(
          `SKIP ${raw.slug}: DB row is newer (${dbUpdated.toISOString()}) than JSON (${jsonUpdated.toISOString()}). Use --force=${raw.slug} to override.`
        );
        continue;
      }
    }

    if (DRY_RUN) {
      console.log(`[dry-run] would upsert tool: ${raw.slug}`);
      continue;
    }

    const authorId = authorBySlug.get(raw.authorSlug) ?? null;

    const values = {
      slug: raw.slug,
      name: raw.name,
      logoUrl: raw.logoUrl || null,
      website: raw.website,
      tagline: raw.tagline,
      tldr: raw.tldr ?? [],
      channels: raw.channels ?? [],
      keyFeatures: raw.keyFeatures ?? [],
      companyInfo: raw.companyInfo ?? {},
      faq: raw.faq ?? [],
      scorecard: raw.scorecard ?? [],
      criteriaScores: raw.criteriaScores ?? [],
      pricingBreakdown: raw.pricingBreakdown ?? null,
      capabilities: raw.capabilities ?? [],
      pricingModel: raw.pricing?.model ?? null,
      pricingStartingPrice: raw.pricing?.startingPrice ?? null,
      pricingPlans: raw.pricing?.plans ?? [],
      pros: raw.pros ?? [],
      cons: raw.cons ?? [],
      sentimentQuotes: raw.sentiment ?? [],
      bestFor: raw.bestFor ?? [],
      verdict: raw.verdict ?? null,
      rating: raw.rating != null ? String(raw.rating) : null,
      trending: !!raw.trending,
      authorId,
      lastVerifiedAt: raw.lastVerifiedAt ? new Date(raw.lastVerifiedAt) : null,
      dateAdded: raw.dateAdded ? new Date(raw.dateAdded) : new Date(),
      updatedAt: new Date(),
    };

    const [row] = await db
      .insert(tools)
      .values(values)
      .onConflictDoUpdate({ target: tools.slug, set: values })
      .returning({ id: tools.id });

    const toolId = row.id;

    await db.delete(toolCategories).where(eq(toolCategories.toolId, toolId));
    const primarySlug = raw.categories?.primary;
    const secondarySlugs: string[] = raw.categories?.secondary ?? [];

    if (primarySlug && categoryBySlug.has(primarySlug)) {
      await db.insert(toolCategories).values({
        toolId,
        categoryId: categoryBySlug.get(primarySlug)!,
        isPrimary: true,
      });
    }
    for (const s of secondarySlugs) {
      if (categoryBySlug.has(s)) {
        await db.insert(toolCategories).values({
          toolId,
          categoryId: categoryBySlug.get(s)!,
          isPrimary: false,
        });
      }
    }

    console.log("Upserted tool:", raw.slug);
  }
}

async function importComparisons() {
  const dir = path.join(process.cwd(), "content", "comparisons");
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

  const allAuthors = await db.select().from(authors);
  const authorBySlug = new Map(allAuthors.map((a) => [a.slug, a.id]));

  for (const file of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8"));

    const [toolA] = await db.select().from(tools).where(eq(tools.slug, raw.toolASlug)).limit(1);
    const [toolB] = await db.select().from(tools).where(eq(tools.slug, raw.toolBSlug)).limit(1);
    if (!toolA || !toolB) {
      console.warn(`SKIP ${raw.slug}: tool(s) not found (${raw.toolASlug}, ${raw.toolBSlug})`);
      continue;
    }

    if (DRY_RUN) {
      console.log(`[dry-run] would upsert comparison: ${raw.slug}`);
      continue;
    }

    const values = {
      slug: raw.slug,
      toolAId: toolA.id,
      toolBId: toolB.id,
      tldr: raw.tldr ?? [],
      quickVerdict: raw.quickVerdict ?? null,
      featureMatrix: raw.featureMatrix ?? [],
      verdict: raw.verdict ?? null,
      authorId: authorBySlug.get(raw.authorSlug) ?? null,
      lastVerifiedAt: raw.lastVerifiedAt ? new Date(raw.lastVerifiedAt) : null,
      updatedAt: new Date(),
    };

    await db
      .insert(comparisons)
      .values(values)
      .onConflictDoUpdate({ target: comparisons.slug, set: values });

    console.log("Upserted comparison:", raw.slug);
  }
}

async function importAlternatives() {
  const dir = path.join(process.cwd(), "content", "alternatives");
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

  const allAuthors = await db.select().from(authors);
  const authorBySlug = new Map(allAuthors.map((a) => [a.slug, a.id]));

  for (const file of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8"));

    const [anchor] = await db.select().from(tools).where(eq(tools.slug, raw.anchorToolSlug)).limit(1);
    if (!anchor) {
      console.warn(`SKIP ${raw.slug}: anchor tool not found (${raw.anchorToolSlug})`);
      continue;
    }

    if (DRY_RUN) {
      console.log(`[dry-run] would upsert alternative page: ${raw.slug}`);
      continue;
    }

    const values = {
      slug: raw.slug,
      anchorToolId: anchor.id,
      title: raw.title,
      intro: raw.intro ?? null,
      authorId: authorBySlug.get(raw.authorSlug) ?? null,
      lastVerifiedAt: raw.lastVerifiedAt ? new Date(raw.lastVerifiedAt) : null,
      updatedAt: new Date(),
    };

    const [row] = await db
      .insert(alternativePages)
      .values(values)
      .onConflictDoUpdate({ target: alternativePages.slug, set: values })
      .returning({ id: alternativePages.id });

    await db.delete(alternativeEntries).where(eq(alternativeEntries.pageId, row.id));

    for (let i = 0; i < (raw.entries ?? []).length; i++) {
      const entry = raw.entries[i];
      const [t] = await db.select().from(tools).where(eq(tools.slug, entry.toolSlug)).limit(1);
      if (!t) {
        console.warn(`  entry skipped, tool not found: ${entry.toolSlug}`);
        continue;
      }
      await db.insert(alternativeEntries).values({
        pageId: row.id,
        toolId: t.id,
        blurb: entry.blurb,
        sortOrder: i,
      });
    }

    console.log("Upserted alternative page:", raw.slug);
  }
}

async function importUseCases() {
  const dir = path.join(process.cwd(), "content", "use-cases");
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

  const allAuthors = await db.select().from(authors);
  const authorBySlug = new Map(allAuthors.map((a) => [a.slug, a.id]));

  for (const file of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8"));

    if (DRY_RUN) {
      console.log(`[dry-run] would upsert use-case page: ${raw.slug}`);
      continue;
    }

    const values = {
      slug: raw.slug,
      title: raw.title,
      intro: raw.intro ?? null,
      authorId: authorBySlug.get(raw.authorSlug) ?? null,
      lastVerifiedAt: raw.lastVerifiedAt ? new Date(raw.lastVerifiedAt) : null,
      updatedAt: new Date(),
    };

    const [row] = await db
      .insert(useCasePages)
      .values(values)
      .onConflictDoUpdate({ target: useCasePages.slug, set: values })
      .returning({ id: useCasePages.id });

    await db.delete(useCaseToolEntries).where(eq(useCaseToolEntries.pageId, row.id));

    for (let i = 0; i < (raw.entries ?? []).length; i++) {
      const entry = raw.entries[i];
      const [t] = await db.select().from(tools).where(eq(tools.slug, entry.toolSlug)).limit(1);
      if (!t) {
        console.warn(`  entry skipped, tool not found: ${entry.toolSlug}`);
        continue;
      }
      await db.insert(useCaseToolEntries).values({
        pageId: row.id,
        toolId: t.id,
        blurb: entry.blurb,
        sortOrder: i,
      });
    }

    console.log("Upserted use-case page:", raw.slug);
  }
}

async function main() {
  await importCategories();
  await importTools();
  await importComparisons();
  await importAlternatives();
  await importUseCases();
}

main()
  .then(() => {
    console.log(DRY_RUN ? "Dry run complete." : "Import complete.");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
