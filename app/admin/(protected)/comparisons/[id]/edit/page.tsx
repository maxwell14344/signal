import { notFound } from "next/navigation";
import Link from "next/link";
import { getComparisonById } from "@/lib/db/queries";
import { ComparisonEditForm } from "@/components/admin/ComparisonEditForm";

export default async function EditComparisonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const comparison = await getComparisonById(Number(id));
  if (!comparison) notFound();

  return (
    <div>
      <Link href="/admin/comparisons" className="text-xs text-muted hover:text-foreground">
        ← Comparisons
      </Link>
      <h1 className="mt-1 mb-6 text-xl">
        {comparison.toolA?.name} vs {comparison.toolB?.name}
      </h1>
      <ComparisonEditForm comparison={comparison} />
    </div>
  );
}
