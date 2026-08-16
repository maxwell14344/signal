import Link from "next/link";
import { NewCategoryForm } from "@/components/admin/NewCategoryForm";

export default function NewCategoryPage() {
  return (
    <div>
      <Link href="/admin/categories" className="text-xs text-muted hover:text-foreground">
        ← Categories
      </Link>
      <h1 className="mt-1 mb-6 text-xl">New category</h1>
      <NewCategoryForm />
    </div>
  );
}
