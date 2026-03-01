"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin/content/schools", label: "Schools" },
  { href: "/admin/content/tracks", label: "Tracks" },
  { href: "/admin/content/courses", label: "Courses" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [logoutOpen, setLogoutOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLogoutOpen(false);
    };
    if (logoutOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [logoutOpen]);

  function handleSignOut() {
    setLogoutOpen(false);
    signOut({ callbackUrl: "/login" });
  }

  return (
    <div className="flex h-dvh bg-white font-sans">
      {/* Left sidebar: full viewport height, logout pinned to bottom */}
      <aside className="flex h-dvh w-56 shrink-0 flex-col border-r border-slate-200 bg-white">
        <Link
          href="/admin/content/tracks"
          className="shrink-0 border-b border-slate-200 px-6 py-4 font-logo text-xl font-semibold italic text-black transition-colors hover:text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-inset"
        >
          alwerash<span className="text-[var(--color-primary)]">.</span>
        </Link>
        <nav className="min-h-0 flex-1 space-y-0.5 overflow-auto p-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gray-200 text-black"
                      : "text-slate-700 hover:bg-slate-100 hover:text-black"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        <div className="shrink-0 border-t border-slate-200 p-3">
          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-3 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-white"
          >
            <svg className="h-4 w-4 shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Right: main content with overflow scroll */}
      <main className="min-h-0 flex-1 overflow-auto bg-slate-50/50">{children}</main>

      {/* Logout confirmation modal */}
      {logoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="logout-modal-title">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setLogoutOpen(false)}
            aria-hidden
          />
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200/80">
            <div className="p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h2 id="logout-modal-title" className="mt-4 text-lg font-semibold text-slate-900">
                Sign out?
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                You will need to sign in again to access the admin dashboard.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setLogoutOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex-1 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
