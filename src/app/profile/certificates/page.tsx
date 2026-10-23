import Link from "next/link";
import { requirePageSession } from "@/server/auth/live-session";
import { certificatePath, listCertificatesForUser } from "@/server/certificates/certificate.service";

export default async function CertificatesPage() {
  const session = await requirePageSession("/profile/certificates");
  const certificates = await listCertificatesForUser(session.user.id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Certificates</h1>
      {certificates.length === 0 ? (
        <p className="mt-2 text-slate-600">
          You get a certificate when your mentor approves your final assignment.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {certificates.map((c) => (
            <li
              key={c.code}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4"
            >
              <div>
                <p className="font-semibold text-slate-900">{c.courseTitle}</p>
                <p className="text-sm text-slate-500">
                  Issued {c.issuedAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  {" · "}ID {c.code}
                </p>
              </div>
              <Link
                href={certificatePath(c.code)}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                View certificate
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link href="/profile" className="mt-6 inline-block text-[var(--color-accent)] hover:underline">
        ← Back to profile
      </Link>
    </div>
  );
}
