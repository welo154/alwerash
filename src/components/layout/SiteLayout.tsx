import { SiteHeader } from "./SiteHeader";
import { ConditionalSiteFooter } from "./ConditionalSiteFooter";

/**
 * Site layout wrapper - header + main content + footer.
 * Used by marketing pages (home, tracks, course, subscription).
 */
export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-visible bg-white">
      <div className="mx-auto w-full max-w-[1440px] min-w-0">
        <SiteHeader />
      </div>
      <main className="mx-auto w-full max-w-[1440px] min-w-0 flex-1 overflow-x-visible">{children}</main>
      <ConditionalSiteFooter />
    </div>
  );
}
