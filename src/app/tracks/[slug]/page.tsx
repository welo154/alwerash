import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { publicGetTrackBySlug } from "@/server/content/public.service";
import { getSubscriptionStatus } from "@/server/subscription/subscribe.service";
import { AppError } from "@/server/lib/errors";
import { LearnPopularFigmaTile } from "@/components/learn/LearnPopularFigmaTile";

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

  const courseTiles = track.courses.map((c) => ({
    id: c.id,
    href: `/courses/${c.id}`,
    title: c.title,
    authorLabel: c.instructorName?.trim() || "Instructor",
    tagPrimary: track.title.toUpperCase(),
    coverImageSrc: c.coverImage,
  }));

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <nav className="flex gap-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-900">{track.title}</span>
          </nav>
        </div>
      </div>

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
          <h1 className="text-3xl font-bold text-white sm:text-4xl">{track.title}</h1>
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
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <h2 className="text-xl font-semibold text-slate-900">Courses</h2>
        {courseTiles.length === 0 ? (
          <p className="mt-4 text-slate-500">No courses in this track yet.</p>
        ) : (
          <div className="mt-6 flex flex-wrap gap-6" data-gsap-stagger-group>
            {courseTiles.map((tile) => (
              <LearnPopularFigmaTile key={tile.id} {...tile} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
