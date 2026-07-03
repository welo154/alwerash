"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { LibraryBookBreadcrumb } from "./LibraryBookBreadcrumb";

const DETAILS_BELOW_BREADCRUMB_PX = 65;

export function LibraryBookDetailLayout({
  bookTitle,
  children,
}: {
  bookTitle: string;
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const breadcrumbRef = useRef<HTMLElement>(null);
  const [detailsTopPx, setDetailsTopPx] = useState<number | null>(null);

  useLayoutEffect(() => {
    const updateSpacing = () => {
      const breadcrumb = breadcrumbRef.current;
      const container = containerRef.current;
      if (!breadcrumb || !container) return;

      const breadcrumbBottom = breadcrumb.getBoundingClientRect().bottom;
      const containerTop = container.getBoundingClientRect().top;
      setDetailsTopPx(breadcrumbBottom - containerTop + DETAILS_BELOW_BREADCRUMB_PX);
    };

    updateSpacing();
    window.addEventListener("resize", updateSpacing);
    return () => window.removeEventListener("resize", updateSpacing);
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-[50vh] bg-white pb-16">
      <LibraryBookBreadcrumb ref={breadcrumbRef} bookTitle={bookTitle} />
      <div
        style={{
          paddingTop: detailsTopPx ?? 0,
          visibility: detailsTopPx === null ? "hidden" : "visible",
        }}
      >
        {children}
      </div>
    </div>
  );
}
