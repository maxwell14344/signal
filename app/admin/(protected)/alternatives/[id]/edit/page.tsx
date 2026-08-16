import { notFound } from "next/navigation";
import Link from "next/link";
import { getAlternativePageById } from "@/lib/db/queries";
import { AlternativePageEditForm } from "@/components/admin/AlternativePageEditForm";

export default async function EditAlternativePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = await getAlternativePageById(Number(id));
  if (!page) notFound();

  return (
    <div>
      <Link href="/admin/alternatives" className="text-xs text-muted hover:text-foreground">
        ← Alternatives pages
      </Link>
      <h1 className="mt-1 mb-6 text-xl">{page.title}</h1>
      <AlternativePageEditForm page={page} />
    </div>
  );
}
