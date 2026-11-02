"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { EVENT } from "@/lib/event";
import { Reveal } from "./Reveal";

const TOPICS = ["General", "Partner university", "Sponsor", "Media", "Volunteer"] as const;

export function Contact() {
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>("General");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setState("sending");
    setErrors({});
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, ...Object.fromEntries(fd) }),
      });
      const data = await res.json();
      if (res.ok) {
        setState("sent");
        form.reset();
        return;
      }
      setErrors(data.fields ?? {});
      setMsg(data.error ?? "Couldn't send.");
      setState("error");
    } catch {
      setMsg("Network hiccup. Try again.");
      setState("error");
    }
  }

  return (
    <section id="contact" className="border-t-4 border-ink bg-saffron py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="eyebrow">Contact</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="display mt-3 text-5xl sm:text-7xl">
              Say <span className="serif-i font-normal">ahlan.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2} className="mt-8 space-y-4 text-lg">
            <p>
              Universities, sponsors, schools, volunteers, journalists: tell us who you are and we&apos;ll get back within
              two working days.
            </p>
            <p className="space-y-1">
              <a href={`mailto:${EVENT.email}`} className="block font-bold underline decoration-2 underline-offset-4">
                {EVENT.email}
              </a>
              <a href={`tel:${EVENT.phone.replace(/\s/g, "")}`} className="block font-bold">
                {EVENT.phone}
              </a>
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <AnimatePresence mode="wait">
            {state === "sent" ? (
              <motion.div
                key="sent"
                initial={{ scale: 0.8, opacity: 0, rotate: -4 }}
                animate={{ scale: 1, opacity: 1, rotate: 2 }}
                className="card-pop grid min-h-80 place-items-center rounded-[2rem] bg-cream p-10 text-center"
              >
                <div>
                  <p className="text-6xl">✉︎</p>
                  <p className="display mt-4 text-4xl">Message received.</p>
                  <button onClick={() => setState("idle")} className="mt-6 font-bold underline underline-offset-4">
                    Send another
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0 }} className="card-pop space-y-5 rounded-[2rem] bg-cream p-6 sm:p-8">
                <div className="flex flex-wrap gap-2">
                  {TOPICS.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setTopic(t)}
                      aria-pressed={topic === t}
                      className={`rounded-full border-2 border-ink px-3.5 py-1.5 text-sm font-bold transition-colors ${topic === t ? "bg-ink text-cream" : "hover:bg-rose"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input name="name" placeholder="Your name" className="field" aria-invalid={!!errors.name} aria-label="Your name" />
                  <input name="email" type="email" placeholder="Email" className="field" aria-invalid={!!errors.email} aria-label="Email" />
                </div>
                <input name="organization" placeholder="Organization (optional)" className="field" aria-label="Organization" />
                <textarea name="message" rows={5} placeholder="How can we help?" className="field resize-none" aria-invalid={!!errors.message} aria-label="Message" />
                <input name="website" tabIndex={-1} autoComplete="off" className="absolute left-[-9999px] h-0 w-0 opacity-0" aria-hidden />
                {state === "error" && (
                  <p className="font-medium text-brick" role="alert">
                    {Object.values(errors)[0] ?? msg}
                  </p>
                )}
                <button disabled={state === "sending"} className="btn w-full justify-center bg-ink text-cream disabled:opacity-60">
                  {state === "sending" ? "Sending…" : "Send message →"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
