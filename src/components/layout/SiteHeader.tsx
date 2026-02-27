"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { UserMenu } from "./UserMenu";
import { SearchBar } from "./SearchBar";

/**
 * Main site header - Logo | Search | Sign in/Sign up OR profile menu | Tracks
 */
export function SiteHeader() {
  const { data: session, status } = useSession();

  return (
    <header className="relative z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-semibold text-blue-600 transition-colors hover:text-blue-700 focus:outline-none rounded-lg"
        >
          Alwerash
        </Link>

        {/* Search bar with accordion results */}
        <SearchBar />

        {/* Actions */}
        <nav className="flex items-center gap-2" aria-label="Main navigation">
          <Link
            href="/tracks"
            className="nav-link px-4 py-2.5 text-sm font-medium text-slate-700"
          >
            Tracks
          </Link>
          {status === "loading" ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200" />
          ) : session?.user ? (
            <>
              {(session.user as { roles?: string[] }).roles?.includes("ADMIN") && (
                <Link
                  href="/admin/content/tracks"
                  className="nav-link px-4 py-2.5 text-sm font-medium text-slate-700"
                >
                  Admin
                </Link>
              )}
              <UserMenu user={session.user} />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="nav-link px-4 py-2.5 text-sm font-medium text-slate-700"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="btn-primary rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
