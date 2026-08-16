import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/tools", label: "Tools" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/comparisons", label: "Comparisons" },
  { href: "/admin/alternatives", label: "Alternatives" },
  { href: "/admin/use-cases", label: "Use cases" },
  { href: "/admin/authors", label: "Authors" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-6 py-10">
      <aside className="w-48 shrink-0">
        <p className="eyebrow mb-4 text-accent">Admin</p>
        <nav className="space-y-1 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-body transition hover:bg-surface-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction} className="mt-4">
          <button
            type="submit"
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-negative transition hover:bg-surface-2"
          >
            Log out
          </button>
        </form>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </main>
  );
}
