import { SiteHeader } from "./SiteHeader";
import { ConditionalSiteFooter } from "./ConditionalSiteFooter";

/**
 * Site layout wrapper - header + main content + footer.
 * Used by marketing pages (home, tracks, course, subscription).
 */
export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-hidden bg-white">
      <SiteHeader />
      <main className="min-w-0 flex-1">{children}</main>
      <ConditionalSiteFooter />
    </div>
  );
}
