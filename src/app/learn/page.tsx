import {
  publicListNewCourses,
  publicListMostPlayedCourses,
  publicListFeaturedCourses,
  publicListTracks,
} from "@/server/content/public.service";
import { HomeCoursesSection } from "@/components/landing/HomeCoursesSection";

export default async function LearnPage() {
  const [newCourses, mostPlayedCourses, fallbackCourses, tracks] = await Promise.all([
    publicListNewCourses(),
    publicListMostPlayedCourses(12),
    publicListFeaturedCourses(12),
    publicListTracks(),
  ]);

  const fields = tracks.length > 0 ? tracks.map((t) => t.title) : [];
  const newList = newCourses.length > 0 ? newCourses : fallbackCourses.slice(0, 3);
  const mostPlayedList =
    mostPlayedCourses.length > 0 ? mostPlayedCourses : fallbackCourses;

  return (
    <div className="font-sans">
      <HomeCoursesSection
        newCourses={newList}
        mostPlayedCourses={mostPlayedList}
        fields={fields}
      />
    </div>
  );
}
