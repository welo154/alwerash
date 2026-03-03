import Image from "next/image";
import Link from "next/link";
import { publicListMentors } from "@/server/content/public.service";

const MENTORS_HOME_LIMIT = 8;

export async function MentorsSection() {
  const allMentors = await publicListMentors();
  const mentors = allMentors.slice(0, MENTORS_HOME_LIMIT);

  if (mentors.length === 0) return null;

  return (
    <section
      className="border-b border-slate-200/80 bg-white px-4 py-16 sm:px-6"
      data-gsap-reveal
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 sm:mb-12 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Learn from Creative Experts
          </h2>
          <p className="max-w-xl text-base text-slate-600 lg:mt-1">
            Our mentors are industry leaders excited to share their tools, techniques, and professional journeys with you.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {mentors.map((m) => (
            <Link
              key={m.id}
              href={`/mentors/${m.id}`}
              className="group relative aspect-square overflow-hidden rounded-xl bg-slate-200 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="absolute inset-0">
                {m.photo ? (
                  <Image
                    src={m.photo}
                    alt={m.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    unoptimized={m.photo.startsWith("http")}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-300 text-5xl font-black text-slate-500">
                    {m.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 via-black/50 to-transparent pt-16 pb-4 px-4">
                <span className="mb-2 inline-block rounded-full bg-pink-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  Meet
                </span>
                <p className="text-lg font-bold leading-tight text-white drop-shadow-sm">
                  {m.name}
                </p>
                {m.certificateName && (
                  <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-white/90">
                    {m.certificateName}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {allMentors.length > MENTORS_HOME_LIMIT && (
          <div className="mt-10 text-center">
            <Link
              href="/mentors"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800 hover:text-white"
            >
              View all mentors
              <span aria-hidden>→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
