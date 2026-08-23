import { Suspense } from "react";
import { loadCoursePageCatalog, type CourseForCard } from "@/server/content/public.service";
import { LearnFeaturedCoursesPanel } from "@/components/learn/LearnFeaturedCoursesPanel";
import { LearnPopularClassesSection } from "@/components/learn/LearnPopularClassesSection";
import { LearnTrendingClassesSection } from "@/components/learn/LearnTrendingClassesSection";
import LearnAllCoursesSection from "@/components/learn/LearnAllCoursesSection";
import type { LearnAllCourseItem } from "@/components/learn/learn-all-courses-types";
import type { LearnPopularTile } from "@/components/learn/learn-popular-types";
import { LandingCurrentMostsSection } from "@/components/landing";
import { buildLearnSidebarCategories } from "@/components/learn/LearnCoursesSidebar";
import { LearnCoursesPageFilterBar } from "@/components/learn/LearnCoursesPageFilterBar";

function toPopularTiles(courses: CourseForCard[]): LearnPopularTile[] {
  return courses.map((c) => ({
    id: c.id,
    href: `/course/${c.id}`,
    title: c.title.trim(),
    authorLabel: c.instructorName?.trim() || "Instructor",
    tagPrimary: c.track?.title?.trim().toUpperCase() || "COURSE",
    coverImageSrc: c.coverImage,
  }));
}

function toAllCourseItems(courses: CourseForCard[]): LearnAllCourseItem[] {
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
  let catalog: Awaited<ReturnType<typeof loadCoursePageCatalog>>;
  try {
    catalog = await loadCoursePageCatalog();
  } catch {
    catalog = {
      popularClassCourses: [],
      trendingCourses: [],
      allCourses: [],
      tracks: [],
      trackShowcaseSlides: [],
      featuredMentors: [],
    };
  }

  const {
    popularClassCourses,
    trendingCourses,
    allCourses,
    tracks,
    trackShowcaseSlides,
    featuredMentors,
  } = catalog;

  const popularTiles = toPopularTiles(popularClassCourses);
  const trendingTiles = toPopularTiles(trendingCourses);
  const allCourseItems = toAllCourseItems(allCourses);
  const trackOptions = tracks.map((track) => ({ slug: track.slug, title: track.title }));
  const hasCarouselSections = popularTiles.length > 0 || trendingTiles.length > 0;
  const sidebarCategories = buildLearnSidebarCategories(tracks);

  return (
    <div className="min-w-0 max-w-full overflow-x-visible bg-white pb-16 pt-[26px] font-sans lg:pt-8">
      <div className="w-full min-w-0 pl-6 sm:pl-8 lg:pl-10">
        <main className="min-w-0 w-full overflow-x-visible">
          <LearnCoursesPageFilterBar categories={sidebarCategories} />

          <section
            aria-label="Featured courses"
            className="mt-5 w-full min-w-0 overflow-x-visible lg:mt-8"
          >
            <LearnFeaturedCoursesPanel
              slides={trackShowcaseSlides.map((slide) => ({
                id: slide.slug,
                cardProps: { ...slide.cardProps, showcaseSlug: slide.slug },
              }))}
              hideNavOnMobile
            />
          </section>

          <div className="mt-[45px] min-w-0 w-full overflow-x-visible">
            {popularTiles.length > 0 ? (
              <section id="popular-classes" aria-label="Popular classes" className="scroll-mt-8">
                <LearnPopularClassesSection tiles={popularTiles} fullBleed="right" hideNavOnMobile />
              </section>
            ) : null}

            {trendingTiles.length > 0 ? (
              <div className={popularTiles.length > 0 ? "mt-[45px]" : ""}>
                <section aria-label="Recently added classes">
                  <LearnTrendingClassesSection tiles={trendingTiles} fullBleed="right" hideNavOnMobile />
                </section>
              </div>
            ) : null}

            {allCourseItems.length > 0 ? (
              <div className={hasCarouselSections ? "mt-[45px]" : ""}>
                <Suspense fallback={null}>
                  <LearnAllCoursesSection
                    courses={allCourseItems}
                    tracks={trackOptions}
                    fullBleed="right"
                    hideNavOnMobile
                  />
                </Suspense>
              </div>
            ) : null}
          </div>

          {featuredMentors.length > 0 ? (
            <div
              className={`pr-6 sm:pr-8 lg:pr-10 ${
                hasCarouselSections || allCourseItems.length > 0 ? "mt-[45px]" : ""
              } max-lg:-ml-6 max-lg:w-[calc(100%+1.5rem)] sm:max-lg:-ml-8 sm:max-lg:w-[calc(100%+2rem)]`}
            >
              <LandingCurrentMostsSection
                mentors={featuredMentors}
                mentorsPerRow={3}
                mentorCardWidthPx={383}
                mentorCardHeightPx={357}
                compactVerticalSpacing
                contained
                headingSizePx={36}
                mobileHeadingInsetPx={38}
                className="mt-0"
              />
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
