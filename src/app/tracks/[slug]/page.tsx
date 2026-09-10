import { notFound } from "next/navigation";
import { publicGetTrackBySlug, publicListTracks } from "@/server/content/public.service";
import { AppError } from "@/server/lib/errors";
import {
  LearnCoursesSidebar,
  buildLearnSidebarCategories,
} from "@/components/learn/LearnCoursesSidebar";
import { LearnCoursesPageFilterBar } from "@/components/learn/LearnCoursesPageFilterBar";
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

  const courseItems = track.courses.map((c) => ({
    id: c.id,
    href: `/course/${c.id}`,
    title: c.title,
    authorLabel: c.instructorName?.trim() || "Instructor",
    tagPrimary: track.title.toUpperCase(),
    coverImageSrc: c.coverImage,
    rating: c.rating ?? null,
    popularOrder: c.featuredMostPlayedOrder ?? null,
  }));

  return (
    <div className="min-w-0 max-w-full overflow-x-clip bg-white pb-16 max-lg:pt-[25px] font-sans lg:pt-[50px]">
      <div className="lg:hidden">
        <div className="pl-6 sm:pl-8">
          <LearnCoursesPageFilterBar categories={sidebarCategories} />
        </div>
        <div
          aria-hidden
          className="mx-auto mt-[19px] w-[393px] max-w-full bg-black opacity-60"
          style={{ height: 0, borderTop: "1px solid #000" }}
        />
      </div>

      <div className="mx-auto w-full min-w-0 max-w-[1400px] pl-6 sm:pl-8 lg:pl-10">
        <div className="flex min-w-0 max-w-full flex-col overflow-x-visible lg:flex-row lg:items-start lg:gap-[55px]">
          <div className="hidden lg:sticky lg:top-8 lg:z-40 lg:block lg:self-start">
            <LearnCoursesSidebar
              categories={sidebarCategories}
              activeCategoryKey={`track-${track.id}`}
            />
          </div>

          <main className="min-w-0 flex-1">
            <TrackCoursesSection
              trackTitle={track.title}
              courses={courseItems}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
