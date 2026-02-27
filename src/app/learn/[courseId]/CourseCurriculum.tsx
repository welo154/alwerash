"use client";

import Link from "next/link";
import { useState } from "react";

const ESTIMATED_MINUTES: Record<string, number> = {
  VIDEO: 10,
  ARTICLE: 5,
  RESOURCE: 5,
};

type Lesson = {
  id: string;
  title: string;
  type: string;
  order: number;
  video?: { muxPlaybackId: string } | null;
};

type Module = {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
};

type Props = {
  courseId: string;
  modules: Module[];
};

function estimateTotalMinutes(modules: Module[]): number {
  return modules.reduce((total, m) => {
    return (
      total +
      m.lessons.reduce((sum, l) => sum + (ESTIMATED_MINUTES[l.type] ?? 5), 0)
    );
  }, 0);
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `~${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `~${h}h ${m}m` : `~${h}h`;
}

function LessonIcon({ type, hasVideo }: { type: string; hasVideo: boolean }) {
  if (type === "VIDEO") {
    return (
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700"
        aria-hidden
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6.3 2.84A1.5 1.5 0 018 2h4a1.5 1.5 0 011.7.84l.94 1.88A1.5 1.5 0 0016 5H4a1.5 1.5 0 00-1.36.88l.94-1.88z" />
          <path d="M2 8a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8z" />
        </svg>
      </span>
    );
  }
  if (type === "ARTICLE") {
    return (
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700"
        aria-hidden
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
        </svg>
      </span>
    );
  }
  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600"
      aria-hidden
    >
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    </span>
  );
}

export function CourseCurriculum({ courseId, modules }: Props) {
  const [openModuleId, setOpenModuleId] = useState<string | null>(
    modules[0]?.id ?? null
  );
  const totalMinutes = estimateTotalMinutes(modules);
  const totalLessons = modules.reduce((n, m) => n + m.lessons.length, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
        <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
          <span>{modules.length} modules</span>
          <span aria-hidden>·</span>
          <span>{totalLessons} lessons</span>
          <span aria-hidden>·</span>
          <span>{formatDuration(totalMinutes)} total</span>
        </span>
      </div>

      <div className="space-y-2">
        {modules.map((module, mIndex) => {
          const isOpen = openModuleId === module.id;
          const lessonCount = module.lessons.length;
          const moduleMinutes = module.lessons.reduce(
            (sum, l) => sum + (ESTIMATED_MINUTES[l.type] ?? 5),
            0
          );

          return (
            <div
              key={module.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <button
                type="button"
                onClick={() =>
                  setOpenModuleId((id) => (id === module.id ? null : module.id))
                }
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50"
                aria-expanded={isOpen}
                aria-controls={`module-content-${module.id}`}
                id={`module-heading-${module.id}`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700"
                    aria-hidden
                  >
                    {mIndex + 1}
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-slate-900 truncate">
                      {module.title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {lessonCount} lesson{lessonCount !== 1 ? "s" : ""}
                      {moduleMinutes > 0 && ` · ${formatDuration(moduleMinutes)}`}
                    </p>
                  </div>
                </div>
                <span
                  className={`shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              <div
                id={`module-content-${module.id}`}
                role="region"
                aria-labelledby={`module-heading-${module.id}`}
                className={`grid transition-[grid-template-rows] duration-200 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <div className="min-h-0 overflow-hidden">
                  <ul className="border-t border-slate-100 bg-slate-50/50">
                    {module.lessons.map((lesson, lIndex) => {
                      const hasVideo =
                        lesson.type === "VIDEO" && lesson.video?.muxPlaybackId;
                      const href = hasVideo
                        ? `/learn/${courseId}/lesson/${lesson.id}`
                        : undefined;
                      const label = `${mIndex + 1}.${lIndex + 1} ${lesson.title}`;

                      return (
                        <li key={lesson.id}>
                          {href ? (
                            <Link
                              href={href}
                              className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-white border-b border-slate-100 last:border-b-0"
                            >
                              <LessonIcon
                                type={lesson.type}
                                hasVideo={!!lesson.video?.muxPlaybackId}
                              />
                              <span className="flex-1 font-medium text-slate-800 truncate">
                                {label}
                              </span>
                              <span className="text-xs text-slate-500 shrink-0">
                                {lesson.type === "VIDEO"
                                  ? "Video"
                                  : lesson.type}
                              </span>
                              <span className="text-slate-400 shrink-0" aria-hidden>
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </span>
                            </Link>
                          ) : (
                            <div className="flex items-center gap-3 px-5 py-3 text-slate-500 border-b border-slate-100 last:border-b-0">
                              <LessonIcon
                                type={lesson.type}
                                hasVideo={false}
                              />
                              <span className="flex-1 truncate">{label}</span>
                              <span className="text-xs shrink-0">
                                {lesson.type === "VIDEO"
                                  ? "Video not ready"
                                  : lesson.type}
                              </span>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
