import { publicListFeaturedCourses } from "@/server/content/public.service";
import { publicListTracks } from "@/server/content/public.service";
import { HomeCoursesSection } from "./HomeCoursesSection";

export async function FeaturedCoursesSection() {
  const [courses, tracks] = await Promise.all([
    publicListFeaturedCourses(12),
    publicListTracks(),
  ]);

  const fields = tracks.length > 0 ? tracks.map((t) => t.title) : [];

  const courseForCard = courses.map((c) => ({
    id: c.id,
    title: c.title,
    summary: c.summary ?? null,
    coverImage: c.coverImage ?? null,
    instructorName: (c as { instructorName?: string | null }).instructorName ?? null,
    instructorImage: (c as { instructorImage?: string | null }).instructorImage ?? null,
    track: c.track ?? null,
    lessonCount: c.lessonCount ?? 0,
  }));

  return <HomeCoursesSection courses={courseForCard} fields={fields} />;
}
