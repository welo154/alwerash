import Link from "next/link";
import { LearnCoursesSidebarAside } from "./LearnCoursesSidebarAside";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

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

const sidebarSoftware = [
  "Adobe Photoshop",
  "Adobe Illustrator",
  "Adobe InDesign",
  "Adobe After Effects",
  "Canva",
  "Procreate",
  "+ See More",
] as const;

const sidebarExtraCategories = [
  { key: "extra-fashion", label: "Fashion courses" },
  { key: "extra-web-app-design", label: "Web & App Design courses" },
  { key: "extra-calligraphy-typography", label: "Calligraphy & Typography courses" },
  { key: "extra-music-audio", label: "Music & Audio courses" },
  { key: "extra-culinary", label: "Culinary courses" },
  { key: "extra-ai", label: "Artificial Intelligence courses" },
  { key: "extra-wellness", label: "Wellness courses" },
  { key: "extra-how-to-become", label: "How to become courses" },
] as const;

export type LearnCoursesSidebarCategory = {
  key: string;
  label: string;
  href?: string;
};

const fallbackCategories: LearnCoursesSidebarCategory[] = [
  { key: "fallback-illustration", label: "Illustration courses" },
  { key: "fallback-craft", label: "Craft courses" },
  { key: "fallback-marketing-business", label: "Marketing & Business courses" },
  { key: "fallback-photography-video", label: "Photography & Video courses" },
  { key: "fallback-design", label: "Design courses" },
  { key: "fallback-3d-animation", label: "3D & Animation courses" },
  { key: "fallback-architecture-spaces", label: "Architecture & Spaces courses" },
  { key: "fallback-writing", label: "Writing courses" },
];

export function buildLearnSidebarCategories(
  tracks: { id: string; title: string; slug: string }[]
): LearnCoursesSidebarCategory[] {
  if (tracks.length === 0) return fallbackCategories;
  return tracks.map((t) => ({
    key: `track-${t.id}`,
    label: t.title,
    href: `/tracks/${t.slug}`,
  }));
}

function sidebarItemStyle(active: boolean) {
  return {
    fontFamily: pangeaFont,
    fontSize: "18px",
    fontWeight: 400,
    lineHeight: "28.98px",
    color: active ? "#FF8CFF" : "#000",
  } as const;
}

function SidebarListItem({
  children,
  active = false,
  href,
}: {
  children: React.ReactNode;
  active?: boolean;
  href?: string;
}) {
  const style = sidebarItemStyle(active);
  if (href) {
    return (
      <li>
        <Link href={href} className="hover:opacity-80" style={style}>
          {children}
        </Link>
      </li>
    );
  }
  return <li style={style}>{children}</li>;
}

export function LearnCoursesSidebar({
  categories,
  activeCategoryKey,
  showCoursesSection = true,
}: {
  categories: LearnCoursesSidebarCategory[];
  activeCategoryKey?: string;
  /** Library sidebar hides the courses filter list. */
  showCoursesSection?: boolean;
}) {
  const allCategories = showCoursesSection
    ? [...categories, ...sidebarExtraCategories]
    : categories;

  return (
    <LearnCoursesSidebarAside>
      {showCoursesSection ? (
        <>
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
                <SidebarListItem key={item} active={idx === 0}>
                  {item}
                </SidebarListItem>
              ))}
            </ul>
          </div>

          <div
            aria-hidden
            className="mt-[25px] mb-[25px] block h-px w-[266px] max-w-full shrink-0 bg-black"
          />
        </>
      ) : null}

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
          {allCategories.map((item) => (
            <SidebarListItem
              key={item.key}
              href={"href" in item ? item.href : undefined}
              active={activeCategoryKey === item.key}
            >
              {item.label}
            </SidebarListItem>
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
            <SidebarListItem key={item}>{item}</SidebarListItem>
          ))}
        </ul>
      </div>
    </LearnCoursesSidebarAside>
  );
}
