import Link from "next/link";
import { requireRole } from "@/server/auth/require";
import { adminListSchools } from "@/server/content/admin.service";
import { AdminSchoolsPageClient } from "./AdminSchoolsPage";
import { CreateSchoolForm } from "./CreateSchoolForm";

export default async function AdminSchoolsPage({
  searchParams,
}: {
  searchParams: Promise<{ add?: string }>;
}) {
  await requireRole(["ADMIN"]);
  const schools = await adminListSchools();
  const params = await searchParams;
  const showAddModal = params?.add === "1";

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-black">Schools</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {schools.map((s) => (
          <Link
            key={s.id}
            href={`/admin/content/schools/${s.id}`}
            className="group flex h-[340px] max-w-[300px] flex-col rounded-[24px] border border-gray-100 bg-gray-200 p-4 font-sans text-left shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative mb-3 flex h-[140px] w-full shrink-0 items-center justify-center overflow-hidden rounded-[16px] bg-slate-200">
              <span className="text-5xl font-black text-slate-400">{s.title.charAt(0)}</span>
            </div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-black leading-tight tracking-tight text-black uppercase">
                {s.title}
              </h3>
            </div>
            <div className="mb-4">
              <span className="inline-block rounded-full bg-gray-400 px-3 py-1 text-sm font-medium italic text-white">
                {s.slug}
              </span>
            </div>
            <div className="min-h-0 flex-1" />
            <div className="mt-auto flex items-center justify-between">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                  s.published ? "bg-gray-400 text-white" : "bg-slate-300 text-slate-600"
                }`}
              >
                {s.published ? "Published" : "Draft"}
              </span>
              <span className="text-sm font-bold text-black group-hover:text-[var(--color-primary)]">Manage →</span>
            </div>
          </Link>
        ))}
        <AdminSchoolsPageClient
          showAddModal={showAddModal}
          createForm={<CreateSchoolForm />}
        />
      </div>
    </div>
  );
}
