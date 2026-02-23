import Link from "next/link";
import Image from "next/image";
import { publicListTracks } from "@/server/content/public.service";

export async function TracksSection() {
  const tracks = await publicListTracks();

  if (tracks.length === 0) return null;

  return (
    <section className="border-b border-slate-200 bg-white px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Learning paths
        </h2>
        <p className="mt-2 text-slate-600">
          Start with a track that matches your goals.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.slice(0, 6).map((track) => (
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
              <div className="p-5">
                {track.school ? (
                  <span className="text-xs font-medium uppercase tracking-wide text-blue-600">
                    {track.school.title}
                  </span>
                ) : null}
                <h3 className="mt-2 font-semibold text-slate-900 group-hover:text-blue-600">
                  {track.title}
                </h3>
                {track.description ? (
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                    {track.description}
                  </p>
                ) : null}
                <span className="mt-4 text-sm font-medium text-blue-600">
                  View courses →
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/tracks"
            className="inline-flex rounded-lg border border-slate-300 px-6 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-100"
          >
            View all learning paths
          </Link>
        </div>
      </div>
    </section>
  );
}
