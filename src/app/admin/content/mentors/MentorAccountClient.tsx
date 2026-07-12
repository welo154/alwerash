"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  mentorId: string;
  linkedEmail: string | null;
};

export function MentorAccountClient({ mentorId, linkedEmail }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [createdEmail, setCreatedEmail] = useState<string | null>(null);

  async function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setTempPassword(null);
    setCreatedEmail(null);
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") ?? "").trim();
    const name = String(new FormData(form).get("name") ?? "").trim() || undefined;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/mentors/${mentorId}/account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.message === "string" ? data.message : "Could not create account.");
        return;
      }
      setTempPassword(typeof data.temporaryPassword === "string" ? data.temporaryPassword : null);
      setCreatedEmail(typeof data.user?.email === "string" ? data.user.email : email);
      form.reset();
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-8 max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Mentor login</h2>
      <p className="mt-1 text-sm text-slate-600">
        Create portal credentials for this mentor. They will see courses where this mentor is assigned
        on the course record.
      </p>

      {linkedEmail ? (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <p className="font-medium">Account linked</p>
          <p className="mt-1">{linkedEmail}</p>
          <p className="mt-2 text-emerald-800">
            Mentor can sign in at <code className="rounded bg-emerald-100 px-1">/login</code> and will
            land on the mentor portal.
          </p>
        </div>
      ) : (
        <form onSubmit={onCreate} className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Display name (optional)</label>
            <input
              name="name"
              type="text"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Creating…" : "Create login"}
          </button>
        </form>
      )}

      {tempPassword ? (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="font-medium">Temporary password (copy now — shown once)</p>
          <p className="mt-1 font-mono text-base">{tempPassword}</p>
          {createdEmail ? <p className="mt-2">Login: {createdEmail}</p> : null}
        </div>
      ) : null}
    </section>
  );
}
