import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { CinematicIntro } from "@/components/CinematicIntro";

/**
 * Site layout wrapper - header + main content + footer.
 * Used by marketing pages (home, tracks, course, subscription).
 * Cinematic intro runs once per session (main site only); does not change layout.
 */
export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <CinematicIntro />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
