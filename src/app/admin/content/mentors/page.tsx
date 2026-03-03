import Link from "next/link";
import Image from "next/image";
import { Prisma } from "@prisma/client";
import { requireRole } from "@/server/auth/require";
import { adminListMentors } from "@/server/content/admin.service";
import { MentorsAddCard } from "./MentorsAddCard";

export default async function AdminMentorsPage() {
  await requireRole(["ADMIN"]);
  let mentors: Awaited<ReturnType<typeof adminListMentors>> = [];
  let tableMissing = false;
  try {
    mentors = await adminListMentors();
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2021") {
      mentors = [];
      tableMissing = true;
    } else {
      throw e;
    }
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-black">Mentors</h1>

      {tableMissing && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <strong>Mentors table not set up.</strong> Run in your project:{" "}
          <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">npx prisma migrate deploy</code>
          , then refresh this page.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {mentors.map((m) => (
          <Link
            key={m.id}
            href={`/admin/content/mentors/${m.id}`}
            className="group relative flex h-[280px] max-w-[260px] overflow-hidden rounded-[24px] border border-gray-100 bg-gray-200 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Photo fills the card */}
            <div className="absolute inset-0">
              {m.photo ? (
                <Image
                  src={m.photo}
                  alt={m.name}
                  fill
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                  unoptimized
                  sizes="260px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-300 text-4xl font-black text-slate-500">
                  {m.name.charAt(0)}
                </div>
              )}
            </div>
            {/* Name mask overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent pt-12 pb-4 px-4">
              <span className="text-lg font-bold leading-tight text-white drop-shadow-sm">
                {m.name}
              </span>
            </div>
          </Link>
        ))}
        {!tableMissing && <MentorsAddCard />}
      </div>
    </div>
  );
}
