import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoryById } from "@/lib/db/queries";
import { CategoryEditForm } from "@/components/admin/CategoryEditForm";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getCategoryById(Number(id));
  if (!category) notFound();

  return (
    <div>
      <Link href="/admin/categories" className="text-xs text-muted hover:text-foreground">
        ← Categories
      </Link>
      <h1 className="mt-1 mb-6 text-xl">{category.name}</h1>
      <CategoryEditForm category={category} />
    </div>
  );
}
