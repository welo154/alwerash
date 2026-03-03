import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { publicListMentors } from "@/server/content/public.service";

export const metadata: Metadata = {
  title: "Mentors",
  description: "Learn from creative experts. Our mentors are industry leaders excited to share their tools, techniques, and professional journeys with you.",
};

export default async function MentorsPage() {
  const mentors = await publicListMentors();

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Section header - Skillshare style */}
        <div className="mb-10 flex flex-col gap-4 sm:mb-12 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Learn from Creative Experts
          </h1>
          <p className="max-w-xl text-base text-slate-600 lg:mt-1">
            Our mentors are industry leaders excited to share their tools, techniques, and professional journeys with you.
          </p>
        </div>

        {/* Mentor grid */}
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
              {/* Bottom overlay: MEET pill + name + title */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent pt-16 pb-4 px-4">
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

        {mentors.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-600">
            No mentors yet. Check back soon.
          </div>
        )}
      </div>
    </div>
  );
}
