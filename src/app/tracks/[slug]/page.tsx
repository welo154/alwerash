// file: src/app/tracks/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { publicGetTrackBySlug } from "@/server/content/public.service";
import { getSubscriptionStatus } from "@/server/subscription/subscribe.service";
import { AppError } from "@/server/lib/errors";

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

  const session = await auth();
  const subscription = session?.user?.id
    ? await getSubscriptionStatus(session.user.id)
    : { active: false };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <nav className="flex gap-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <span>/</span>
            <Link href="/tracks" className="hover:text-blue-600">
              Learning paths
            </Link>
            <span>/</span>
            <span className="text-slate-900">{track.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero with cover image - Yanfaa style */}
      <div className="relative overflow-hidden border-b border-slate-200 bg-slate-900">
        {track.coverImage ? (
          <>
            <div className="absolute inset-0">
              <Image
                src={track.coverImage}
                alt={track.title}
                fill
                unoptimized
                className="object-cover opacity-60"
                sizes="100vw"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />
          </>
        ) : null}
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          {track.school && (
            <p className="text-sm font-medium text-blue-300">
              {track.school.title}
            </p>
          )}
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            {track.title}
          </h1>
          {track.description && (
            <p className="mt-4 max-w-2xl text-slate-200">{track.description}</p>
          )}
          {!subscription.active && (
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/subscription"
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
              >
                Subscribe for full access
              </Link>
              <p className="self-center text-sm text-slate-300">
                Access all courses in this track and more
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Courses grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <h2 className="text-xl font-semibold text-slate-900">Courses</h2>
        {track.courses.length === 0 ? (
          <p className="mt-4 text-slate-500">No courses in this track yet.</p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-gsap-stagger-group>
            {track.courses.map((c) => (
              <Link
                key={c.id}
                href={`/courses/${c.id}`}
                className="group card-hover overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[var(--shadow-card)] transition-shadow duration-300 hover:border-blue-300/80 hover:shadow-[var(--shadow-card-hover)]"
                data-gsap-hover
              >
                <div className="aspect-video relative overflow-hidden bg-slate-100">
                  {c.coverImage ? (
                    <Image
                      src={c.coverImage}
                      alt={c.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      Course
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">
                    {c.title}
                  </h3>
                  {c.summary && (
                    <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-600">
                      {c.summary}
                    </p>
                  )}
                  <span className="mt-4 inline-flex items-center text-sm font-medium text-blue-600">
                    View course →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!subscription.active && (
          <div className="mt-12 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="font-semibold text-slate-900">
              Get full access to all courses
            </h3>
            <p className="mt-2 text-slate-600">
              Subscribe once and unlock all tracks and courses. Cancel anytime.
            </p>
            <Link
              href="/subscription"
              className="mt-4 inline-flex rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
            >
              View plans
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
