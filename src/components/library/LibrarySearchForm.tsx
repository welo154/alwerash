"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

function SearchActionIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="41"
      height="41"
      viewBox="0 0 41 41"
      fill="none"
      className="h-10 w-10 shrink-0"
      aria-hidden
    >
      <path
        d="M20.5 12.5L28.5 20.5L20.5 28.5M28.5 20.5H12.5M40.5 20.5C40.5 31.5457 31.5457 40.5 20.5 40.5C9.4543 40.5 0.5 31.5457 0.5 20.5C0.5 9.4543 9.4543 0.5 20.5 0.5C31.5457 0.5 40.5 9.4543 40.5 20.5Z"
        stroke="black"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LibrarySearchFormInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const defaultQuery =
    pathname === "/library/search" ? (searchParams.get("q") ?? "") : "";

  return (
    <form
      action="/library/search"
      method="get"
      className="flex shrink-0 items-center gap-[15px]"
    >
      <label className="sr-only" htmlFor="library-search">
        Search for material
      </label>
      <div className="flex h-10 w-[350px] items-center justify-center gap-[10px] rounded-lg border border-black bg-white px-3">
        <input
          id="library-search"
          name="q"
          type="search"
          defaultValue={defaultQuery}
          placeholder="Search for material"
          className="min-w-0 flex-1 border-0 bg-transparent text-[18px] font-normal leading-[19.6px] text-black outline-none placeholder:text-[#73726C]"
          style={{ fontFamily: pangeaFont }}
        />
      </div>
      <button
        type="submit"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5"
        aria-label="Search"
      >
        <SearchActionIcon />
      </button>
    </form>
  );
}

export function LibrarySearchForm() {
  return (
    <Suspense fallback={null}>
      <LibrarySearchFormInner />
    </Suspense>
  );
}
