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
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Schools</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {schools.map((s) => (
          <Link
            key={s.id}
            href={`/admin/content/schools/${s.id}`}
            className="group card-hover flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md"
          >
            <div className="flex flex-1 flex-col p-4">
              <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{s.slug}</p>
              <div className="mt-auto pt-3">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    s.published
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {s.published ? "Published" : "Draft"}
                </span>
              </div>
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
