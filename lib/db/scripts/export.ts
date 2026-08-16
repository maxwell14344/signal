import "./_env";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { db } from "../client";
import { tools, categories, toolCategories, authors } from "../schema";
import { eq } from "drizzle-orm";

function hasUncommittedContentChanges(): boolean {
  try {
    const out = execSync("git status --porcelain content/", { cwd: process.cwd() }).toString();
    return out.trim().length > 0;
  } catch {
    return false;
  }
}

async function exportTools() {
  const dir = path.join(process.cwd(), "content", "tools");
  fs.mkdirSync(dir, { recursive: true });

  const allTools = await db.select().from(tools);
  const allCategories = await db.select().from(categories);
  const categoryById = new Map(allCategories.map((c) => [c.id, c.slug]));
  const allAuthors = await db.select().from(authors);
  const authorById = new Map(allAuthors.map((a) => [a.id, a.slug]));
  const links = await db.select().from(toolCategories);

  for (const tool of allTools) {
    const toolLinks = links.filter((l) => l.toolId === tool.id);
    const primary = toolLinks.find((l) => l.isPrimary);
    const secondary = toolLinks.filter((l) => !l.isPrimary).map((l) => categoryById.get(l.categoryId));

    const json = {
      slug: tool.slug,
      name: tool.name,
      logoUrl: tool.logoUrl ?? "",
      website: tool.website,
      tagline: tool.tagline,
      tldr: tool.tldr,
      categories: {
        primary: primary ? categoryById.get(primary.categoryId) : undefined,
        secondary,
      },
      channels: tool.channels,
      keyFeatures: tool.keyFeatures,
      companyInfo: tool.companyInfo,
      faq: tool.faq,
      scorecard: tool.scorecard,
      pricing: {
        model: tool.pricingModel,
        startingPrice: tool.pricingStartingPrice,
        plans: tool.pricingPlans,
      },
      pros: tool.pros,
      cons: tool.cons,
      sentiment: tool.sentimentQuotes,
      bestFor: tool.bestFor,
      verdict: tool.verdict,
      rating: tool.rating ? Number(tool.rating) : null,
      trending: tool.trending,
      authorSlug: tool.authorId ? authorById.get(tool.authorId) : undefined,
      dateAdded: tool.dateAdded?.toISOString().slice(0, 10),
      lastVerifiedAt: tool.lastVerifiedAt?.toISOString().slice(0, 10),
    };

    fs.writeFileSync(path.join(dir, `${tool.slug}.json`), JSON.stringify(json, null, 2) + "\n");
  }
  console.log(`Exported ${allTools.length} tools.`);
}

async function exportCategories() {
  const allCategories = await db.select().from(categories).orderBy(categories.sortOrder);
  const json = allCategories.map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.description,
    icon: c.icon,
    sortOrder: c.sortOrder,
  }));
  fs.writeFileSync(
    path.join(process.cwd(), "content", "categories.json"),
    JSON.stringify(json, null, 2) + "\n"
  );
  console.log(`Exported ${allCategories.length} categories.`);
}

async function main() {
  if (hasUncommittedContentChanges()) {
    console.error(
      "Refusing to export: content/ has uncommitted changes. Commit or stash them first, or you'll lose those edits."
    );
    process.exit(1);
  }
  await exportCategories();
  await exportTools();
  console.log("Export complete. Review the diff and commit content/ when ready.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
