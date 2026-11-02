import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { contactSchema, fieldErrors } from "@/lib/schemas";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (!rateLimit(`contact:${clientIp(req)}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: "Too many messages. Try again later." }, { status: 429 });
  }
  const parsed = contactSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the highlighted fields.", fields: fieldErrors(parsed.error) }, { status: 400 });
  }
  const { website, ...v } = parsed.data;
  if (website) return NextResponse.json({ ok: true });

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Messaging isn't connected yet." }, { status: 503 });

  const { error } = await supabase.from("contact_messages").insert({
    topic: v.topic,
    name: v.name,
    email: v.email,
    organization: v.organization || null,
    message: v.message,
  });
  if (error) {
    console.error("contact insert failed", error);
    return NextResponse.json({ error: "Couldn't send right now. Please email us instead." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
