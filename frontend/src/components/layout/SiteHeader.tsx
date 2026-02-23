"use client";

import Link from "next/link";

/**
 * Main site header - Logo | Search | Sign in | Sign up | Tracks
 * Layout matches design spec. Styling uses Tailwind + CSS vars for easy swap.
 */
export function SiteHeader() {
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

        {/* Search bar */}
        <div className="flex flex-1 max-w-md mx-4">
          <input
            type="search"
            placeholder="Search courses..."
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            aria-label="Search courses"
          />
        </div>

        {/* Actions */}
        <nav className="flex items-center gap-3" aria-label="Main navigation">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Sign up
          </Link>
          <Link
            href="/tracks"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Tracks
          </Link>
        </nav>
      </div>
    </header>
  );
}
