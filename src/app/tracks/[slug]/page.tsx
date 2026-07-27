import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { publicGetTrackBySlug, publicListTracks } from "@/server/content/public.service";
import { AppError } from "@/server/lib/errors";
import {
  getCourseProgressForCourses,
  getTrackProgress,
} from "@/server/learning/progress.service";
import {
  LearnCoursesSidebar,
  buildLearnSidebarCategories,
} from "@/components/learn/LearnCoursesSidebar";
import { TrackCoursesSection } from "@/components/tracks/TrackCoursesSection";

export default async function TrackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let track;
  try {
    track = await publicGetTrackBySlug(slug);
  } catch (e) {
    if (e instanceof AppError && e.status === 404) notFound();
    throw e;
  }

  const tracks = await publicListTracks();
  const sidebarCategories = buildLearnSidebarCategories(tracks);

  const session = await auth();
  const userId = session?.user?.id;

  const courseIds = track.courses.map((c) => c.id);
  const [trackProgressRecord, courseProgressList] = userId
    ? await Promise.all([
        getTrackProgress(userId, track.id),
        getCourseProgressForCourses(userId, courseIds),
      ])
    : [null, []];

  const progressByCourseId = new Map(
    courseProgressList.map((p) => [p.courseId, p.progressPercent])
  );

  const trackProgress = trackProgressRecord
    ? {
        progressPercent: trackProgressRecord.progressPercent,
        completedCount: trackProgressRecord.completedCount,
        totalCount: trackProgressRecord.totalCount,
        trackTitle: trackProgressRecord.trackTitle,
      }
    : null;

  const courseItems = track.courses.map((c) => ({
    id: c.id,
    href: `/course/${c.id}`,
    title: c.title,
    authorLabel: c.instructorName?.trim() || "Instructor",
    tagPrimary: track.title.toUpperCase(),
    coverImageSrc: c.coverImage,
    rating: c.rating ?? null,
    popularOrder: c.featuredMostPlayedOrder ?? null,
    progressPercent: userId ? (progressByCourseId.get(c.id) ?? 0) : null,
  }));

  return (
    <div className="min-w-0 max-w-full overflow-x-clip bg-white pb-16 pt-[50px] font-sans">
      <div className="mx-auto w-full min-w-0 max-w-[1400px] pl-6 sm:pl-8 lg:pl-10">
        <div className="flex min-w-0 max-w-full flex-col gap-8 lg:flex-row lg:items-start lg:gap-[55px]">
          <LearnCoursesSidebar
            categories={sidebarCategories}
            activeCategoryKey={`track-${track.id}`}
          />

          <main className="min-w-0 flex-1">
            <TrackCoursesSection
              trackTitle={track.title}
              courses={courseItems}
              trackProgress={trackProgress}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
