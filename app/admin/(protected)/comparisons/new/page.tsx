import Link from "next/link";
import { getAllTools } from "@/lib/db/queries";
import { NewComparisonForm } from "@/components/admin/NewComparisonForm";

export default async function NewComparisonPage() {
  const tools = await getAllTools();

  return (
    <div>
      <Link href="/admin/comparisons" className="text-xs text-muted hover:text-foreground">
        ← Comparisons
      </Link>
      <h1 className="mt-1 mb-6 text-xl">New comparison</h1>
      <NewComparisonForm tools={tools.map((t) => ({ id: t.id, name: t.name }))} />
    </div>
  );
}
