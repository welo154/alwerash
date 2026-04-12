import { HeroSection } from "./HeroSection";
import { LandingBoxesSection } from "./LandingBoxesSection";
import { LandingCurrentMostsSection } from "./LandingCurrentMostsSection";
import { LandingEverythingInOneSection } from "./LandingEverythingInOneSection";
import { GsapAnimationLayer } from "@/components/gsap/GsapAnimationLayer";
import { publicListTracks } from "@/server/content/public.service";

/**
 * Public marketing landing — used only on `/` for signed-out visitors.
 */
export async function GuestLanding() {
  const tracks = await publicListTracks();
  const heroTracks: { id: string; title: string; slug: string }[] = Array.isArray(tracks)
    ? tracks.map((t) => ({ id: t.id, title: t.title, slug: t.slug }))
    : [];

  return (
    <div className="font-sans">
      <HeroSection tracks={heroTracks} />
      <LandingBoxesSection />
      <LandingEverythingInOneSection />
      <LandingCurrentMostsSection />
      <GsapAnimationLayer />
    </div>
  );
}
