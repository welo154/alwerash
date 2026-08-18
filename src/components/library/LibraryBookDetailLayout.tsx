"use client";

import { LibraryBookBreadcrumb } from "./LibraryBookBreadcrumb";

const DETAILS_BELOW_LINE_PX = 26;

export function LibraryBookDetailLayout({
  bookTitle,
  children,
}: {
  bookTitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[50vh] bg-white pb-16">
      <div className="relative left-1/2 z-10 w-screen max-w-[100vw] -translate-x-1/2">
        <LibraryBookBreadcrumb bookTitle={bookTitle} />
        <div
          className="h-px w-full"
          style={{ background: "#000", opacity: 0.6 }}
          aria-hidden
        />
      </div>
      <div style={{ paddingTop: DETAILS_BELOW_LINE_PX }}>{children}</div>
    </div>
  );
}
