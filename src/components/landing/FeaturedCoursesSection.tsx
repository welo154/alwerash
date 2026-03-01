import {
  publicListNewCourses,
  publicListMostPlayedCourses,
  publicListFeaturedCourses,
  publicListTracks,
} from "@/server/content/public.service";
import { HomeCoursesSection } from "./HomeCoursesSection";

export async function FeaturedCoursesSection() {
  const [newCourses, mostPlayedCourses, fallbackCourses, tracks] = await Promise.all([
    publicListNewCourses(),
    publicListMostPlayedCourses(12),
    publicListFeaturedCourses(12),
    publicListTracks(),
  ]);

  const fields = tracks.length > 0 ? tracks.map((t) => t.title) : [];

  // When no courses are in featured sections, show fallback: first 3 as New, all as Most Played
  const newList = newCourses.length > 0 ? newCourses : fallbackCourses.slice(0, 3);
  const mostPlayedList =
    mostPlayedCourses.length > 0 ? mostPlayedCourses : fallbackCourses;

  return (
    <HomeCoursesSection
      newCourses={newList}
      mostPlayedCourses={mostPlayedList}
      fields={fields}
    />
  );
}
