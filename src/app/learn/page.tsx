import {
  publicListPopularClassCourses,
  publicListTrendingCourses,
  publicListTrackShowcaseSlides,
  publicListFeaturedMentors,
} from "@/server/content/public.service";
import { LearnFeaturedCoursesPanel } from "@/components/learn/LearnFeaturedCoursesPanel";
import { LearnPopularClassesSection } from "@/components/learn/LearnPopularClassesSection";
import { LearnTrendingClassesSection } from "@/components/learn/LearnTrendingClassesSection";
import type { LearnPopularTile } from "@/components/learn/learn-popular-types";
import { LandingCurrentMostsSection } from "@/components/landing";

function toPopularTiles(
  courses: Awaited<ReturnType<typeof publicListPopularClassCourses>>
): LearnPopularTile[] {
  return courses.map((c) => ({
    id: c.id,
    href: `/courses/${c.id}`,
    title: c.title.trim(),
    authorLabel: c.instructorName?.trim() || "Instructor",
    tagPrimary: c.track?.title?.trim().toUpperCase() || "COURSE",
    coverImageSrc: c.coverImage,
  }));
}

export default async function LearnPage() {
  const [popularClassCourses, trendingCourses, trackShowcaseSlides, featuredMentors] =
    await Promise.all([
      publicListPopularClassCourses(40),
      publicListTrendingCourses(),
      publicListTrackShowcaseSlides(),
      publicListFeaturedMentors(),
    ]);

  const popularTiles = toPopularTiles(popularClassCourses);
  const trendingTiles = toPopularTiles(trendingCourses);

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
            {popularTiles.length > 0 ? (
              <section aria-label="Popular classes">
                <LearnPopularClassesSection tiles={popularTiles} />
              </section>
            ) : null}

            {trendingTiles.length > 0 ? (
              <div className={popularTiles.length > 0 ? "mt-[55px]" : ""}>
                <section aria-label="Trending classes">
                  <LearnTrendingClassesSection tiles={trendingTiles} />
                </section>
              </div>
            ) : null}

            {featuredMentors.length > 0 ? (
              <div
                className={
                  popularTiles.length > 0 || trendingTiles.length > 0 ? "mt-[70px]" : ""
                }
              >
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
