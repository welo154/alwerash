"use client";

import Link from "next/link";
import localFont from "next/font/local";
import { forwardRef, useLayoutEffect, useRef, useState } from "react";

const pangeaVar = localFont({
  src: "../../../public/fonts/FwTRIAL-PangeaVAR.woff2",
  display: "swap",
  weight: "100 900",
  style: "normal",
});

const BREADCRUMB_LEFT_PX = 55;
const BREADCRUMB_BELOW_HOME_PX = 55;

const breadcrumbTextClass = `${pangeaVar.className} text-[24px] font-normal not-italic leading-normal text-black/[0.6]`;

function LibraryBreadcrumbChevron() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="17"
      viewBox="0 0 10 19"
      fill="none"
      className="h-[17px] w-[8px] shrink-0 opacity-60"
      aria-hidden
    >
      <path
        d="M0.75 17.75L8.75 9.25L0.749999 0.75"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const LibraryBookBreadcrumb = forwardRef<
  HTMLElement,
  { bookTitle: string }
>(function LibraryBookBreadcrumb({ bookTitle }, ref) {
  const navRef = useRef<HTMLElement>(null);
  const [topPx, setTopPx] = useState<number | null>(null);

  useLayoutEffect(() => {
    const updatePosition = () => {
      const home = document.getElementById("library-nav-home");
      const nav = navRef.current;
      const parent = nav?.parentElement;
      if (!home || !nav || !parent) return;

      const homeBottom = home.getBoundingClientRect().bottom;
      const parentTop = parent.getBoundingClientRect().top;
      setTopPx(homeBottom + BREADCRUMB_BELOW_HOME_PX - parentTop);
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  const setNavRef = (node: HTMLElement | null) => {
    navRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  return (
    <nav
      ref={setNavRef}
      aria-label="Breadcrumb"
      className="absolute z-[60] flex items-center gap-3"
      style={{
        left: `${BREADCRUMB_LEFT_PX}px`,
        top: topPx ?? 0,
        visibility: topPx === null ? "hidden" : "visible",
      }}
    >
      <Link href="/library" className={`${breadcrumbTextClass} hover:opacity-80`}>
        Library
      </Link>
      <LibraryBreadcrumbChevron />
      <Link
        href="/library/categories/book-section"
        className={`${breadcrumbTextClass} hover:opacity-80`}
      >
        Books
      </Link>
      <LibraryBreadcrumbChevron />
      <span className={breadcrumbTextClass}>{bookTitle}</span>
    </nav>
  );
});

LibraryBookBreadcrumb.displayName = "LibraryBookBreadcrumb";
