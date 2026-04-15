import { GsapAnimationLayer } from "@/components/gsap/GsapAnimationLayer";
import {
  publicGetGuestLandingTrackBundle,
  publicListLandingMostsMentors,
} from "@/server/content/public.service";
import { HeroSection } from "./HeroSection";
import { LandingBoxesSection } from "./LandingBoxesSection";
import { LandingCurrentMostsSection } from "./LandingCurrentMostsSection";
import { LandingEverythingInOneSection } from "./LandingEverythingInOneSection";
import { LandingWhyStudentsLoveSection } from "./LandingWhyStudentsLoveSection";
import { LandingFaqSection } from "./LandingFaqSection";
import { LandingGetStartedCtaSection } from "./LandingGetStartedCtaSection";

/**
 * Public marketing landing — used only on `/` for signed-out visitors.
 * Hero, tag strips, and catalog tiles all follow published tracks from the admin dashboard.
 */
export async function GuestLanding() {
  const [{ heroTracks, showcaseSlides, showcaseTagRow1, showcaseTagRow2 }, landingMostsMentors] =
    await Promise.all([publicGetGuestLandingTrackBundle(), publicListLandingMostsMentors()]);

  return (
    <div className="font-sans">
      <HeroSection tracks={heroTracks} />
      <LandingBoxesSection
        showcaseSlides={showcaseSlides}
        showcaseTagRow1={showcaseTagRow1}
        showcaseTagRow2={showcaseTagRow2}
      />
      <LandingEverythingInOneSection />
      <LandingCurrentMostsSection mentors={landingMostsMentors} />
      <LandingWhyStudentsLoveSection />
      <LandingFaqSection />
      <LandingGetStartedCtaSection />
      <GsapAnimationLayer />
    </div>
  );
}
