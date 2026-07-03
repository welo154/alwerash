"use client";

import { useEffect, useRef, useState } from "react";

export function LearnCoursesSidebarAside({
  children,
}: {
  children: React.ReactNode;
}) {
  const asideRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    const aside = asideRef.current;
    const content = contentRef.current;
    if (!aside || !content) return;

    const update = () => {
      setScrollable(content.scrollHeight > aside.clientHeight + 1);
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(aside);
    observer.observe(content);

    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <aside
      ref={asideRef}
      className={`w-full shrink-0 lg:w-[266px] lg:sticky lg:top-8 lg:self-start lg:h-[calc(100vh-2rem)] ${
        scrollable ? "lg:overflow-y-auto" : "lg:overflow-y-hidden"
      }`}
    >
      <div ref={contentRef}>{children}</div>
    </aside>
  );
}
