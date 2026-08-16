import Link from "next/link";
import { NewAuthorForm } from "@/components/admin/NewAuthorForm";

export default function NewAuthorPage() {
  return (
    <div>
      <Link href="/admin/authors" className="text-xs text-muted hover:text-foreground">
        ← Authors
      </Link>
      <h1 className="mt-1 mb-6 text-xl">New author</h1>
      <NewAuthorForm />
    </div>
  );
}
