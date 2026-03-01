import { publicListFeaturedCourses } from "@/server/content/public.service";
import { CourseCard } from "./CourseCard";

/** Static fallback cards when API returns no courses. */
const STATIC_TRENDING_CARDS = [
  {
    id: "static-trending-1",
    title: "Figma Fundamentals",
    summary: "Master the basics of Figma for UI design.",
    coverImage: "https://images.unsplash.com/photo-1561070791-2526d38794a5?w=800&q=80",
    track: { title: "UI/UX Design", slug: "ui-ux-design" },
    lessonCount: 12,
    instructorName: "Design Team",
  },
  {
    id: "static-trending-2",
    title: "Prototyping in Figma",
    summary: "Create interactive prototypes and hand off to dev.",
    coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    track: { title: "UI/UX Design", slug: "ui-ux-design" },
    lessonCount: 8,
    instructorName: "Design Team",
  },
  {
    id: "static-trending-3",
    title: "Logo Design Masterclass",
    summary: "Design memorable logos and brand identities.",
    coverImage: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80",
    track: { title: "Graphic Design", slug: "graphic-design" },
    lessonCount: 10,
    instructorName: "Brand Lab",
  },
  {
    id: "static-trending-4",
    title: "After Effects Basics",
    summary: "Get started with motion design and animation.",
    coverImage: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80",
    track: { title: "Motion Design", slug: "motion-design" },
    lessonCount: 14,
    instructorName: "Motion Studio",
  },
];

export async function MostWatchedSection() {
  const courses = await publicListFeaturedCourses(4);
  const displayCourses = courses.length > 0 ? courses : STATIC_TRENDING_CARDS;

  return (
    <section className="border-b border-slate-200/80 bg-white px-4 py-16 sm:px-6" data-gsap-reveal>
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Trending courses
        </h2>
        <p className="mt-2.5 leading-relaxed text-slate-600">
          Popular courses this month
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-gsap-stagger-group>
          {displayCourses.map((course) => (
            <CourseCard
              key={course.id}
              variant="mostPlayed"
              id={course.id}
              title={course.title}
              summary={course.summary}
              coverImage={course.coverImage}
              track={course.track}
              lessonCount={course.lessonCount}
              instructorName={course.instructorName}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
