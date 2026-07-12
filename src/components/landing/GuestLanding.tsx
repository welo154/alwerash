import {
  publicGetHomeTrackExplorerBundle,
  publicListLandingMostsMentors,
} from "@/server/content/public.service";
import { HeroSection } from "./HeroSection";
import { HomeTrackExplorerSection } from "@/components/home/HomeTrackExplorerSection";
import { LandingCurrentMostsSection } from "./LandingCurrentMostsSection";
import { LandingEverythingInOneSection } from "./LandingEverythingInOneSection";
import { LandingWhyStudentsLoveSection } from "./LandingWhyStudentsLoveSection";
import { LandingFaqSection } from "./LandingFaqSection";
import { LandingGetStartedCtaSection } from "./LandingGetStartedCtaSection";
import { GsapAnimationLayer } from "@/components/gsap/GsapAnimationLayer";

/** Public marketing landing — used only on `/` for signed-out visitors. */
export async function GuestLanding() {
  const [trackBundle, landingMostsMentors] = await Promise.all([
    publicGetHomeTrackExplorerBundle(),
    publicListLandingMostsMentors(),
  ]);

  return (
    <div className="font-sans">
      <HeroSection tracks={trackBundle.heroTracks} />
      <HomeTrackExplorerSection
        trackPillRow1={trackBundle.trackPillRow1}
        trackPillRow2={trackBundle.trackPillRow2}
        slidesByFilter={trackBundle.slidesByFilter}
        trackPillSelectsCourses
        courseTilesByTrackSlug={trackBundle.courseTilesByTrackSlug}
        maxVisibleCourses={4}
        showDiscoverCta
        showMetaFilters={false}
        marqueeTrackPills
      />
      <LandingEverythingInOneSection />
      {landingMostsMentors.length > 0 ? (
        <LandingCurrentMostsSection
          mentors={landingMostsMentors}
          mentorCardWidthPx={409}
          mentorCardHeightPx={424.999}
        />
      ) : null}
      <LandingWhyStudentsLoveSection />
      <LandingFaqSection />
      <LandingGetStartedCtaSection />
      <GsapAnimationLayer />
    </div>
  );
}
