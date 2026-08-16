import { notFound } from "next/navigation";
import Link from "next/link";
import { getToolById, getAllCategories, getToolCategoryAssignments } from "@/lib/db/queries";
import { ToolEditForm } from "@/components/admin/ToolEditForm";
import { markToolVerifiedAction } from "@/lib/actions/tools";

export default async function EditToolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tool = await getToolById(Number(id));
  if (!tool) notFound();

  const [categories, assignments] = await Promise.all([
    getAllCategories(),
    getToolCategoryAssignments(tool.id),
  ]);

  const markVerified = markToolVerifiedAction.bind(null, tool.id, tool.slug);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/admin/tools" className="text-xs text-muted hover:text-foreground">
            ← Tools
          </Link>
          <h1 className="mt-1 text-xl">{tool.name}</h1>
        </div>
        <form action={markVerified}>
          <button
            type="submit"
            className="rounded-full border border-border bg-surface px-4 py-2 text-xs font-medium text-body transition hover:bg-surface-2"
          >
            Mark verified today
          </button>
        </form>
      </div>
      <ToolEditForm
        tool={tool}
        categories={categories}
        primaryCategoryId={assignments.primaryId}
        secondaryCategoryIds={assignments.secondaryIds}
      />
    </div>
  );
}
