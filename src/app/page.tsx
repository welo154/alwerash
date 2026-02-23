import {
  HeroSection,
  StatsSection,
  TracksSection,
  WhatToExpectSection,
  FeaturedCoursesSection,
  MostWatchedSection,
} from "@/components/landing";

/**
 * Landing page - home.
 * Sections: stats, tracks, what to expect, featured courses, most watched.
 */
export default function LandingPage() {
  return (
    <div>
      <HeroSection />
      <StatsSection />
      <TracksSection />
      <WhatToExpectSection />
      <FeaturedCoursesSection />
      <MostWatchedSection />
    </div>
  );
}
