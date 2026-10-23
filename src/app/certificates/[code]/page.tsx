import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CertificateDocument } from "@/components/certificates/CertificateDocument";
import { PrintCertificateButton } from "@/components/certificates/PrintCertificateButton";
import { certificatePath, getCertificateByCode } from "@/server/certificates/certificate.service";
import { getAppBaseUrl } from "@/server/email/resend.client";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const certificate = await getCertificateByCode(code);
  if (!certificate) return { title: "Certificate not found | Alwerash", robots: { index: false } };
  const title = `${certificate.recipientName} — ${certificate.courseTitle} | Alwerash Certificate`;
  return {
    title,
    description: `${certificate.recipientName} completed ${certificate.courseTitle} on Alwerash.`,
    openGraph: { title },
  };
}

export default async function CertificateVerifyPage({ params }: Props) {
  const { code } = await params;
  const certificate = await getCertificateByCode(code);
  if (!certificate) notFound();

  const verifyUrl = `${getAppBaseUrl()}${certificatePath(certificate.code)}`;
  const issued = certificate.issuedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-[1100px] space-y-6">
        <section className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-emerald-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <span
              aria-hidden
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white"
            >
              ✓
            </span>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Verified certificate</h1>
              <p className="mt-1 text-sm text-slate-600">
                Alwerash confirms that <strong>{certificate.recipientName}</strong> completed{" "}
                <strong>{certificate.courseTitle}</strong> on {issued}
                {certificate.mentorName ? <>, approved by mentor {certificate.mentorName}</> : null}.
              </p>
              <p className="mt-1 text-xs text-slate-500">Certificate ID: {certificate.code}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {certificate.course.published ? (
              <Link
                href={`/course/${certificate.course.id}`}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                View course
              </Link>
            ) : null}
            <PrintCertificateButton />
          </div>
        </section>

        <CertificateDocument
          recipientName={certificate.recipientName}
          courseTitle={certificate.courseTitle}
          mentorName={certificate.mentorName}
          mentorTitle={certificate.mentorTitle}
          signatureImage={certificate.signatureImage}
          issuedAt={certificate.issuedAt}
          code={certificate.code}
          verifyUrl={verifyUrl}
        />
      </div>
    </main>
  );
}
