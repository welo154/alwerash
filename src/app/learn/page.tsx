import {
  publicListNewCourses,
  publicListMostPlayedCourses,
  publicListPopularClassCourses,
  publicListTrendingCourses,
  publicListFeaturedCourses,
  publicListTrackShowcaseSlides,
  publicListFeaturedMentors,
} from "@/server/content/public.service";
import { LearnFeaturedCoursesPanel } from "@/components/learn/LearnFeaturedCoursesPanel";
import { LearnPopularClassesSection } from "@/components/learn/LearnPopularClassesSection";
import { LearnTrendingClassesSection } from "@/components/learn/LearnTrendingClassesSection";
import type { LearnPopularTile } from "@/components/learn/learn-popular-types";
import { LandingCurrentMostsSection } from "@/components/landing";

export default async function LearnPage() {
  const [newCourses, mostPlayedCourses, popularClassCourses, trendingCourses, fallbackCourses, trackShowcaseSlides, featuredMentors] =
    await Promise.all([
    publicListNewCourses(),
    publicListMostPlayedCourses(12),
    publicListPopularClassCourses(40),
    publicListTrendingCourses(),
    publicListFeaturedCourses(12),
    publicListTrackShowcaseSlides(),
    publicListFeaturedMentors(),
  ]);

  const newList = newCourses.length > 0 ? newCourses : fallbackCourses.slice(0, 3);
  const mostPlayedList =
    mostPlayedCourses.length > 0 ? mostPlayedCourses : fallbackCourses;
  const featuredList = newList.length > 0 ? newList : mostPlayedList.slice(0, 3);
  const popularCourses =
    popularClassCourses.length > 0
      ? popularClassCourses
      : mostPlayedCourses.length > 0
        ? mostPlayedCourses
        : featuredList.length > 0
          ? featuredList
          : fallbackCourses;
  const popularTiles: LearnPopularTile[] = popularCourses.map((c) => ({
    id: c.id,
    href: `/courses/${c.id}`,
    title: c.title.trim(),
    authorLabel: c.instructorName?.trim() || "Instructor",
    tagPrimary: c.track?.title?.trim().toUpperCase() || "COURSE",
    coverImageSrc: c.coverImage,
  }));
  const trendingTiles: LearnPopularTile[] = trendingCourses.map((c) => ({
    id: c.id,
    href: `/courses/${c.id}`,
    title: c.title.trim(),
    authorLabel: c.instructorName?.trim() || "Instructor",
    tagPrimary: c.track?.title?.trim().toUpperCase() || "COURSE",
    coverImageSrc: c.coverImage,
  }));

  return (
    <div className="min-w-0 max-w-full overflow-x-clip bg-white pb-16 pt-8 font-sans">
      <div className="w-full min-w-0 px-6 sm:px-8 lg:px-10">
        <main className="min-w-0 w-full">
          <section aria-label="Tracks" className="w-full min-w-0">
            <LearnFeaturedCoursesPanel
              slides={trackShowcaseSlides.map((slide) => ({
                id: slide.slug,
                cardProps: slide.cardProps,
              }))}
            />
          </section>

          <div className="mt-[55px] min-w-0 w-full overflow-visible">
            <section aria-label="Popular classes">
              <LearnPopularClassesSection tiles={popularTiles} />
            </section>

            <div className="mt-[55px]">
              <section aria-label="Trending classes">
                <LearnTrendingClassesSection tiles={trendingTiles} />
              </section>
            </div>

            {featuredMentors.length > 0 ? (
              <div className="mt-[70px]">
                <LandingCurrentMostsSection
                  mentors={featuredMentors}
                  mentorsPerRow={4}
                  compactVerticalSpacing
                  contained
                />
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
