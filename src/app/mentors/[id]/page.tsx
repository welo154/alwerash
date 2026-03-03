import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/server/db/prisma";
import { Star, Plus } from "lucide-react";

type Props = { params: Promise<{ id: string }> };

function formatCourseDuration(totalMinutes: number | null | undefined): string {
  if (totalMinutes == null || totalMinutes <= 0) return "—";
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const mentor = await prisma.mentor.findUnique({
    where: { id },
    select: { name: true, certificateName: true, aboutMe: true },
  });
  if (!mentor) return { title: "Mentor Details" };
  return {
    title: `${mentor.name} | Mentor Details`,
    description: mentor.aboutMe ?? mentor.certificateName ?? undefined,
  };
}

export default async function MentorDetailsPage({ params }: Props) {
  const { id } = await params;
  const mentor = await prisma.mentor.findUnique({ where: { id } });
  if (!mentor) notFound();

  // Load courses taught by this mentor (with cover + duration for card style)
  type CourseRow = {
    id: string;
    title: string;
    cover_image: string | null;
    total_duration_minutes: number | null;
    track_id: string | null;
    track_title: string | null;
    track_slug: string | null;
  };
  let courses: {
    id: string;
    title: string;
    coverImage: string | null;
    totalDurationMinutes: number | null;
    track: { id: string; title: string; slug: string } | null;
  }[] = [];
  try {
    const rows = await prisma.$queryRaw<CourseRow[]>`
      SELECT c.id, c.title, c.cover_image, c.total_duration_minutes, c.track_id, t.title AS track_title, t.slug AS track_slug
      FROM courses c
      LEFT JOIN tracks t ON t.id = c.track_id
      WHERE c.mentor_id = ${id} AND c.published = true
      ORDER BY t.title ASC NULLS LAST, c.title ASC
    `;
    courses = rows.map((r) => ({
      id: r.id,
      title: r.title,
      coverImage: r.cover_image,
      totalDurationMinutes: r.total_duration_minutes,
      track: r.track_id && r.track_title && r.track_slug ? { id: r.track_id, title: r.track_title, slug: r.track_slug } : null,
    }));
  } catch {
    // mentor_id column may not exist yet
  }

  // Group by track for section headers (reference style)
  const byTrack = new Map<string | null, typeof courses>();
  for (const c of courses) {
    const key = c.track?.title ?? null;
    if (!byTrack.has(key)) byTrack.set(key, []);
    byTrack.get(key)!.push(c);
  }
  const trackOrder = Array.from(byTrack.keys()).sort((a, b) => (a ?? "").localeCompare(b ?? ""));

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/mentors"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
        >
          ← Back to Mentors
        </Link>

        {/* Flex row: left = profile card, right = About Me (Skillshare layout) */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-14">
          {/* Left: profile card - photo, name, title, badge, Follow, stats */}
          <aside className="shrink-0 lg:w-[280px]">
            <div className="flex flex-col items-center text-center">
              <div className="relative h-52 w-52 shrink-0 overflow-hidden rounded-full bg-slate-300 sm:h-60 sm:w-60">
                {mentor.photo ? (
                  <Image
                    src={mentor.photo}
                    alt={mentor.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="240px"
                    unoptimized={mentor.photo.startsWith("http")}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-6xl font-black text-slate-500">
                    {mentor.name.charAt(0)}
                  </div>
                )}
              </div>
              <h1 className="mt-6 text-2xl font-bold tracking-tight text-black sm:text-[28px]">
                {mentor.name}
              </h1>
              {mentor.certificateName && (
                <p className="mt-1.5 text-[15px] font-normal text-slate-600">
                  {mentor.certificateName}
                </p>
              )}
              <div className="mt-5 flex items-center justify-center gap-2 rounded-md bg-[#0d7d4a] px-4 py-2 text-sm font-semibold text-white">
                <Star className="h-4 w-4 shrink-0 fill-white stroke-white" aria-hidden />
                <span>Top Mentor</span>
              </div>
              <button
                type="button"
                className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-[#7c3aed] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#6d28d9]"
              >
                <Plus className="h-5 w-5 shrink-0 stroke-[2.5]" aria-hidden />
                Follow
              </button>
              <div className="mt-8 flex items-center justify-center gap-12">
                <div>
                  <p className="text-2xl font-bold text-black">—</p>
                  <p className="mt-0.5 text-sm font-normal text-slate-500">Followers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-black">—</p>
                  <p className="mt-0.5 text-sm font-normal text-slate-500">Following</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Right: About Me, then big gap, then Courses clearly below */}
          <main className="min-w-0 flex-1">
            <section className="min-h-[540px]">
              <h2 className="text-xl font-bold tracking-tight text-black sm:text-2xl">
                About Me
              </h2>
              {mentor.aboutMe ? (
                <div className="mt-5 space-y-4 text-[15px] font-normal leading-relaxed text-slate-700">
                  {mentor.aboutMe.split(/\n\n+/).map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-slate-500 italic">
                  No bio yet.
                </p>
              )}
            </section>

            {/* Courses — large top spacing so they sit clearly below About Me */}
            {courses.length > 0 && (
              <section className="mt-16 space-y-8 pt-8 border-t border-slate-200">
                {trackOrder.map((trackTitle) => {
                  const trackCourses = byTrack.get(trackTitle)!;
                  return (
                    <div key={trackTitle ?? "other"}>
                      <h2 className="text-xl font-bold tracking-tight text-black sm:text-2xl">
                        {trackTitle ?? "Other courses"}
                      </h2>
                      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {trackCourses.map((course) => (
                          <Link
                            key={course.id}
                            href={`/courses/${course.id}`}
                            className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
                          >
                            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-200">
                              {course.coverImage ? (
                                <Image
                                  src={course.coverImage}
                                  alt=""
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                  unoptimized={course.coverImage.startsWith("http")}
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-slate-300 text-3xl font-black text-slate-400">
                                  {course.title.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <h3 className="font-semibold text-slate-900 line-clamp-2 group-hover:text-[#7c3aed]">
                                {course.title}
                              </h3>
                              <p className="mt-1.5 text-sm text-slate-500">
                                {formatCourseDuration(course.totalDurationMinutes)}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
