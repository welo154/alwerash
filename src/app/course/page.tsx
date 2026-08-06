import {
  publicListAllPublishedCourses,
  publicListPopularClassCourses,
  publicListTrendingCourses,
  publicListTrackShowcaseSlides,
  publicListFeaturedMentors,
  publicListTracks,
} from "@/server/content/public.service";
import { LearnFeaturedCoursesPanel } from "@/components/learn/LearnFeaturedCoursesPanel";
import { LearnPopularClassesSection } from "@/components/learn/LearnPopularClassesSection";
import { LearnTrendingClassesSection } from "@/components/learn/LearnTrendingClassesSection";
import LearnAllCoursesSection from "@/components/learn/LearnAllCoursesSection";
import type { LearnAllCourseItem } from "@/components/learn/learn-all-courses-types";
import type { LearnPopularTile } from "@/components/learn/learn-popular-types";
import { LandingCurrentMostsSection } from "@/components/landing";
import {
  LearnCoursesSidebar,
  buildLearnSidebarCategories,
} from "@/components/learn/LearnCoursesSidebar";

function toPopularTiles(
  courses: Awaited<ReturnType<typeof publicListPopularClassCourses>>
): LearnPopularTile[] {
  return courses.map((c) => ({
    id: c.id,
    href: `/course/${c.id}`,
    title: c.title.trim(),
    authorLabel: c.instructorName?.trim() || "Instructor",
    tagPrimary: c.track?.title?.trim().toUpperCase() || "COURSE",
    coverImageSrc: c.coverImage,
  }));
}

function toAllCourseItems(
  courses: Awaited<ReturnType<typeof publicListAllPublishedCourses>>
): LearnAllCourseItem[] {
  return courses.map((c) => ({
    id: c.id,
    href: `/course/${c.id}`,
    title: c.title.trim(),
    authorLabel: c.instructorName?.trim() || "Instructor",
    tagPrimary: c.track?.title?.trim().toUpperCase() || "COURSE",
    coverImageSrc: c.coverImage,
    trackSlug: c.track?.slug ?? null,
    rating: c.rating,
    lessonCount: c.lessonCount,
    totalDurationMinutes: c.totalDurationMinutes,
  }));
}

export default async function LearnPage() {
  const [
    popularClassCourses,
    trendingCourses,
    allCourses,
    tracks,
    trackShowcaseSlides,
    featuredMentors,
  ] = await Promise.all([
    publicListPopularClassCourses(40),
    publicListTrendingCourses(),
    publicListAllPublishedCourses(),
    publicListTracks(),
    publicListTrackShowcaseSlides(),
    publicListFeaturedMentors(),
  ]);

  const popularTiles = toPopularTiles(popularClassCourses);
  const trendingTiles = toPopularTiles(trendingCourses);
  const allCourseItems = toAllCourseItems(allCourses);
  const trackOptions = tracks.map((track) => ({ slug: track.slug, title: track.title }));
  const hasCarouselSections = popularTiles.length > 0 || trendingTiles.length > 0;
  const sidebarCategories = buildLearnSidebarCategories(tracks);

  return (
    <div className="min-w-0 max-w-full overflow-x-visible bg-white pb-16 pt-8 font-sans">
      {/* No right padding — lets the green tracks shell bleed past the page edge. */}
      <div className="w-full min-w-0 pl-6 sm:pl-8 lg:pl-10">
        <main className="min-w-0 w-full overflow-x-visible">
          {/* Sidebar spans everything above the mentors section. */}
          {/* Sidebar ↔ content: 88px from the sidebar rule for all sections after Featured.
              Featured keeps the previous 55px inset via a compensating pull. */}
          <div className="flex min-w-0 max-w-full flex-col gap-8 overflow-x-visible lg:flex-row lg:items-start lg:gap-[88px]">
            <LearnCoursesSidebar categories={sidebarCategories} />

            <div className="relative z-0 min-w-0 flex-1 overflow-x-visible">
              <section
                aria-label="Featured courses"
                className="w-full min-w-0 overflow-x-visible lg:-ml-[33px]"
              >
                <LearnFeaturedCoursesPanel
                  slides={trackShowcaseSlides.map((slide) => ({
                    id: slide.slug,
                    cardProps: { ...slide.cardProps, showcaseSlug: slide.slug },
                  }))}
                />
              </section>

              <div className="mt-[55px] min-w-0 w-full overflow-x-visible">
                {popularTiles.length > 0 ? (
                  <section aria-label="Popular classes">
                    <LearnPopularClassesSection tiles={popularTiles} fullBleed="right" />
                  </section>
                ) : null}

                {trendingTiles.length > 0 ? (
                  <div className={popularTiles.length > 0 ? "mt-[55px]" : ""}>
                    <section aria-label="Recently added classes">
                      <LearnTrendingClassesSection tiles={trendingTiles} fullBleed="right" />
                    </section>
                  </div>
                ) : null}

                {allCourseItems.length > 0 ? (
                  <div className={hasCarouselSections ? "mt-[55px]" : ""}>
                    <LearnAllCoursesSection
                      courses={allCourseItems}
                      tracks={trackOptions}
                      fullBleed="right"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {featuredMentors.length > 0 ? (
            <div
              className={`pr-6 sm:pr-8 lg:pr-10 ${
                hasCarouselSections || allCourseItems.length > 0 ? "mt-[70px]" : ""
              }`}
            >
              <LandingCurrentMostsSection
                mentors={featuredMentors}
                mentorsPerRow={3}
                mentorCardWidthPx={383}
                mentorCardHeightPx={357}
                compactVerticalSpacing
                contained
                headingSizePx={36}
              />
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
