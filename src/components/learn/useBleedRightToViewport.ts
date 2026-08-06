"use client";

import { useLayoutEffect, useState, type RefObject } from "react";

/**
 * Width from the element’s left edge to the viewport’s right edge.
 * Used so carousels can swipe off the page without a white gutter,
 * while staying clear of a left sidebar.
 */
export function useBleedRightToViewport(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean
): number | undefined {
  const [width, setWidth] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    if (!enabled) {
      setWidth(undefined);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const update = () => {
      const left = el.getBoundingClientRect().left;
      setWidth(Math.max(0, Math.round(window.innerWidth - left)));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    if (el.parentElement) ro.observe(el.parentElement);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [ref, enabled]);

  return width;
}
