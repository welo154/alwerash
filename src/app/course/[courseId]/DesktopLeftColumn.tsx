"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

const PAGE_LEFT_INSET_PX = 120;

/**
 * Desktop course column: 758px wide, with its left edge 120px from the page.
 * Only the left margin moves, so the 80px flex gap to the details column stays intact.
 */
export function DesktopLeftColumn({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const desktop = window.matchMedia("(min-width: 1024px)");

    const apply = () => {
      if (!desktop.matches) {
        el.style.marginLeft = "";
        el.style.marginRight = "";
        return;
      }
      el.style.marginLeft = "0px";
      el.style.marginRight = "";
      const delta = PAGE_LEFT_INSET_PX - el.getBoundingClientRect().left;
      el.style.marginLeft = `${delta}px`;
    };

    apply();
    const frame = requestAnimationFrame(apply);
    window.addEventListener("resize", apply);
    desktop.addEventListener("change", apply);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", apply);
      desktop.removeEventListener("change", apply);
    };
  }, []);

  return (
    <section ref={ref} className="w-[843px] max-w-full shrink-0 max-lg:contents lg:w-[758px] lg:ar:[direction:rtl]">
      {children}
    </section>
  );
}
