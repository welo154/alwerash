import Link from "next/link";
import Image from "next/image";
import { requireRole } from "@/server/auth/require";
import { adminListTracks } from "@/server/content/admin.service";
import { AdminTracksPageClient } from "./AdminTracksPage";
import { CreateTrackForm } from "./CreateTrackForm";

type TrackItem = Awaited<ReturnType<typeof adminListTracks>>[number];

export default async function AdminTracksPage({
  searchParams,
}: {
  searchParams: Promise<{ add?: string }>;
}) {
  await requireRole(["ADMIN"]);
  const tracks = await adminListTracks();
  const params = await searchParams;
  const showAddModal = params?.add === "1";

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-black">Tracks</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {tracks.map((t) => (
          <Link
            key={t.id}
            href={`/admin/content/tracks/${t.id}`}
            className="group flex h-[340px] max-w-[300px] flex-col rounded-[24px] border border-gray-100 bg-gray-200 p-4 font-sans text-left shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative mb-3 h-[140px] w-full shrink-0 overflow-hidden rounded-[16px] bg-slate-200">
              {t.coverImage ? (
                <Image
                  src={t.coverImage}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  sizes="320px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-300 text-4xl font-black text-slate-400">
                  {t.title.charAt(0)}
                </div>
              )}
            </div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-[22px] font-black leading-tight tracking-tight text-black uppercase">
                {t.title}
              </h3>
            </div>
            <div className="mb-4">
              <span className="inline-block rounded-full bg-gray-400 px-3 py-1 text-sm font-medium italic text-white">
                {t.school?.title ?? t.schoolId ?? "No school"}
              </span>
            </div>
            <p className="mb-2 text-[11px] font-medium leading-[1.3] text-black">
              {t.slug}
            </p>
            <div className="mt-auto flex items-center justify-between">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                  t.published ? "bg-gray-400 text-white" : "bg-slate-300 text-slate-600"
                }`}
              >
                {t.published ? "Published" : "Draft"}
              </span>
              <span className="text-sm font-bold text-black group-hover:text-[var(--color-primary)]">Manage →</span>
            </div>
          </Link>
        ))}
        <AdminTracksPageClient
          showAddModal={showAddModal}
          createForm={<CreateTrackForm />}
        />
      </div>
    </div>
  );
}
