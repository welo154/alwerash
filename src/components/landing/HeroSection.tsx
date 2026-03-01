"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useSession } from "next-auth/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PlatformStats } from "@/app/api/stats/route";

gsap.registerPlugin(ScrollTrigger);

const REDUCED_MOTION_MEDIA = "(prefers-reduced-motion: reduce)";

const STAT_LABELS: { key: keyof PlatformStats; label: string }[] = [
  { key: "watchTime", label: "Watch Time" },
  { key: "certificates", label: "Certificates" },
  { key: "courses", label: "Course" },
  { key: "activeLearners", label: "Learner" },
];

function formatStatValue(key: keyof PlatformStats, value: number): string {
  switch (key) {
    case "courses":
      return `${value}+`;
    case "watchTime":
    case "certificates":
    case "activeLearners":
      return value.toLocaleString();
    default:
      return `${value}`;
  }
}

export type HeroTrack = { id: string; title: string; slug: string };

export function HeroSection({ tracks }: { tracks: HeroTrack[] }) {
  const { data: session } = useSession();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [displayTracks, setDisplayTracks] = useState<HeroTrack[]>(() =>
    Array.isArray(tracks) ? tracks : []
  );
  const statsBarRef = useRef<HTMLDivElement>(null);
  const valueRefs = useRef<(HTMLElement | null)[]>([]);

  // Use server-passed tracks when available
  useEffect(() => {
    const fromServer = Array.isArray(tracks) ? tracks : [];
    if (fromServer.length > 0) setDisplayTracks(fromServer);
  }, [tracks]);

  // When we still have no tracks, fetch from API (fallback for hydration or empty initial payload)
  useEffect(() => {
    if (displayTracks.length > 0) return;
    fetch("/api/catalog/tracks")
      .then((res) => res.json())
      .then((list: HeroTrack[]) => {
        if (Array.isArray(list) && list.length > 0) setDisplayTracks(list);
      })
      .catch(() => {});
  }, [displayTracks.length]);

  const safeTracks = displayTracks;

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
    if (typeof window === "undefined" || !stats || !statsBarRef.current) return;
    if (window.matchMedia(REDUCED_MOTION_MEDIA).matches) return;

    const valueEls = valueRefs.current.filter(Boolean) as HTMLElement[];
    if (valueEls.length !== STAT_LABELS.length) return;

    const ctx = gsap.context(() => {
      valueEls.forEach((el, i) => {
        if (el) el.textContent = formatStatValue(STAT_LABELS[i].key, 0);
      });

      const objs = STAT_LABELS.map(() => ({ value: 0 }));
      const duration = 1.2;
      const ease = "power3.out";

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: statsBarRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });

      STAT_LABELS.forEach(({ key }, i) => {
        const target = stats[key] ?? 0;
        tl.to(
          objs[i],
          {
            value: target,
            duration,
            ease,
            snap: { value: 1 },
            onUpdate: () => {
              const formatted = formatStatValue(key, Math.round(objs[i].value));
              if (valueEls[i]) valueEls[i].textContent = formatted;
            },
          },
          i * 0.08
        );
      });
    }, statsBarRef);

    return () => ctx.revert();
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
    <section className="border-b border-slate-200 bg-white font-sans">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        {/* One row: "Experiment with Experts!" + tracks on left, LOG-IN on right (hidden when logged in) */}
        <div
          className={
            session
              ? "block"
              : "flex flex-col gap-8 sm:flex-row sm:flex-nowrap sm:items-start sm:gap-12"
          }
        >
          <div className="min-w-0 flex-1">
            <h1
              className="text-4xl font-bold tracking-tight text-black sm:text-5xl lg:text-6xl"
              data-gsap-hero
            >
              Experiment with Experts!
            </h1>
            {/* Track tags: oval pills, thin black border, white bg, one highlighted yellow */}
            <div
              className="mt-6 flex flex-wrap gap-2 lg:mt-8"
              data-gsap-stagger-group
            >
              {safeTracks.length === 0 ? null : (
                safeTracks.map((track, index) => {
                  const isHighlight = index === 0;
                  return (
                    <Link
                      key={track.id}
                      href={`/tracks/${track.slug}`}
                      className={`inline-flex items-center rounded-full border px-4 py-2.5 text-sm font-medium text-black transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 ${
                        isHighlight
                          ? "border-black bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]"
                          : "border-black bg-white hover:bg-slate-50"
                      }`}
                    >
                      {track.title}
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          {/* LOG-IN panel: same row as headline + tracks, disappears when user is logged in */}
          {!session && (
            <div
              className="w-full max-w-[420px] shrink-0 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:w-auto lg:sticky lg:top-24"
              data-gsap-btn
            >
              <h2 className="text-lg font-bold uppercase tracking-tight text-black">
                LOG-IN
              </h2>
              <div className="mt-5 flex flex-col gap-3">
                <Link
                  href="/login"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-black bg-white py-2.5 text-sm font-medium text-black transition-colors hover:bg-slate-50"
                >
                  <GoogleIcon className="h-5 w-5 shrink-0" />
                  <span className="whitespace-nowrap">continue with Google</span>
                </Link>
                <Link
                  href="/login"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-black bg-white py-2.5 text-sm font-medium text-black transition-colors hover:bg-slate-50"
                >
                  <FacebookIcon className="h-5 w-5 shrink-0" />
                  <span className="whitespace-nowrap">continue with Facebook</span>
                </Link>
                <Link
                  href="/login"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-black bg-white py-2.5 text-sm font-medium text-black transition-colors hover:bg-slate-50"
                >
                  <AppleIcon className="h-5 w-5 shrink-0" />
                  <span className="whitespace-nowrap">continue with apple</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Blue stats banner: #0061FF, rounded-[40px], extra bold value, semibold label */}
        <div className="mt-12 w-full px-4 py-12">
          <div
            ref={statsBarRef}
            className="mx-auto flex max-w-7xl flex-row items-center justify-between rounded-[40px] py-16 px-4 text-white shadow-lg"
            style={{ backgroundColor: "#0061FF" }}
            data-gsap-reveal
          >
            {STAT_LABELS.map(({ key, label }, i) => (
              <div
                key={label}
                className="flex flex-1 flex-col items-center justify-center text-center"
              >
                <h2
                  ref={(el) => {
                    valueRefs.current[i] = el;
                  }}
                  className="mb-3 text-5xl font-black leading-none tracking-tight tabular-nums md:text-6xl lg:text-7xl"
                >
                  {formatStatValue(key, displayStats[key] ?? 0)}
                </h2>
                <p className="text-2xl font-semibold tracking-wide md:text-3xl lg:text-4xl">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="#1877F2" viewBox="0 0 24 24" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}
