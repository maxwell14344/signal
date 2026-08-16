import { notFound } from "next/navigation";
import Link from "next/link";
import { getAuthorById } from "@/lib/db/queries";
import { AuthorEditForm } from "@/components/admin/AuthorEditForm";

export default async function EditAuthorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const author = await getAuthorById(Number(id));
  if (!author) notFound();

  return (
    <div>
      <Link href="/admin/authors" className="text-xs text-muted hover:text-foreground">
        ← Authors
      </Link>
      <h1 className="mt-1 mb-6 text-xl">{author.name}</h1>
      <AuthorEditForm author={author} />
    </div>
  );
}
