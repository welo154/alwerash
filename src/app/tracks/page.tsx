import Link from "next/link";
import Image from "next/image";
import { publicListTracks } from "@/server/content/public.service";

export default async function TracksPage() {
  const tracks = await publicListTracks();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Learning paths
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Choose a path and master a skill. Each track includes courses,
            projects, and real-world applications.
          </p>
        </div>
      </div>

      {/* Tracks grid - Yanfaa style */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {tracks.length === 0 ? (
          <p className="text-slate-500">No tracks available yet.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.map((track) => (
              <Link
                key={track.id}
                href={`/tracks/${track.slug}`}
                className="group card-hover overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:border-blue-300 hover:shadow-lg"
              >
                <div className="aspect-[16/10] relative overflow-hidden bg-slate-100">
                  {track.coverImage ? (
                    <Image
                      src={track.coverImage}
                      alt={track.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      {track.title}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  {track.school ? (
                    <span className="text-xs font-medium uppercase tracking-wide text-blue-600">
                      {track.school.title}
                    </span>
                  ) : null}
                  <h2 className="mt-2 font-semibold text-slate-900 group-hover:text-blue-600">
                    {track.title}
                  </h2>
                  {track.description ? (
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                      {track.description}
                    </p>
                  ) : null}
                  <span className="mt-4 inline-flex items-center text-sm font-medium text-blue-600">
                    View courses →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Subscription CTA */}
        <div className="mt-12 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="font-semibold text-slate-900">Get full access</h2>
          <p className="mt-1 text-slate-600">
            Subscribe to unlock all courses across all tracks.
          </p>
          <Link
            href="/subscription"
            className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            View subscription plans
          </Link>
        </div>
      </div>
    </div>
  );
}
