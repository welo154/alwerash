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
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-semibold text-blue-600 transition-colors hover:text-blue-700"
        >
          Alwerash
        </Link>

        {/* Search bar with accordion results */}
        <SearchBar />

        {/* Actions */}
        <nav className="flex items-center gap-3" aria-label="Main navigation">
          <Link
            href="/tracks"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900"
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
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900"
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
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700"
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
