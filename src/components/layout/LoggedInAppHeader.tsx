"use client";

import Link from "next/link";
import Image from "next/image";
import { Bell, ChevronDown, Heart } from "lucide-react";
import { UserMenu } from "./UserMenu";
import { SearchBar } from "./SearchBar";

const BRAND_GREEN = "#004B3C";
/** Logo column width — matches hero “LOGO_W” role for white-box geometry */
const LOGO_COL_W = 220;
/** Shared corner radius — same as hero header row (R = 50) */
const R = 50;
/** Header bar height */
const HEADER_H = 112;

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

export type LoggedInAppHeaderProps = {
  user: { name?: string | null; email?: string | null; image?: string | null };
  isAdmin: boolean;
};

/**
 * Signed-in shell header — same curvature language as {@link HeroSection}:
 * green container, two white absolute boxes top-left, white logo tile + rounded green nav.
 */
export function LoggedInAppHeader({ user, isAdmin }: LoggedInAppHeaderProps) {
  return (
    <div
      className="sticky top-0 z-50 mt-[30px] w-full overflow-hidden rounded-[50px]"
      style={{ backgroundColor: BRAND_GREEN }}
    >
      {/* White box 1 — half logo width, double header height (hero: half LOGO_W, 2× logo strip) */}
      <div
        className="pointer-events-none absolute top-0 left-0 z-10 bg-white"
        style={{ width: LOGO_COL_W / 2, height: HEADER_H * 2 }}
        aria-hidden
      />

      {/* White box 2 — double logo width, short strip (hero: 2× LOGO_W × 45) */}
      <div
        className="pointer-events-none absolute top-0 left-0 z-10 bg-green-500"
        style={{ width: LOGO_COL_W * 2, height: 45 }}
        aria-hidden
      />

      <header className="relative w-full">
        <div className="flex items-stretch">
          {/* Logo — white tile; curves into green (hero pattern) */}
          <div
            className="relative z-20 flex shrink-0 items-center justify-center overflow-hidden bg-white"
            style={{
              width: LOGO_COL_W,
              height: HEADER_H,
              borderBottomRightRadius: R,
            }}
          >
            <Link
              href="/"
              className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#004B3C]/40 focus-visible:ring-offset-2"
            >
              <Image
                src="/brand/alwerash-logo.png"
                alt="Alwerash"
                width={325}
                height={116}
                className="h-auto max-h-[88px] w-[min(200px,92%)] object-contain"
                priority
                unoptimized
              />
            </Link>
          </div>

          {/* Toolbar — green, large radius like hero navbar */}
          <div
            className="relative z-30 flex min-w-0 flex-1 flex-row flex-nowrap items-center gap-3 overflow-x-auto rounded-[50px] py-3 pl-0 pr-5 sm:gap-7 sm:pl-6 sm:pr-10"
            style={{ backgroundColor: BRAND_GREEN, height: HEADER_H }}
          >
            <nav
              className="hidden shrink-0 items-center gap-8 text-[16px] font-normal leading-[120%] tracking-[0] text-white md:flex"
              style={{ fontFamily: pangeaFont }}
              aria-label="Main navigation"
            >
              <Link href="/learn" className="inline-flex items-center gap-1.5 hover:opacity-90">
                Courses
                <ChevronDown className="h-4 w-4 opacity-95" strokeWidth={2} aria-hidden />
              </Link>
              <Link href="/tracks" className="hover:opacity-90">
                Library
              </Link>
              <Link
                href="/tracks"
                className="underline decoration-1 underline-offset-[5px] hover:opacity-90"
              >
                Events
              </Link>
            </nav>

            <div className="min-w-0 flex-1 md:mx-2 md:max-w-md lg:mx-4 lg:max-w-lg xl:max-w-xl">
              <SearchBar variant="toolbar" />
            </div>

            <div
              className="ml-auto flex shrink-0 flex-row flex-nowrap items-center gap-3 text-[16px] font-normal leading-[120%] tracking-[0] text-white sm:gap-5"
              style={{ fontFamily: pangeaFont }}
            >
              {isAdmin && (
                <Link href="/admin/content/tracks" className="hidden hover:opacity-90 lg:inline">
                  Admin
                </Link>
              )}
              <Link href="/learn" className="hidden whitespace-nowrap hover:opacity-90 sm:inline">
                My Learning
              </Link>
              <Link
                href="/learn"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white hover:bg-white/10"
                aria-label="Favorites"
              >
                <Heart className="h-5 w-5" strokeWidth={2} />
              </Link>
              <button
                type="button"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white hover:bg-white/10"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" strokeWidth={2} />
              </button>
              <UserMenu user={user} theme="green" />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
