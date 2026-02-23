import {
  HeroSection,
  StatsSection,
  WhatToExpectSection,
  FeaturedCoursesSection,
  MostWatchedSection,
} from "@/components/landing";

/**
 * Landing page - home.
 * Sections: stats, what to expect, featured courses, most watched.
 */
export default function LandingPage() {
  return (
    <div>
      <HeroSection />
      <StatsSection />
      <WhatToExpectSection />
      <FeaturedCoursesSection />
      <MostWatchedSection />
    </div>
  );
}
