import {
  publicListNewCourses,
  publicListMostPlayedCourses,
  publicListFeaturedCourses,
  publicListTracks,
  publicListLandingMostsMentors,
} from "@/server/content/public.service";
import { CatalogShowcaseCard, catalogShowcasePropsFromCourse } from "@/components/cards";
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
    <div className="bg-white pb-16 pt-8 font-sans">
      <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          <aside className="w-full shrink-0 lg:w-[210px]">
            <div className="pb-4">
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
              className="my-4 w-full"
              style={{ outline: "1px black solid", outlineOffset: "-0.5px", height: "1px" }}
            />

            <div className="pt-1">
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
              className="my-4 w-full"
              style={{ outline: "1px black solid", outlineOffset: "-0.5px", height: "1px" }}
            />

            <div className="pt-1">
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
              className="my-4 w-full"
              style={{ outline: "1px black solid", outlineOffset: "-0.5px", height: "1px" }}
            />

            <div className="pt-1">
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
              <div className="relative w-full max-w-[1125px]">
                <div className="absolute left-0 top-0 z-20 inline-flex h-[72px] items-center rounded-[44px] border border-black bg-white pl-[22px] pr-[22px]">
                  <h1 className="uppercase leading-none">
                    <span
                      style={{
                        fontFamily: pangeaFont,
                        color: "#000",
                        fontSize: "48px",
                        fontStyle: "italic",
                        fontWeight: 600,
                        lineHeight: "57.6px",
                      }}
                    >
                      FEATURED
                    </span>
                    <span
                      style={{
                        fontFamily: pangeaFont,
                        color: "#000",
                        fontSize: "48px",
                        fontWeight: 400,
                        lineHeight: "57.6px",
                      }}
                    >
                      {" "}
                      COURSES
                    </span>
                  </h1>
                </div>

                <button
                  type="button"
                  className="absolute right-0 top-[2px] z-20 inline-flex h-[56px] w-[56px] items-center justify-center rounded-full border border-black bg-white"
                  aria-label="Next featured courses"
                  suppressHydrationWarning
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="44"
                    height="44"
                    viewBox="0 0 44 44"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M22 43C33.598 43 43 33.598 43 22C43 10.402 33.598 1 22 1C10.402 1 1 10.402 1 22C1 33.598 10.402 43 22 43Z"
                      fill="#FFF"
                    />
                    <path d="M22 30L30 22L22 14" fill="#FFF" />
                    <path
                      d="M22 30L30 22M30 22L22 14M30 22L14 22M43 22C43 33.598 33.598 43 22 43C10.402 43 1 33.598 1 22C1 10.402 10.402 1 22 1C33.598 1 43 10.402 43 22Z"
                      stroke="#000"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div
                  className="relative overflow-hidden rounded-[55px] px-[16px] pb-[26px] pt-[34px]"
                  style={{ background: "var(--Bright-Green, #89F496)", marginTop: "50px" }}
                >
                  <div className="flex w-max gap-[18px]">
                    {featuredList.map((course) => (
                      <CatalogShowcaseCard
                        key={course.id}
                        {...catalogShowcasePropsFromCourse(course)}
                        className="shrink-0"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-12" aria-label="Popular classes">
              <h2
                className="uppercase"
                style={{
                  fontFamily: pangeaFont,
                  lineHeight: "57.6px",
                }}
              >
                <span
                  style={{
                    color: "#000",
                    fontSize: "48px",
                    fontStyle: "italic",
                    fontWeight: 700,
                  }}
                >
                  POPULAR
                </span>
                <span
                  style={{
                    color: "#000",
                    fontSize: "48px",
                    fontStyle: "normal",
                    fontWeight: 400,
                  }}
                >
                  {" "}
                  CLASSES
                </span>
              </h2>
              <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
                {mostPlayedList.slice(0, 8).map((course) => (
                  <CatalogShowcaseCard
                    key={`popular-${course.id}`}
                    {...catalogShowcasePropsFromCourse(course)}
                    className="shrink-0"
                  />
                ))}
              </div>
            </section>

            <div className="mt-[70px]">
              <LandingCurrentMostsSection
                mentors={landingMostsMentors}
                forceTwoPerRow
                compactVerticalSpacing
                contained
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
