import { NextResponse } from "next/server";
import { randomInt } from "node:crypto";
import { getSupabase } from "@/lib/supabase";
import { fieldErrors, registrationSchema } from "@/lib/schemas";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ticketCode = () =>
  "BSL-" + Array.from({ length: 6 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");

export async function POST(req: Request) {
  if (!rateLimit(`reg:${clientIp(req)}`, 8, 10 * 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the highlighted fields.", fields: fieldErrors(parsed.error) }, { status: 400 });
  }
  const v = parsed.data;
  if (v.website) return NextResponse.json({ ticket: ticketCode() }); // bot: pretend success

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Registration isn't connected yet. Please try again soon." }, { status: 503 });
  }

  const row = {
    role: v.role,
    full_name: v.fullName,
    email: v.email,
    phone: v.phone,
    school: v.school || null,
    grade: v.grade ?? null,
    curriculum: v.curriculum ?? null,
    interests: v.interests,
    guardian_phone: v.guardianPhone || null,
    heard_from: v.heardFrom ?? null,
    attendees: v.attendees,
    consent: v.consent,
  };

  for (let attempt = 0; attempt < 3; attempt++) {
    const ticket = ticketCode();
    const { error } = await supabase.from("registrations").insert({ ...row, ticket_code: ticket });
    if (!error) return NextResponse.json({ ticket, name: v.fullName.split(" ")[0] });
    if (error.code === "23505") {
      if (error.message.includes("email")) {
        const { data } = await supabase
          .from("registrations")
          .select("ticket_code")
          .ilike("email", v.email)
          .maybeSingle();
        return NextResponse.json(
          { error: "This email is already registered.", ticket: data?.ticket_code, duplicate: true },
          { status: 409 },
        );
      }
      continue; // ticket collision, retry
    }
    console.error("register insert failed", error);
    break;
  }
  return NextResponse.json({ error: "Something went wrong saving your spot. Please try again." }, { status: 500 });
}
