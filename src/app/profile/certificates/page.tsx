import Link from "next/link";
import { requirePageSession } from "@/server/auth/live-session";

export default async function CertificatesPage() {
  await requirePageSession("/profile/certificates");

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Certificates</h1>
      <p className="mt-2 text-slate-600">Your certificates will appear here.</p>
      <Link href="/profile" className="mt-6 inline-block text-[var(--color-accent)] hover:underline">
        ← Back to profile
      </Link>
    </div>
  );
}
