import { isAdmin } from "@/lib/admin";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const esc = (v: unknown) => {
  let s = Array.isArray(v) ? v.join("; ") : v == null ? "" : String(v);
  if (/^[=+\-@]/.test(s)) s = `'${s}`; // spreadsheet formula injection guard
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET() {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });
  const supabase = getSupabase();
  if (!supabase) return new Response("Supabase not configured", { status: 503 });

  const cols = ["ticket_code", "role", "full_name", "email", "phone", "school", "grade", "curriculum", "interests", "guardian_phone", "heard_from", "attendees", "created_at"];
  const all: Record<string, unknown>[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from("registrations").select(cols.join(",")).order("created_at").range(from, from + 999);
    if (error) return new Response(error.message, { status: 500 });
    all.push(...((data ?? []) as unknown as Record<string, unknown>[]));
    if (!data || data.length < 1000) break;
  }
  const csv = "﻿" + [cols.join(","), ...all.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\r\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="busla-registrations-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
