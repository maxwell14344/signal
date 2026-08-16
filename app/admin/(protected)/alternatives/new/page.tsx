import Link from "next/link";
import { getAllTools } from "@/lib/db/queries";
import { NewAlternativePageForm } from "@/components/admin/NewAlternativePageForm";

export default async function NewAlternativePagePage() {
  const tools = await getAllTools();

  return (
    <div>
      <Link href="/admin/alternatives" className="text-xs text-muted hover:text-foreground">
        ← Alternatives pages
      </Link>
      <h1 className="mt-1 mb-6 text-xl">New alternatives page</h1>
      <NewAlternativePageForm tools={tools.map((t) => ({ id: t.id, name: t.name }))} />
    </div>
  );
}
