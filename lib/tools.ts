import fs from "fs";
import path from "path";
import type { Category, Tool } from "./schema";

const TOOLS_DIR = path.join(process.cwd(), "content", "tools");
const CATEGORIES_FILE = path.join(process.cwd(), "content", "categories.json");

export function getAllTools(): Tool[] {
  if (!fs.existsSync(TOOLS_DIR)) return [];

  const files = fs.readdirSync(TOOLS_DIR).filter((f) => f.endsWith(".json"));
  const tools = files.map((file) => {
    const raw = fs.readFileSync(path.join(TOOLS_DIR, file), "utf-8");
    return JSON.parse(raw) as Tool;
  });

  tools.sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));
  return tools;
}

export function getToolBySlug(slug: string): Tool | undefined {
  return getAllTools().find((t) => t.slug === slug);
}

export function getToolsByCategory(categorySlug: string): Tool[] {
  return getAllTools().filter((t) => t.category === categorySlug);
}

export function getTrendingTools(): Tool[] {
  return getAllTools().filter((t) => t.trending);
}

export function getRelatedTools(tool: Tool, limit = 3): Tool[] {
  return getAllTools()
    .filter((t) => t.slug !== tool.slug && t.category === tool.category)
    .slice(0, limit);
}

export function getAllCategories(): Category[] {
  if (!fs.existsSync(CATEGORIES_FILE)) return [];
  const raw = fs.readFileSync(CATEGORIES_FILE, "utf-8");
  return JSON.parse(raw) as Category[];
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getAllCategories().find((c) => c.slug === slug);
}

export function getCategoryToolCount(slug: string): number {
  return getToolsByCategory(slug).length;
}
