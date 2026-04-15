import Link from "next/link";
import { publicListMentors } from "@/server/content/public.service";

const MENTORS_HOME_LIMIT = 8;

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

/**
 * “Learn from Creative Experts” grid — data from admin Mentors, no photos (text + border only).
 */
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
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Learn from Creative Experts</h2>
          <p className="max-w-xl text-base text-slate-600 lg:mt-1">
            Our mentors are industry leaders excited to share their tools, techniques, and professional journeys with
            you.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {mentors.map((m) => (
            <Link
              key={m.id}
              href={`/mentors/${m.id}`}
              className="group flex min-h-[200px] flex-col justify-end rounded-xl border-2 border-black bg-white p-4 text-left no-underline transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/40"
            >
              <span
                className="mb-2 text-[11px] font-normal uppercase tracking-wide text-slate-500"
                style={{ fontFamily: pangeaFont }}
              >
                Meet
              </span>
              <p
                className="text-lg font-bold uppercase leading-tight text-black"
                style={{ fontFamily: pangeaFont }}
              >
                {m.name.trim().replace(/\s+/g, " ")}
              </p>
              <p className="mt-2 text-sm font-normal capitalize text-black" style={{ fontFamily: pangeaFont }}>
                {m.certificateName?.trim() || "Mentor"}
              </p>
              <span className="sr-only">View profile</span>
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
