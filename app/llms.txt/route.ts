import { getAllCategories, getAllTools } from "@/lib/db/queries";
import { SITE_URL } from "@/lib/jsonld";

export const dynamic = "force-dynamic";

export async function GET() {
  const [tools, categories] = await Promise.all([getAllTools(), getAllCategories()]);

  const lines: string[] = [
    "# Signal",
    "",
    "> Human-verified reviews of AI customer support tools — chatbots, AI support agents, WhatsApp AI, helpdesk automation, and CX platforms. Written and scored by Maxwell Timothy.",
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
    lines.push(`Category: ${tool.primaryCategory?.slug ?? "uncategorized"}`);
    if (tool.pricingStartingPrice) lines.push(`Starting price: ${tool.pricingStartingPrice}`);
    if (tool.rating) lines.push(`Rating: ${tool.rating}/5`);
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
