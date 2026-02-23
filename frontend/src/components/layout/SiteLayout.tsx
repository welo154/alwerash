import { SiteHeader } from "./SiteHeader";

/**
 * Site layout wrapper - header + main content.
 * Used by marketing pages (home, tracks, course, subscription).
 * Swap SiteHeader to change the design.
 */
export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
