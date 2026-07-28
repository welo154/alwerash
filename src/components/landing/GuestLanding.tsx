import {
  publicGetHomeTrackExplorerBundle,
  publicListLandingMostsMentors,
} from "@/server/content/public.service";
import { HeroSection } from "./HeroSection";
import { HomeTrackExplorerSection } from "@/components/home/HomeTrackExplorerSection";
import { LandingCurrentMostsSection } from "./LandingCurrentMostsSection";
import { LandingEverythingInOneSection } from "./LandingEverythingInOneSection";
import { StudentsRatingWorkSection } from "@/components/students/StudentsRatingWorkSection";
import { LandingFaqSection } from "./LandingFaqSection";
import { LandingGetStartedCtaSection } from "./LandingGetStartedCtaSection";
import { GsapAnimationLayer } from "@/components/gsap/GsapAnimationLayer";
import { pangeaVar } from "@/lib/fonts/pangea";

/** Public marketing landing — used only on `/` for signed-out visitors. */
export async function GuestLanding() {
  const [trackBundle, landingMostsMentors] = await Promise.all([
    publicGetHomeTrackExplorerBundle(),
    publicListLandingMostsMentors(),
  ]);

  return (
    <div className={`${pangeaVar.className} font-sans`}>
      <HeroSection tracks={trackBundle.heroTracks} />
      <HomeTrackExplorerSection
        trackPillRow1={trackBundle.trackPillRow1}
        trackPillRow2={trackBundle.trackPillRow2}
        slidesByFilter={trackBundle.slidesByFilter}
        trackPillSelectsCourses
        courseTilesByTrackSlug={trackBundle.courseTilesByTrackSlug}
        maxVisibleCourses={3}
        showDiscoverCta
        showMetaFilters={false}
        marqueeTrackPills
        sectionClassName="mt-[63px]"
      />
      <LandingEverythingInOneSection />
      {landingMostsMentors.length > 0 ? (
        <LandingCurrentMostsSection
          mentors={landingMostsMentors}
          mentorCardWidthPx={383}
          mentorCardHeightPx={357}
        />
      ) : null}
      <div className="mb-0 w-full px-10">
        <StudentsRatingWorkSection sectionClassName="py-0" />
      </div>
      <LandingFaqSection />
      <LandingGetStartedCtaSection />
      <GsapAnimationLayer />
    </div>
  );
}
