"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import type { PlatformStats } from "@/app/api/stats/route";

const REDUCED_MOTION_MEDIA = "(prefers-reduced-motion: reduce)";

const STAT_LABELS: { key: keyof PlatformStats; label: string }[] = [
  { key: "watchTime", label: "Watch Time" },
  { key: "certificates", label: "Certificates" },
  { key: "courses", label: "Course" },
  { key: "activeLearners", label: "Learner" },
];

function formatValue(key: keyof PlatformStats, value: number): string {
  switch (key) {
    case "activeLearners":
      return value >= 1000 ? `${(value / 1000).toFixed(1)}K` : `${value}`;
    case "courses":
      return `${value}+`;
    case "watchTime":
    case "certificates":
      return value >= 1000 ? `${(value / 1000).toFixed(1)}K` : `${value.toLocaleString()}`;
    default:
      return `${value}`;
  }
}

export function StatsSection() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const valueRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data: PlatformStats) => setStats(data))
      .catch(() =>
        setStats({
          activeLearners: 0,
          courses: 0,
          tracks: 0,
          completionRate: 0,
          watchTime: 0,
          certificates: 0,
        })
      );
  }, []);

  useLayoutEffect(() => {
    if (typeof window === "undefined" || !stats || !sectionRef.current) return;
    if (window.matchMedia(REDUCED_MOTION_MEDIA).matches) return;

    const valueEls = valueRefs.current.filter(Boolean) as HTMLDivElement[];
    if (valueEls.length !== STAT_LABELS.length) return;

    const ctx = gsap.context(() => {
      valueEls.forEach((el, i) => {
        if (el) el.textContent = formatValue(STAT_LABELS[i].key, 0);
      });

      const objs = STAT_LABELS.map(() => ({ value: 0 }));
      const duration = 1.2;
      const ease = "power3.out";

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      STAT_LABELS.forEach(({ key }, i) => {
        const target = stats[key] ?? 0;
        const vars: gsap.TweenVars = {
          value: target,
          duration,
          ease,
          snap: { value: 1 },
          onUpdate: () => {
            const formatted = formatValue(key, Math.round(objs[i].value));
            if (valueEls[i]) valueEls[i].textContent = formatted;
          },
        };
        tl.to(objs[i], vars, i * 0.08);
      });

      tlRef.current = tl;
    }, sectionRef);

    return () => {
      ctx.revert();
      tlRef.current = null;
    };
  }, [stats]);

  const displayStats = stats ?? {
    activeLearners: 0,
    courses: 0,
    tracks: 0,
    completionRate: 0,
    watchTime: 0,
    certificates: 0,
  };

  return (
    <section ref={sectionRef} className="px-4 py-10 sm:px-6" data-gsap-reveal>
      <div
        className="mx-auto max-w-7xl rounded-[40px] py-16 px-4 shadow-lg sm:px-6"
        style={{ backgroundColor: "var(--color-stats-bar)" }}
      >
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 sm:justify-between">
          {STAT_LABELS.map(({ key, label }, i) => (
            <div key={label} className="text-center">
              <div
                ref={(el) => {
                  valueRefs.current[i] = el;
                }}
                className="text-2xl font-bold tracking-tight text-white sm:text-3xl tabular-nums"
              >
                {formatValue(key, displayStats[key] ?? 0)}
              </div>
              <div className="mt-1 text-sm font-medium text-white/90">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
