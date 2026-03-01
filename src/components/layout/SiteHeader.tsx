"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Search, ShoppingCart } from "lucide-react";
import { UserMenu } from "./UserMenu";
import { SearchBar } from "./SearchBar";

/**
 * Main site header - black bar, logo, Courses | Projects, search, Plans, My courses, profile | sign-up | Log-in.
 */
export function SiteHeader() {
  const { data: session, status } = useSession();

  return (
    <nav className="relative z-50 flex w-full items-center justify-between bg-black px-6 py-3 font-sans text-white">
      {/* Left: Logo + Nav */}
      <div className="flex items-center gap-10">
        <Link
          href="/"
          className="font-logo flex items-baseline gap-0.5 text-2xl font-black italic tracking-tighter text-white transition-colors hover:text-gray-300 focus:outline-none"
        >
          <span>alwerash</span>
          <span className="text-yellow-400">.</span>
        </Link>
        <div className="hidden sm:flex gap-8" aria-label="Main navigation">
          <Link href="/learn" className="text-[15px] font-bold text-white transition-colors hover:text-gray-300">
            Courses
          </Link>
          <Link href="/tracks" className="text-[15px] font-bold text-white transition-colors hover:text-gray-300">
            Projects
          </Link>
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex flex-1 max-w-xl px-10">
        <SearchBar />
      </div>

      {/* Right: Plans, My courses, Auth */}
      <div className="flex items-center gap-8">
        <Link
          href="/subscription"
          className="hidden sm:flex items-center gap-2 text-[15px] font-bold text-white transition-colors hover:text-gray-300"
        >
          <ShoppingCart size={20} strokeWidth={2.5} />
          Plans
        </Link>
        {status === "loading" ? (
          <div className="h-10 w-10 animate-pulse rounded-full border-2 border-yellow-400/50 bg-white/10" />
        ) : session?.user ? (
          <>
            <Link href="/learn" className="hidden sm:inline text-[15px] font-bold text-white transition-colors hover:text-gray-300">
              My courses
            </Link>
            {(session.user as { roles?: string[] }).roles?.includes("ADMIN") && (
              <Link href="/admin/content/tracks" className="text-[15px] font-bold text-white transition-colors hover:text-gray-300">
                Admin
              </Link>
            )}
            <UserMenu user={session.user} />
          </>
        ) : (
          <>
            <Link
              href="/register"
              className="rounded-md border border-yellow-400 bg-transparent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-black"
            >
              sign-up
            </Link>
            <Link
              href="/login"
              className="rounded-md bg-yellow-400 px-4 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-black"
            >
              Log-in
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
