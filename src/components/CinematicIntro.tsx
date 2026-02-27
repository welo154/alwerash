"use client";

import { useState, useRef, useLayoutEffect, useCallback } from "react";
import gsap from "gsap";

const STORAGE_KEY = "alwerash_intro_seen";
const REDUCED_MOTION_MEDIA = "(prefers-reduced-motion: reduce)";

const CANVAS_W = 800;
const CANVAS_H = 140;
const PARTICLE_COUNT = 320;
const BLOB_RADIUS = 200;
const BLOB_CX = CANVAS_W / 2;
const BLOB_CY = CANVAS_H / 2;

/** Sample (x,y) positions from canvas-rendered text for particle targets. */
function getTextParticleTargets(): { x: number; y: number }[] {
  if (typeof document === "undefined") return [];
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];

  ctx.font = "bold 100px system-ui, -apple-system, sans-serif";
  const metrics = ctx.measureText("ALWERASH");
  const tw = metrics.width;
  const th = 100;
  const tx = (CANVAS_W - tw) / 2;
  const ty = (CANVAS_H - th) / 2 + 10;

  ctx.fillStyle = "white";
  ctx.textBaseline = "top";
  ctx.fillText("ALWERASH", tx, ty);

  const idata = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H);
  const data = idata.data;
  const points: { x: number; y: number }[] = [];
  const step = 2;

  for (let y = 0; y < CANVAS_H; y += step) {
    for (let x = 0; x < CANVAS_W; x += step) {
      const i = (y * CANVAS_W + x) * 4;
      if (data[i + 3] > 128) {
        points.push({ x, y });
        if (points.length >= PARTICLE_COUNT) return points;
      }
    }
  }
  return points;
}

/** Random position inside a circular blob. */
function randomBlobPosition(): { x: number; y: number } {
  const angle = Math.random() * Math.PI * 2;
  const r = BLOB_RADIUS * Math.sqrt(Math.random());
  return {
    x: BLOB_CX + r * Math.cos(angle),
    y: BLOB_CY + r * Math.sin(angle),
  };
}

