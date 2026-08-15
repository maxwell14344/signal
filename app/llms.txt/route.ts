import { getAllCategories, getAllTools } from "@/lib/tools";

export const dynamic = "force-static";

const SITE_URL = "https://example.com";

export function GET() {
  const tools = getAllTools();
  const categories = getAllCategories();

  const lines: string[] = [
    "# Signal",
    "",
    "> Structured, sourced reviews of AI tools — pricing, pros/cons, and real sentiment from Reddit, X, and Hacker News. Updated daily.",
    "",
    "## Categories",
    "",
    ...categories.map(
      (cat) => `- [${cat.name}](${SITE_URL}/categories/${cat.slug}): ${cat.description}`
    ),
    "",
    "## Tools",
    "",
  ];

  for (const tool of tools) {
    lines.push(`### ${tool.name}`);
    lines.push(`URL: ${SITE_URL}/tools/${tool.slug}`);
    lines.push(`Category: ${tool.category}`);
    lines.push(`Starting price: ${tool.pricing.startingPrice}`);
    lines.push(`Rating: ${tool.rating}/5`);
    lines.push("TLDR:");
    for (const point of tool.tldr) {
      lines.push(`- ${point}`);
    }
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
