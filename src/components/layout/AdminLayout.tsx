"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin/content/schools", label: "Schools" },
  { href: "/admin/content/tracks", label: "Tracks" },
  { href: "/admin/content/courses", label: "Courses" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Vertical sidebar */}
      <aside className="w-56 shrink-0 border-r border-slate-200 bg-white">
        <div className="flex h-full flex-col">
          <Link
            href="/admin/content/tracks"
            className="border-b border-slate-200 px-6 py-4 text-lg font-semibold text-blue-600 hover:text-blue-700"
          >
            Admin
          </Link>
          <nav className="flex-1 space-y-0.5 p-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-slate-200 p-3">
            <Link
              href="/dashboard"
              className="block rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              ← Back to site
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
