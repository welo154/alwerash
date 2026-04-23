import {
  publicListNewCourses,
  publicListMostPlayedCourses,
  publicListFeaturedCourses,
  publicListTracks,
  publicListLandingMostsMentors,
} from "@/server/content/public.service";
import { catalogShowcasePropsFromCourse } from "@/components/cards/catalog-showcase-map";
import { LearnFeaturedCoursesPanel } from "@/components/learn/LearnFeaturedCoursesPanel";
import { LearnPopularClassesSection } from "@/components/learn/LearnPopularClassesSection";
import type { LearnPopularTile } from "@/components/learn/learn-popular-types";
import { LandingCurrentMostsSection } from "@/components/landing";

export default async function LearnPage() {
  const [newCourses, mostPlayedCourses, fallbackCourses, tracks, landingMostsMentors] = await Promise.all([
    publicListNewCourses(),
    publicListMostPlayedCourses(12),
    publicListFeaturedCourses(12),
    publicListTracks(),
    publicListLandingMostsMentors(),
  ]);

  const fields = tracks.length > 0 ? tracks.map((t) => t.title) : [];
  const newList = newCourses.length > 0 ? newCourses : fallbackCourses.slice(0, 3);
  const mostPlayedList =
    mostPlayedCourses.length > 0 ? mostPlayedCourses : fallbackCourses;
  const featuredList = newList.length > 0 ? newList : mostPlayedList.slice(0, 3);
  const popularCourses =
    mostPlayedCourses.length > 0
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

  const sidebarCourseFilters = [
    "All Couses",
    "Guided Courses",
    "Deep Dive",
    "Specializations",
    "Basics",
    "New Courses",
    "Top Rated",
    "Popular Courses",
  ] as const;

  const sidebarCategories = fields.length > 0
    ? fields
    : [
        "Illustration courses",
        "Craft courses",
        "Marketing & Business courses",
        "Photography & Video courses",
        "Design courses",
        "3D & Animation courses",
        "Architecture & Spaces courses",
        "Writing courses",
      ];
  const sidebarCategoriesExtended = [
    ...sidebarCategories,
    "Fashion courses",
    "Web & App Design courses",
    "Calligraphy & Typography courses",
    "Music & Audio courses",
    "Culinary courses",
    "Artificial Intelligence courses",
    "Wellness courses",
    "How to become courses",
  ];
  const sidebarAreas = [
    "Branding & Identity",
    "Graphic Design",
    "Social Media Design",
    "Web Design",
    "Color Theory",
    "Design",
    "+ See More",
  ];
  const sidebarSoftware = [
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Adobe InDesign",
    "Adobe After Effects",
    "Canva",
    "Procreate",
    "+ See More",
  ];

  const pangeaFont =
    '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

  return (
    <div className="min-w-0 max-w-full overflow-x-hidden bg-white pb-16 pt-8 font-sans">
      <div className="mx-auto w-full min-w-0 max-w-[1400px] pl-6 sm:pl-8 lg:pl-10">
        <div className="flex min-w-0 max-w-full flex-col gap-8 lg:flex-row lg:items-start lg:gap-[55px]">
          <aside className="w-full shrink-0 lg:w-[266px]">
            <div>
              <h2
                className="uppercase"
                style={{
                  fontFamily: pangeaFont,
                  fontSize: "24px",
                  fontStyle: "italic",
                  fontWeight: 700,
                  lineHeight: "28.8px",
                }}
              >
                COURSES
              </h2>
              <ul className="mt-2 space-y-0.5">
                {sidebarCourseFilters.map((item, idx) => (
                  <li
                    key={item}
                    style={{
                      fontFamily: pangeaFont,
                      fontSize: "18px",
                      fontWeight: 400,
                      lineHeight: "28.98px",
                      color: idx === 0 ? "#FF8CFF" : "#000",
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div
              aria-hidden
              className="mt-[25px] mb-[25px] block h-px w-[266px] max-w-full shrink-0 bg-black"
            />

            <div>
              <h3
                className="uppercase"
                style={{
                  fontFamily: pangeaFont,
                  fontSize: "24px",
                  fontStyle: "italic",
                  fontWeight: 700,
                  lineHeight: "28.8px",
                }}
              >
                CATEGORIES
              </h3>
              <ul className="mt-2 space-y-0.5">
                {sidebarCategoriesExtended.map((item) => (
                  <li
                    key={item}
                    style={{
                      fontFamily: pangeaFont,
                      fontSize: "18px",
                      fontWeight: 400,
                      lineHeight: "28.98px",
                      color: "#000",
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div
              aria-hidden
              className="mt-[25px] mb-[25px] block h-px w-[266px] max-w-full shrink-0 bg-black"
            />

            <div>
              <h3
                className="uppercase"
                style={{
                  fontFamily: pangeaFont,
                  fontSize: "24px",
                  fontStyle: "italic",
                  fontWeight: 700,
                  lineHeight: "28.8px",
                }}
              >
                AREAS
              </h3>
              <ul className="mt-2 space-y-0.5">
                {sidebarAreas.map((item) => (
                  <li
                    key={item}
                    style={{
                      fontFamily: pangeaFont,
                      fontSize: "18px",
                      fontWeight: 400,
                      lineHeight: "28.98px",
                      color: "#000",
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div
              aria-hidden
              className="mt-[25px] mb-[25px] block h-px w-[266px] max-w-full shrink-0 bg-black"
            />

            <div>
              <h3
                className="uppercase"
                style={{
                  fontFamily: pangeaFont,
                  fontSize: "24px",
                  fontStyle: "italic",
                  fontWeight: 700,
                  lineHeight: "28.8px",
                }}
              >
                SOFTWARE
              </h3>
              <ul className="mt-2 space-y-0.5">
                {sidebarSoftware.map((item) => (
                  <li
                    key={item}
                    style={{
                      fontFamily: pangeaFont,
                      fontSize: "18px",
                      fontWeight: 400,
                      lineHeight: "28.98px",
                      color: "#000",
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <main className="min-w-0 flex-1">
            <section aria-label="Featured courses">
              <LearnFeaturedCoursesPanel
                slides={featuredList.map((course) => ({
                  id: course.id,
                  cardProps: catalogShowcasePropsFromCourse(course),
                }))}
              />
            </section>

            <div className="mt-[55px] min-w-0 lg:ml-[48px]">
              <section aria-label="Popular classes">
                <LearnPopularClassesSection tiles={popularTiles} />
              </section>

              <div className="mt-[70px]">
                <LandingCurrentMostsSection
                  mentors={landingMostsMentors}
                  forceTwoPerRow
                  compactVerticalSpacing
                  contained
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
