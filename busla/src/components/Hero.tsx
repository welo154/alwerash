"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import QRCode from "qrcode";
import { useEffect, useMemo, useRef, useState } from "react";
import { EVENT } from "@/lib/event";
import { CountdownTiles } from "./Countdown";
import { Magnetic } from "./Magnetic";
import { Sparkle } from "./Sparkle";

const ease = [0.16, 1, 0.3, 1] as const;

/** Real QR code pointing at the registration form, drawn as SVG rects. */
function QR({ className = "" }: { className?: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => setUrl(`${window.location.origin}/#register`), []);
  const cells = useMemo(() => {
    if (!url) return null;
    const qr = QRCode.create(url, { errorCorrectionLevel: "M" });
    const size = qr.modules.size;
    const rects: { x: number; y: number }[] = [];
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (qr.modules.get(y, x)) rects.push({ x, y });
    return { size, rects };
  }, [url]);

  return (
    <svg
      viewBox={cells ? `-1 -1 ${cells.size + 2} ${cells.size + 2}` : "0 0 10 10"}
      className={className}
      role="img"
      aria-label="QR code that opens the registration form"
      shapeRendering="crispEdges"
    >
      {cells?.rects.map((r) => <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width="1" height="1" fill="var(--color-ink)" />)}
    </svg>
  );
}

function Ticket() {
  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 15 });
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 15 });

  return (
    <motion.div
      className="relative mx-auto w-full max-w-[38rem] [perspective:1200px]"
      initial={{ opacity: 0, y: 80, rotate: 8 }}
      animate={{ opacity: 1, y: 0, rotate: -3 }}
      transition={{ type: "spring", stiffness: 70, damping: 13, delay: 0.35 }}
    >
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          ry.set(((e.clientX - r.left) / r.width - 0.5) * 14);
          rx.set(-((e.clientY - r.top) / r.height - 0.5) * 14);
        }}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
        }}
        className="flex rounded-[2rem] border-4 border-ink bg-cream shadow-[12px_12px_0_var(--color-ink)]"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-3 border-r-4 border-dashed border-ink p-5 sm:gap-4 sm:p-7">
          <span className="display self-start rounded-lg border-[3px] border-ink bg-lime px-3 pb-0.5 pt-1.5 text-base sm:text-lg">Limited seats</span>
          <div>
            <p className="display text-5xl text-brick sm:text-6xl">0 EGP</p>
            <p className="text-sm font-extrabold sm:text-base">100% free · ticket code on sign-up</p>
          </div>
          <div className="border-t-[3px] border-dotted border-ink" />
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:text-base">
            <div>
              <dt className="eyebrow !text-[0.65rem] font-bold text-nile">Date</dt>
              <dd className="font-extrabold">Sat 13 Feb 2027</dd>
            </div>
            <div>
              <dt className="eyebrow !text-[0.65rem] font-bold text-nile">Time</dt>
              <dd className="font-extrabold">{EVENT.hours.replace(":00", "").replace(":00", "")}</dd>
            </div>
            <div className="col-span-2">
              <dt className="eyebrow !text-[0.65rem] font-bold text-nile">Venue</dt>
              <dd className="font-extrabold">
                {EVENT.venue}, {EVENT.area}
              </dd>
            </div>
          </dl>
          <div>
            <p className="eyebrow mb-1.5 !text-[0.65rem] font-bold text-nile">Doors open in</p>
            <CountdownTiles />
          </div>
        </div>
        <div className="relative flex w-28 shrink-0 flex-col items-center justify-center gap-3 rounded-r-[1.75rem] bg-saffron p-3 sm:w-40">
          <span aria-hidden className="absolute -left-[22px] -top-[22px] h-10 w-10 rounded-full border-4 border-ink bg-sky" />
          <span aria-hidden className="absolute -bottom-[22px] -left-[22px] h-10 w-10 rounded-full border-4 border-ink bg-sky" />
          <a href="#register" className="rounded-xl border-[3px] border-ink bg-cream p-1.5 transition-transform hover:scale-105">
            <QR className="h-20 w-20 sm:h-28 sm:w-28" />
          </a>
          <p className="display text-center text-lg leading-none sm:text-xl">
            Scan to
            <br />
            register
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const ticketY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section ref={ref} id="top" className="dots relative overflow-hidden bg-sky pb-24 pt-[110px] sm:pt-[130px]">
      <Sparkle size={64} className="absolute left-[46%] top-[120px] hidden lg:block" delay={0.9} />
      <Sparkle size={42} fill="var(--color-cream)" className="absolute bottom-16 left-6" delay={1.1} />
      <Sparkle size={100} fill="var(--color-lime)" className="absolute bottom-10 right-8 hidden sm:block" delay={1.3} />

      <div className="relative mx-auto grid max-w-[90rem] items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:px-10">
        <motion.div style={{ y: titleY }} className="relative z-10">
          <motion.p
            className="eyebrow inline-block rounded-full border-2 border-ink bg-cream px-3.5 py-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            University &amp; career discovery day · {EVENT.edition}
          </motion.p>

          <h1 className="display mt-6 flex flex-col items-start gap-2 text-[clamp(4.6rem,12vw,9rem)] sm:gap-3">
            <motion.span initial={{ x: -80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.9, ease, delay: 0.1 }}>
              Find
            </motion.span>
            <motion.span
              className="rounded-[0.16em] border-4 border-ink bg-saffron px-[0.18em] pt-[0.08em] shadow-[0.06em_0.06em_0_var(--color-ink)]"
              initial={{ scale: 0, rotate: 12 }}
              animate={{ scale: 1, rotate: -2 }}
              transition={{ type: "spring", stiffness: 160, damping: 11, delay: 0.3 }}
              whileHover={{ rotate: 2, scale: 1.03 }}
            >
              your
            </motion.span>
            <motion.span
              className="outline-type"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease, delay: 0.5 }}
            >
              north
            </motion.span>
          </h1>

          <motion.p
            className="mt-7 max-w-xl text-lg leading-relaxed sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65, ease }}
          >
            One day of universities, taster labs, career simulations and real mentors for high-schoolers in Grades 9–12.{" "}
            <span className="hl">Free this year</span>.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease }}
          >
            <Magnetic>
              <a href="#register" className="btn bg-saffron text-xl">
                Register for free
              </a>
            </Magnetic>
            <a href="#venue" className="text-lg font-extrabold underline decoration-[3px] underline-offset-[7px] hover:text-brick">
              Venue &amp; directions
            </a>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: ticketY }} className="relative">
          <Ticket />
          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start lg:pl-12"
            initial={{ opacity: 0, y: 20, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: -3 }}
            transition={{ delay: 1.2, duration: 0.7, ease }}
          >
            <span lang="ar" className="rounded-full border-[3px] border-ink bg-rose px-5 py-1 font-[family-name:var(--font-arabic)] text-3xl font-bold">
              بوصلة
            </span>
            <span className="serif-i text-3xl">is Arabic for compass.</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
