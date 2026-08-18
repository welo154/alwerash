"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { LibrarySearchForm } from "./LibrarySearchForm";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

const navLinkClass =
  "whitespace-nowrap text-[18px] font-[400] not-italic leading-normal text-black hover:opacity-80";

function CategoriesDropdownArrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      className="h-4 w-4 shrink-0"
      aria-hidden
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LibraryHeader({ compactBottom = false }: { compactBottom?: boolean }) {
  const { data: session } = useSession();
  const homeHref = session?.user ? "/home" : "/";

  return (
    <header
      className={`relative z-50 w-full bg-white pt-[10px] ${compactBottom ? "pb-0" : "pb-8"}`}
      aria-label="Library header"
      style={{ fontFamily: pangeaFont }}
    >
      <div className="flex min-w-0 items-center">
        <nav
          className="ml-[226px] flex shrink-0 items-center gap-[40px]"
          aria-label="Library navigation"
        >
          <Link
            id="library-nav-home"
            href={homeHref}
            className={`relative z-10 ${navLinkClass}`}
          >
            Home
          </Link>

          <Link
            href="/library/categories"
            className={`inline-flex items-center gap-1 ${navLinkClass}`}
          >
            Categories
            <CategoriesDropdownArrow />
          </Link>

          <Link href="/events" className={navLinkClass}>
            Events
          </Link>
        </nav>

        <div className="ml-[80px] flex min-w-0 items-center gap-[60px]">
          <div className="flex w-[220px] shrink-0 flex-col items-center justify-center">
            <Link href="/library" aria-label="Go to library home">
              <Image
                src="/brand/alwerash-logo.png"
                alt="Alwerash"
                width={220}
                height={96}
                className="h-[96px] w-[220px] object-contain"
                style={{ aspectRatio: "55 / 24" }}
                unoptimized
                priority
              />
            </Link>
            <h1 className="-mt-6 w-full text-center text-[48px] font-normal not-italic leading-[120%] text-black">
              LIBRARY
            </h1>
          </div>

          <LibrarySearchForm />
        </div>
      </div>
    </header>
  );
}
