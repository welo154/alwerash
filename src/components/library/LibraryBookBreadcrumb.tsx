"use client";

import Link from "next/link";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

const breadcrumbTextStyle = {
  color: "var(--Black, #000)",
  fontFamily: pangeaFont,
  fontSize: 18,
  fontStyle: "normal" as const,
  fontWeight: 400,
  lineHeight: "normal",
};

const breadcrumbTextClass = "opacity-60 hover:opacity-80";

function LibraryBreadcrumbChevron() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="17"
      viewBox="0 0 10 19"
      fill="none"
      className="h-[17px] w-[8px] shrink-0"
      style={{ opacity: 0.6 }}
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

export function LibraryBookBreadcrumb({ bookTitle }: { bookTitle: string }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center"
      style={{
        paddingLeft: 40,
        paddingTop: 8,
        paddingBottom: 16,
        gap: 26,
        fontFamily: pangeaFont,
      }}
    >
      <Link href="/library" className={breadcrumbTextClass} style={breadcrumbTextStyle}>
        Library
      </Link>
      <LibraryBreadcrumbChevron />
      <Link
        href="/library/categories/book-section"
        className={breadcrumbTextClass}
        style={breadcrumbTextStyle}
      >
        Books
      </Link>
      <LibraryBreadcrumbChevron />
      <span className="opacity-60" style={breadcrumbTextStyle}>
        {bookTitle}
      </span>
    </nav>
  );
}
