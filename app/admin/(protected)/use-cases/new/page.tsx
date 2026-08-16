import Link from "next/link";
import { NewUseCasePageForm } from "@/components/admin/NewUseCasePageForm";

export default function NewUseCasePagePage() {
  return (
    <div>
      <Link href="/admin/use-cases" className="text-xs text-muted hover:text-foreground">
        ← Use-case pages
      </Link>
      <h1 className="mt-1 mb-6 text-xl">New use-case page</h1>
      <NewUseCasePageForm />
    </div>
  );
}
