import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, adminToken, isAdmin, passwordMatches } from "@/lib/admin";
import { getSupabase } from "@/lib/supabase";

export const metadata: Metadata = { title: "Busla · Organizer dashboard", robots: { index: false } };
export const dynamic = "force-dynamic";

async function login(formData: FormData) {
  "use server";
  const token = adminToken();
  if (token && passwordMatches(String(formData.get("password") ?? ""))) {
    (await cookies()).set(ADMIN_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 12 });
    redirect("/admin");
  }
  redirect("/admin?e=1");
}

async function logout() {
  "use server";
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin");
}

type Reg = {
  ticket_code: string;
  role: string;
  full_name: string;
  email: string;
  phone: string;
  school: string | null;
  grade: string | null;
  interests: string[];
  attendees: number;
  created_at: string;
};

export default async function Admin({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams;

  if (!(await isAdmin())) {
    return (
      <main className="grid min-h-screen place-items-center px-4">
        <form action={login} className="card-pop w-full max-w-sm space-y-4 rounded-3xl bg-cream p-8">
          <h1 className="display text-3xl">Organizer login</h1>
          {!process.env.ADMIN_PASSWORD && <p className="text-sm text-brick">Set ADMIN_PASSWORD in your environment to enable this page.</p>}
          {e && <p className="text-sm font-medium text-brick">Wrong password.</p>}
          <input name="password" type="password" className="field" placeholder="Password" aria-label="Password" />
          <button className="btn w-full justify-center bg-ink text-cream">Enter</button>
        </form>
      </main>
    );
  }

  const supabase = getSupabase();
  if (!supabase) return <main className="p-10">Supabase isn&apos;t configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.</main>;

  const [{ data: regs, count }, { data: msgs }] = await Promise.all([
    supabase
      .from("registrations")
      .select("ticket_code, role, full_name, email, phone, school, grade, interests, attendees, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(500),
    supabase.from("contact_messages").select("topic, name, email, organization, message, created_at").order("created_at", { ascending: false }).limit(50),
  ]);
  const rows = (regs ?? []) as Reg[];
  const seats = rows.reduce((n, r) => n + (r.attendees ?? 1), 0);
  const byRole = rows.reduce<Record<string, number>>((acc, r) => ({ ...acc, [r.role]: (acc[r.role] ?? 0) + 1 }), {});
  const interestCounts = Object.entries(
    rows.flatMap((r) => r.interests ?? []).reduce<Record<string, number>>((acc, i) => ({ ...acc, [i]: (acc[i] ?? 0) + 1 }), {}),
  ).sort((a, b) => b[1] - a[1]);

  return (
    <main className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="display text-4xl">Busla dashboard</h1>
        <div className="flex gap-3">
          <a href="/api/admin/export" className="btn bg-saffron !py-2">
            Export CSV
          </a>
          <form action={logout}>
            <button className="btn bg-cream !py-2">Log out</button>
          </form>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          ["Registrations", count ?? rows.length, "bg-saffron"],
          ["Seats (incl. guests)", seats, "bg-lime"],
          ["Students", byRole.student ?? 0, "bg-sky"],
          ["Parents & educators", (byRole.parent ?? 0) + (byRole.educator ?? 0), "bg-rose"],
        ].map(([l, v, c]) => (
          <div key={l as string} className={`card-pop rounded-3xl p-5 ${c}`}>
            <p className="display text-4xl">{v}</p>
            <p className="font-medium">{l}</p>
          </div>
        ))}
      </div>

      {interestCounts.length > 0 && (
        <section>
          <h2 className="display text-2xl">Top interests</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {interestCounts.map(([i, n]) => (
              <span key={i} className="rounded-full border-2 border-ink bg-cream px-3 py-1 text-sm font-medium">
                {i} · {n}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="overflow-x-auto rounded-3xl border-2 border-ink bg-cream">
        <table className="w-full min-w-[56rem] text-left text-sm">
          <thead className="bg-ink text-cream">
            <tr>
              {["Ticket", "Name", "Role", "Email", "Phone", "School", "Grade", "Guests", "Registered"].map((h) => (
                <th key={h} className="px-3 py-2 font-bold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.ticket_code} className="border-t border-ink/15">
                <td className="px-3 py-2 font-[family-name:var(--font-mono)]">{r.ticket_code}</td>
                <td className="px-3 py-2 font-medium">{r.full_name}</td>
                <td className="px-3 py-2 capitalize">{r.role}</td>
                <td className="px-3 py-2">{r.email}</td>
                <td className="px-3 py-2">{r.phone}</td>
                <td className="px-3 py-2">{r.school}</td>
                <td className="px-3 py-2">{r.grade}</td>
                <td className="px-3 py-2">{r.attendees}</td>
                <td className="px-3 py-2">{new Date(r.created_at).toLocaleString("en-GB", { timeZone: "Africa/Cairo" })}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-ink-2">
                  No registrations yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="display text-2xl">Latest messages</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {(msgs ?? []).map((m, i) => (
            <article key={i} className="rounded-3xl border-2 border-ink bg-cream p-5">
              <p className="eyebrow text-nile">
                {m.topic} · {new Date(m.created_at).toLocaleDateString("en-GB")}
              </p>
              <p className="mt-1 font-bold">
                {m.name} {m.organization && <span className="font-normal">({m.organization})</span>} ·{" "}
                <a href={`mailto:${m.email}`} className="underline">
                  {m.email}
                </a>
              </p>
              <p className="mt-2 whitespace-pre-wrap text-ink-2">{m.message}</p>
            </article>
          ))}
          {(msgs ?? []).length === 0 && <p className="text-ink-2">No messages yet.</p>}
        </div>
      </section>
    </main>
  );
}
