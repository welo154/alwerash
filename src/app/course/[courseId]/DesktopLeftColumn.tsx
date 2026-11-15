import type { ReactNode } from "react";

/**
 * Desktop course column: 758px wide, inset 120px from the course container
 * (max 1440px, centered) — not the viewport — so zoom does not shift layout.
 */
export function DesktopLeftColumn({ children }: { children: ReactNode }) {
  return (
    <section className="w-[843px] max-w-full shrink-0 max-lg:contents lg:ms-[120px] lg:w-[758px] lg:ar:[direction:rtl]">
      {children}
    </section>
  );
}