const FLOAT_ICONS = [
  { id: "book", color: "#3b82f6", path: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20M8 7h8", viewBox: "0 0 24 24" },
  { id: "pen", color: "#f59e0b", path: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", viewBox: "0 0 24 24" },
  { id: "pencil", color: "#10b981", path: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z", viewBox: "0 0 24 24" },
  { id: "grad", color: "#8b5cf6", path: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z", viewBox: "0 0 24 24" },
  { id: "lightbulb", color: "#eab308", path: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", viewBox: "0 0 24 24" },
  { id: "academic", color: "#ec4899", path: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", viewBox: "0 0 24 24" },
  { id: "paint", color: "#06b6d4", path: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01", viewBox: "0 0 24 24" },
  { id: "chart", color: "#84cc16", path: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", viewBox: "0 0 24 24" },
];

/**
 * Cinematic intro: water-like particles → ALWERASH type, floating icons, premium feel.
 * - Transform and opacity only; no width/height animation.
 * - Skippable (sessionStorage); respects prefers-reduced-motion.
 * - Cleanup: timeline killed, rAF cancelled, particle nodes removed.
 */
export function CinematicIntro() {
  const [visible, setVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const particleWrapperRef = useRef<HTMLDivElement>(null);
  const particlesContainerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const rafRef = useRef<number | null>(null);
  const iconTriggeredRef = useRef<Set<HTMLElement>>(new Set());

  const finishIntro = useCallback(() => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    const overlay = overlayRef.current;
    if (overlay) {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => setVisible(false),
      });
    } else {
      setVisible(false);
    }
  }, []);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia(REDUCED_MOTION_MEDIA).matches;
    const seen = sessionStorage.getItem(STORAGE_KEY);

    if (seen || reduced) {
      setVisible(false);
      return;
    }

    const overlay = overlayRef.current;
    const container = particlesContainerRef.current;
    const solidText = overlay?.querySelector("[data-intro-solid-text]");
    const bg = overlay?.querySelector("[data-intro-bg]");
    const icons = overlay?.querySelectorAll("[data-intro-icon]");

    if (!overlay || !container || !solidText || !bg) return;

    const wrapper = particleWrapperRef.current;
    if (wrapper) {
      const scale = Math.min(1, (window.innerWidth * 0.9) / CANVAS_W);
      wrapper.style.transform = `scale(${scale})`;
    }

    const targets = getTextParticleTargets();
    if (targets.length === 0) {
      finishIntro();
      return;
    }

    const particleEls: HTMLElement[] = [];
    for (let i = 0; i < targets.length; i++) {
      const el = document.createElement("div");
      el.setAttribute("data-intro-particle", "");
      const start = randomBlobPosition();
      el.style.cssText = [
        "position:absolute",
        "left:0",
        "top:0",
        "width:6px",
        "height:6px",
        "border-radius:50%",
        "background:#fff",
        "will-change:transform,opacity",
        "pointer-events:none",
      ].join(";");
      gsap.set(el, {
        x: start.x,
        y: start.y,
        opacity: 0.85,
        scale: 0.6 + Math.random() * 0.6,
      });
      container.appendChild(el);
      particleEls.push(el);
    }

    const ease = "power3.out";
    const tl = gsap.timeline({
      onComplete: () => {
        tl.kill();
        tlRef.current = null;
        if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        particleEls.forEach((el) => el.remove());
        sessionStorage.setItem(STORAGE_KEY, "1");
        setVisible(false);
      },
    });
    tlRef.current = tl;

    // 0–0.6s: background in
    tl.fromTo(bg, { opacity: 0 }, { opacity: 1, duration: 0.6, ease });

    // 0.3–2.5s: blob drift (subtle movement)
    particleEls.forEach((el, i) => {
      const start = gsap.getProperty(el, "x") as number;
      const startY = gsap.getProperty(el, "y") as number;
      tl.to(
        el,
        {
          x: start + (Math.random() - 0.5) * 40,
          y: startY + (Math.random() - 0.5) * 40,
          duration: 2,
          ease: "sine.inOut",
        },
        0.3
      );
    });

    // 2.5–4.8s: particles flow to letter positions
    targets.forEach((t, i) => {
      const el = particleEls[i];
      if (!el) return;
      tl.to(
        el,
        {
          x: t.x,
          y: t.y,
          scale: 0.9 + Math.random() * 0.3,
          opacity: 1,
          duration: 1.6,
          ease,
          overwrite: "auto",
        },
        2.5 + i * 0.006
      );
    });

    // 4.8–5.3s: solid text in, particles out
    tl.fromTo(solidText, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.4, ease }, 4.8);
    tl.to(particleEls, { opacity: 0, duration: 0.35, stagger: 0.008, ease }, 4.85);

    // 5.3–7.8s: hold – start icon proximity loop
    const textRect = () => textRef.current?.getBoundingClientRect();
    const PROX_THRESHOLD = 90;
    const PROX_LEAVE = 110;

    const checkProximity = () => {
      const rect = textRect();
      if (!rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      icons?.forEach((icon) => {
        const el = icon as HTMLElement;
        const r = el.getBoundingClientRect();
        const icx = r.left + r.width / 2;
        const icy = r.top + r.height / 2;
        const dist = Math.hypot(icx - cx, icy - cy);
        if (dist < PROX_THRESHOLD && !iconTriggeredRef.current.has(el)) {
          iconTriggeredRef.current.add(el);
          gsap.to(el, { scale: 1.25, duration: 0.2, ease: "power2.out", overwrite: "auto" });
          gsap.to(el, { scale: 1, duration: 0.35, ease: "power2.out", delay: 0.15, overwrite: "auto" });
        } else if (dist > PROX_LEAVE) {
          iconTriggeredRef.current.delete(el);
        }
      });
      rafRef.current = requestAnimationFrame(checkProximity);
    };

    tl.add(() => {
      rafRef.current = requestAnimationFrame(checkProximity);
    }, 5.3);
    tl.add(() => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }, 7.8);

    // 7.8–9.2s: fade out overlay (then onComplete does cleanup + finishIntro)
    tl.to(overlay, { opacity: 0, duration: 0.9, ease: "power2.inOut" }, 7.8);

    return () => {
      tl.kill();
      tlRef.current = null;
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      gsap.killTweensOf([overlay, particleEls, solidText, icons]);
      particleEls.forEach((el) => el.remove());
    };
  }, [finishIntro]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      aria-hidden
      style={{ willChange: "opacity" }}
    >
      {/* Subtle gradient background – no dots */}
      <div
        data-intro-bg
        className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
        style={{ willChange: "opacity" }}
      />

      {/* Particle container – scale set in useLayoutEffect for small viewports */}
      <div ref={particleWrapperRef} className="absolute" style={{ transformOrigin: "center center" }}>
        <div
          ref={particlesContainerRef}
          className="absolute"
          style={{ width: CANVAS_W, height: CANVAS_H }}
        />
      </div>

      {/* Solid ALWERASH – revealed after particles form */}
      <div
        ref={textRef}
        className="absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <div
          data-intro-solid-text
          className="text-center text-4xl font-bold tracking-tight text-white opacity-0 sm:text-5xl md:text-6xl"
          style={{ willChange: "transform, opacity", textShadow: "0 0 40px rgba(255,255,255,0.15)" }}
          aria-label="Alwerash"
        >
          ALWERASH
        </div>
      </div>

      {/* Floating learning icons */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {FLOAT_ICONS.map((icon, i) => (
          <FloatIcon key={icon.id} icon={icon} index={i} />
        ))}
      </div>
    </div>
  );
}

function FloatIcon({ icon, index }: { icon: (typeof FLOAT_ICONS)[0]; index: number }) {
  const elRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia(REDUCED_MOTION_MEDIA).matches;
    if (reduced) return;

    const el = elRef.current;
    if (!el) return;

    const left = 8 + (index * 11) % 84;
    const top = 12 + (index * 17) % 76;
    gsap.set(el, { left: `${left}%`, top: `${top}%`, scale: 0.9 + (index % 3) * 0.1 });

    const duration = 2.8 + (index % 4) * 0.4;
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(el, {
      y: -14 - (index % 3) * 4,
      rotation: (index % 2 === 0 ? 1 : -1) * (3 + (index % 3)),
      duration,
      ease: "sine.inOut",
    });

    return () => {
      tl.kill();
    };
  }, [index, icon.id]);

  return (
    <div
      ref={elRef}
      data-intro-icon
      className="absolute w-8 h-8 sm:w-10 sm:h-10"
      style={{ willChange: "transform" }}
      aria-hidden
    >
      <svg
        viewBox={icon.viewBox}
        className="w-full h-full drop-shadow-md"
        fill="none"
        stroke={icon.color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={icon.path} />
      </svg>
    </div>
  );
}
