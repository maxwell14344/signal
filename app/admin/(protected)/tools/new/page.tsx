import Link from "next/link";
import { getAllCategories } from "@/lib/db/queries";
import { NewToolForm } from "@/components/admin/NewToolForm";

export default async function NewToolPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <Link href="/admin/tools" className="text-xs text-muted hover:text-foreground">
        ← Tools
      </Link>
      <h1 className="mt-1 mb-6 text-xl">New tool</h1>
      <NewToolForm categories={categories} />
    </div>
  );
}
