import { notFound } from "next/navigation";
import Link from "next/link";
import { getUseCasePageById } from "@/lib/db/queries";
import { UseCasePageEditForm } from "@/components/admin/UseCasePageEditForm";

export default async function EditUseCasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = await getUseCasePageById(Number(id));
  if (!page) notFound();

  return (
    <div>
      <Link href="/admin/use-cases" className="text-xs text-muted hover:text-foreground">
        ← Use-case pages
      </Link>
      <h1 className="mt-1 mb-6 text-xl">{page.title}</h1>
      <UseCasePageEditForm page={page} />
    </div>
  );
}
