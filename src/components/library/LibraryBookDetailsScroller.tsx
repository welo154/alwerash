"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

const AUTO_SCROLL_PX_PER_MS = 0.05;

export function LibraryBookDetailsScroller({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const userControlRef = useRef(false);
  const directionRef = useRef(1);
  const lastTsRef = useRef<number | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const el = scrollerRef.current;
    if (!root || !el) return;

    let raf = 0;

    const tick = (ts: number) => {
      const last = lastTsRef.current;
      lastTsRef.current = ts;

      if (!userControlRef.current && last != null) {
        const max = el.scrollHeight - el.clientHeight;
        if (max > 1) {
          const next =
            el.scrollTop +
            directionRef.current * AUTO_SCROLL_PX_PER_MS * (ts - last);
          if (next >= max) {
            el.scrollTop = max;
            directionRef.current = -1;
          } else if (next <= 0) {
            el.scrollTop = 0;
            directionRef.current = 1;
          } else {
            el.scrollTop = next;
          }
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      userControlRef.current = true;
      lastTsRef.current = null;
      el.scrollTop += e.deltaY;
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={className}
      style={{
        ...style,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
      onMouseLeave={() => {
        userControlRef.current = false;
        lastTsRef.current = null;
      }}
    >
      <div
        ref={scrollerRef}
        className="no-scrollbar w-full"
        style={{
          flex: 1,
          minHeight: 0,
          height: 0,
          overflowY: "auto",
          overflowX: "hidden",
          overscrollBehavior: "contain",
        }}
      >
        {children}
      </div>
    </div>
  );
}
