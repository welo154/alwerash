"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { CURRICULA, EVENT, GRADES, HEARD_FROM, INTERESTS } from "@/lib/event";
import { Reveal } from "./Reveal";
import { openMentor } from "./colors";

type Role = "student" | "parent" | "educator";
type Errors = Record<string, string>;

const ROLES: { id: Role; label: string; color: string }[] = [
  { id: "student", label: "I'm a student", color: "bg-saffron" },
  { id: "parent", label: "I'm a parent", color: "bg-rose" },
  { id: "educator", label: "I'm an educator", color: "bg-sky" },
];

function icsHref(ticket: string) {
  const start = new Date(EVENT.date);
  const end = new Date(start.getTime() + 7 * 3600_000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Busla//EN",
    "BEGIN:VEVENT",
    `UID:${ticket}@busla`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${EVENT.name}: University & Career Discovery Day`,
    `LOCATION:${EVENT.venue}\\, ${EVENT.area}`,
    `DESCRIPTION:Your ticket code: ${ticket}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

function Field({ label, error, children, hint }: { label: string; error?: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold">
        {label} {hint && <span className="font-normal text-ink-2">· {hint}</span>}
      </span>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1 block text-sm font-medium text-brick"
            role="alert"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}

function Ticket({ ticket, name, existing }: { ticket: string; name?: string; existing?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, rotate: -8, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, rotate: -2, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
      className="mx-auto max-w-lg"
    >
      <div className="card-pop flex overflow-hidden rounded-[1.75rem] bg-cream">
        <div className="flex-1 p-7">
          <p className="eyebrow text-nile">{existing ? "You're already in" : "You're in"}</p>
          <p className="display mt-2 text-4xl">{name ? `See you there, ${name}!` : "See you there!"}</p>
          <p className="mt-3 text-ink-2">
            {EVENT.dateLabel} · {EVENT.hours}
            <br />
            {EVENT.venue}, {EVENT.area}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={icsHref(ticket)} download="busla.ics" className="btn bg-saffron !px-4 !py-2 text-sm">
              Add to calendar
            </a>
            <button onClick={() => openMentor("I just registered for Busla! Help me plan my day.")} className="btn bg-rose !px-4 !py-2 text-sm">
              Plan my day 🧭
            </button>
          </div>
        </div>
        <div className="relative flex w-28 flex-col items-center justify-center border-l-2 border-dashed border-ink bg-brick p-3 text-cream sm:w-36">
          <span aria-hidden className="absolute -left-[13px] -top-3 h-6 w-6 rounded-full border-2 border-ink bg-paper" />
          <span aria-hidden className="absolute -bottom-3 -left-[13px] h-6 w-6 rounded-full border-2 border-ink bg-paper" />
          <span className="eyebrow !text-[0.6rem] opacity-80">Ticket</span>
          <span className="mt-2 font-[family-name:var(--font-mono)] text-lg font-bold [writing-mode:vertical-rl] sm:text-xl">{ticket}</span>
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-ink-2">Screenshot this. Show the code at the door.</p>
    </motion.div>
  );
}

export function Register() {
  const [role, setRole] = useState<Role>("student");
  const [interests, setInterests] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState<{ ticket: string; name?: string; existing?: boolean } | null>(null);

  const toggle = (i: string) => setInterests((cur) => (cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]));

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      role,
      fullName: fd.get("fullName"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      school: fd.get("school") || "",
      grade: fd.get("grade") || undefined,
      curriculum: fd.get("curriculum") || undefined,
      interests,
      guardianPhone: fd.get("guardianPhone") || "",
      heardFrom: fd.get("heardFrom") || undefined,
      attendees: fd.get("attendees") || 1,
      consent: fd.get("consent") === "on",
      website: fd.get("website") || "",
    };
    setStatus("sending");
    setErrors({});
    setMessage("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setDone({ ticket: data.ticket, name: data.name });
        setStatus("idle");
        return;
      }
      if (res.status === 409 && data.ticket) {
        setDone({ ticket: data.ticket, existing: true });
        setStatus("idle");
        return;
      }
      setErrors(data.fields ?? {});
      setMessage(data.error ?? "Something went wrong.");
      setStatus("error");
    } catch {
      setMessage("Network hiccup. Check your connection and try again.");
      setStatus("error");
    }
  }

  return (
    <section id="register" className="relative overflow-hidden border-y-4 border-ink bg-nile py-24 text-cream sm:py-32">
      <div aria-hidden className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-saffron" />
      <div aria-hidden className="absolute -left-10 bottom-10 h-40 w-40 rotate-12 bg-brick" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <p className="eyebrow text-saffron">Registration · Free</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="display mt-4 text-5xl sm:text-7xl">
              Grab your spot <span className="serif-i font-normal text-saffron">before</span> the labs fill up.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <ul className="mt-8 space-y-3 text-lg">
              {["Free entry, instant ticket code", "Priority seats in taster labs", "Shuttle routes sent a week before", "Parents can register too"].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-lime text-sm font-bold text-ink">✓</span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="text-ink">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-10">
                <Ticket {...done} />
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={submit}
                noValidate
                exit={{ opacity: 0, scale: 0.96, rotate: 2 }}
                className="card-pop space-y-6 rounded-[2rem] bg-paper p-6 sm:p-9"
              >
                <div className="grid grid-cols-3 gap-2 rounded-full border-2 border-ink bg-cream p-1.5" role="radiogroup" aria-label="I am">
                  {ROLES.map((r) => (
                    <button
                      type="button"
                      key={r.id}
                      role="radio"
                      aria-checked={role === r.id}
                      onClick={() => setRole(r.id)}
                      className="relative rounded-full px-2 py-2.5 text-xs font-bold sm:text-sm"
                    >
                      {role === r.id && (
                        <motion.span layoutId="role-pill" className={`absolute inset-0 rounded-full border-2 border-ink ${r.color}`} transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                      )}
                      <span className="relative">{r.label}</span>
                    </button>
                  ))}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" error={errors.fullName}>
                    <input name="fullName" className="field" autoComplete="name" aria-invalid={!!errors.fullName} required />
                  </Field>
                  <Field label="Email" error={errors.email}>
                    <input name="email" type="email" className="field" autoComplete="email" aria-invalid={!!errors.email} required />
                  </Field>
                  <Field label="Mobile (WhatsApp)" error={errors.phone}>
                    <input name="phone" type="tel" inputMode="tel" placeholder="01x xxxx xxxx" className="field" autoComplete="tel" aria-invalid={!!errors.phone} required />
                  </Field>
                  <Field label={role === "student" ? "School" : role === "parent" ? "Your child's school" : "School / organization"} error={errors.school} hint={role === "student" ? undefined : "optional"}>
                    <input name="school" className="field" aria-invalid={!!errors.school} />
                  </Field>

                  <AnimatePresence initial={false}>
                    {role !== "educator" && (
                      <motion.div key="grade" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                        <Field label={role === "student" ? "Grade" : "Child's grade"} error={errors.grade} hint={role === "student" ? undefined : "optional"}>
                          <select name="grade" className="field" defaultValue="" aria-invalid={!!errors.grade}>
                            <option value="" disabled>
                              Select…
                            </option>
                            {GRADES.map((g) => (
                              <option key={g}>{g}</option>
                            ))}
                          </select>
                        </Field>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <Field label="Curriculum" hint="optional">
                    <select name="curriculum" className="field" defaultValue="">
                      <option value="">Select…</option>
                      {CURRICULA.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </Field>
                  {role === "student" && (
                    <Field label="Parent / guardian mobile" hint="optional" error={errors.guardianPhone}>
                      <input name="guardianPhone" type="tel" inputMode="tel" className="field" />
                    </Field>
                  )}
                  <Field label="How many people are coming?" hint="incl. you">
                    <select name="attendees" className="field" defaultValue="1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n}>{n}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <fieldset>
                  <legend className="mb-2 text-sm font-bold">
                    What are you curious about? <span className="font-normal text-ink-2">· pick any</span>
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS.map((i) => {
                      const on = interests.includes(i);
                      return (
                        <motion.button
                          type="button"
                          key={i}
                          onClick={() => toggle(i)}
                          whileTap={{ scale: 0.92 }}
                          aria-pressed={on}
                          className={`rounded-full border-2 border-ink px-3.5 py-1.5 text-sm font-medium transition-colors ${
                            on ? "bg-ink text-saffron" : "bg-cream hover:bg-lime"
                          }`}
                        >
                          {on ? "✓ " : "+ "}
                          {i}
                        </motion.button>
                      );
                    })}
                  </div>
                </fieldset>

                <Field label="How did you hear about Busla?" hint="optional">
                  <select name="heardFrom" className="field" defaultValue="">
                    <option value="">Select…</option>
                    {HEARD_FROM.map((h) => (
                      <option key={h}>{h}</option>
                    ))}
                  </select>
                </Field>

                {/* honeypot */}
                <input name="website" tabIndex={-1} autoComplete="off" className="absolute left-[-9999px] h-0 w-0 opacity-0" aria-hidden />

                <label className="flex items-start gap-3 text-sm">
                  <input name="consent" type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-nile)]" />
                  <span>
                    I agree that Busla can contact me about this event. Students under 18: you confirm a parent or guardian
                    knows you&apos;re registering.
                    {errors.consent && <span className="mt-1 block font-medium text-brick">{errors.consent}</span>}
                  </span>
                </label>

                <AnimatePresence>
                  {message && (
                    <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-xl border-2 border-brick bg-brick/10 px-4 py-3 font-medium text-brick" role="alert">
                      {message}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button type="submit" disabled={status === "sending"} className="btn w-full justify-center bg-brick text-lg text-cream disabled:opacity-60">
                  {status === "sending" ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-cream border-t-transparent" /> Saving your spot…
                    </>
                  ) : (
                    <>Register for free →</>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
