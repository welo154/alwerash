import Link from "next/link";
import Image from "next/image";
import { publicListTracks } from "@/server/content/public.service";

export async function TracksSection() {
  const tracks = await publicListTracks();

  if (tracks.length === 0) return null;

  return (
    <section className="border-b border-slate-200/80 bg-white px-4 py-16 sm:px-6" data-gsap-reveal>
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Learning paths
        </h2>
        <p className="mt-2.5 text-slate-600 leading-relaxed">
          Start with a track that matches your goals.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-gsap-stagger-group>
          {tracks.slice(0, 6).map((track) => (
            <Link
              key={track.id}
              href={`/tracks/${track.slug}`}
              className="group card-hover overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[var(--shadow-card)] transition-shadow duration-300 hover:border-blue-300/80 hover:shadow-[var(--shadow-card-hover)]"
              data-gsap-hover
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
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                    {track.school.title}
                  </span>
                ) : null}
                <h3 className="mt-2.5 text-lg font-bold tracking-tight text-slate-900 transition-colors group-hover:text-blue-600">
                  {track.title}
                </h3>
                {track.description ? (
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                    {track.description}
                  </p>
                ) : null}
                <span className="mt-5 inline-block text-sm font-semibold text-blue-600 transition-colors group-hover:text-blue-700">
                  View courses →
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-14 flex justify-center sm:mt-16">
          <Link
            href="/tracks"
            className="inline-flex items-center rounded-xl border-2 border-slate-200 bg-white px-8 py-3.5 font-semibold text-slate-800 shadow-[var(--shadow-btn)] transition-all duration-200 hover:border-blue-300 hover:bg-slate-50 hover:shadow-[var(--shadow-btn-hover)] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 active:scale-[0.98]"
          >
            View all learning paths
          </Link>
        </div>
      </div>
    </section>
  );
}
