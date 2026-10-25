import { Suspense } from "react";
import { loadCoursePageCatalog, type CourseForCard } from "@/server/content/public.service";
import { LandingCurrentMostsSection } from "@/components/landing";
import { LearnFeaturedCoursesPanel } from "@/components/learn/LearnFeaturedCoursesPanel";
import { LearnPopularClassesSection } from "@/components/learn/LearnPopularClassesSection";
import LearnAllCoursesSection from "@/components/learn/LearnAllCoursesSection";
import type { LearnAllCourseItem } from "@/components/learn/learn-all-courses-types";
import type { LearnPopularTile } from "@/components/learn/learn-popular-types";
import {
  LearnCoursesSidebar,
  buildLearnSidebarCategories,
} from "@/components/learn/LearnCoursesSidebar";
import { LearnCoursesPageFilterBar } from "@/components/learn/LearnCoursesPageFilterBar";
import { markPage } from "@/server/observability/query-timing";
import { LocaleMirror } from "@/components/providers/LocaleProvider";
import { courseCardStats } from "@/lib/content/course-card-stats";

function toPopularTiles(courses: CourseForCard[]): LearnPopularTile[] {
  return courses.map((c) => ({
    id: c.id,
    href: `/course/${c.id}`,
    title: c.title.trim(),
    titleAr: c.titleAr,
    authorLabel: c.instructorName?.trim() || "Instructor",
    authorLabelAr: c.instructorNameAr,
    tagPrimary: c.track?.title?.trim().toUpperCase() || "COURSE",
    typeLabel: c.typeLabel,
    coverImageSrc: c.coverImage,
    comingSoon: c.comingSoon,
    ...courseCardStats(c),
  }));
}

function toAllCourseItems(courses: CourseForCard[]): LearnAllCourseItem[] {
  return courses.map((c) => ({
    id: c.id,
    href: `/course/${c.id}`,
    title: c.title.trim(),
    titleAr: c.titleAr,
    authorLabel: c.instructorName?.trim() || "Instructor",
    authorLabelAr: c.instructorNameAr,
    tagPrimary: c.track?.title?.trim().toUpperCase() || "COURSE",
    typeLabel: c.typeLabel,
    coverImageSrc: c.coverImage,
    trackSlug: c.track?.slug ?? null,
    rating: c.rating,
    lessonCount: c.lessonCount,
    totalDurationMinutes: c.totalDurationMinutes,
    comingSoon: c.comingSoon,
    ...courseCardStats(c),
  }));
}

export default async function LearnPage() {
  markPage("/course");
  let catalog: Awaited<ReturnType<typeof loadCoursePageCatalog>>;
  try {
    catalog = await loadCoursePageCatalog();
  } catch {
    catalog = {
      popularClassCourses: [],
      allCourses: [],
      tracks: [],
      trackShowcaseSlides: [],
      featuredMentors: [],
    };
  }

  const {
    popularClassCourses,
    allCourses,
    tracks,
    trackShowcaseSlides,
    featuredMentors,
  } = catalog;

  const popularTiles = toPopularTiles(popularClassCourses);
  const allCourseItems = toAllCourseItems(allCourses);
  const hasCarouselSections = popularTiles.length > 0;
  const sidebarCategories = buildLearnSidebarCategories(tracks);

  return (
    <LocaleMirror className="min-w-0 max-w-full overflow-x-visible bg-white pb-16 pt-[26px] font-sans lg:pt-[60px]">
      <div className="w-full min-w-0 ps-[70px] max-lg:ps-8 max-[743px]:ps-6">
        <main className="min-w-0 w-full overflow-x-visible">
          <div className="lg:hidden">
            <LearnCoursesPageFilterBar categories={sidebarCategories} />
          </div>

          <div className="flex min-w-0 max-w-full flex-col overflow-x-visible lg:flex-row lg:items-start lg:gap-[88px]">
            <div
              className="hidden lg:sticky lg:top-8 lg:z-40 lg:block lg:self-start"
              style={{ marginTop: -14 }}
            >
              <LearnCoursesSidebar categories={sidebarCategories} headingsOnly />
            </div>

            <div className="relative z-0 min-w-0 flex-1 overflow-x-visible">
              <section
                aria-label="Featured tracks"
                className="mt-5 w-full min-w-0 overflow-x-visible min-[744px]:max-lg:mt-[37px] lg:mt-0 lg:-ms-[73px]"
              >
                <LearnFeaturedCoursesPanel
                  slides={trackShowcaseSlides.map((slide) => ({
                    id: slide.slug,
                    cardProps: { ...slide.cardProps, showcaseSlug: slide.slug },
                  }))}
                  hideNavOnMobile
                />
              </section>

              <div className="mt-[45px] min-w-0 w-full overflow-x-visible min-[744px]:max-lg:mt-[69px] lg:mt-[90px]">
                {popularTiles.length > 0 ? (
                  <section id="popular-classes" aria-label="Popular classes" className="scroll-mt-8">
                    <LearnPopularClassesSection tiles={popularTiles} fullBleed="right" hideNavOnMobile />
                  </section>
                ) : null}

                {allCourseItems.length > 0 ? (
                  <div className={hasCarouselSections ? "mt-[45px] min-[744px]:max-lg:mt-[69px] lg:mt-[90px]" : ""}>
                    <Suspense fallback={null}>
                      <LearnAllCoursesSection
                        courses={allCourseItems}
                        fullBleed="right"
                        hideNavOnMobile
                      />
                    </Suspense>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {featuredMentors.length > 0 ? (
            <div
              className={`max-lg:pe-0 lg:pe-10 ${
                hasCarouselSections || allCourseItems.length > 0
                  ? "mt-[45px] lg:mt-[90px]"
                  : ""
              } max-lg:-ms-6 max-lg:w-[calc(100%+1.5rem)] sm:max-lg:-ms-8 sm:max-lg:w-[calc(100%+2rem)]`}
            >
              <LandingCurrentMostsSection
                mentors={featuredMentors}
                mentorsPerRow={3}
                mentorCardWidthPx={383}
                mentorCardHeightPx={357}
                compactVerticalSpacing
                contained
                mobileHeadingInsetPx={38}
                tabletHeadingSizePx={32}
                className="mt-0 lg:mt-0"
              />
            </div>
          ) : null}
        </main>
      </div>
    </LocaleMirror>
  );
}
