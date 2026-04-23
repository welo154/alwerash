"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { SearchBar } from "./SearchBar";

/**
 * Marketing / guest top bar — black strip, text logo, yellow accents.
 * Not used when the user is signed in (see LoggedInAppHeader).
 */
export function GuestSiteHeader() {
  return (
    <nav className="relative z-50 mb-[50px] flex w-full flex-nowrap items-center justify-between gap-4 bg-black px-6 py-3 font-sans text-white">
      <div className="flex min-w-0 flex-1 flex-nowrap items-center gap-6 sm:gap-8">
        <Link
          href="/"
          className="font-logo flex shrink-0 items-center gap-0.5 text-2xl font-black italic tracking-tighter text-white transition-colors hover:text-gray-300 focus:outline-none"
        >
          <span>alwerash</span>
          <span className="text-yellow-400">.</span>
        </Link>
        <div className="hidden shrink-0 items-center gap-8 sm:flex" aria-label="Main navigation">
          <Link href="/learn" className="text-[15px] font-bold text-white transition-colors hover:text-gray-300">
            Courses
          </Link>
          <Link href="/tracks" className="text-[15px] font-bold text-white transition-colors hover:text-gray-300">
            Projects
          </Link>
          <Link href="/mentors" className="text-[15px] font-bold text-white transition-colors hover:text-gray-300">
            Mentors
          </Link>
        </div>
        <div className="hidden w-full max-w-[280px] min-w-0 sm:block">
          <SearchBar />
        </div>
        <Link
          href="/subscription"
          className="hidden shrink-0 items-center gap-2 text-[15px] font-bold text-white transition-colors hover:text-gray-300 sm:flex"
        >
          <ShoppingCart size={20} strokeWidth={2.5} />
          Plans
        </Link>
      </div>

      <div className="flex shrink-0 flex-nowrap items-center gap-8">
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
      </div>
    </nav>
  );
}
