"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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
  currentLessonId: string;
};

function LessonIcon({ type }: { type: string }) {
  if (type === "VIDEO") {
    return (
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-emerald-100 text-emerald-700"
        aria-hidden
      >
        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6.3 2.84A1.5 1.5 0 018 2h4a1.5 1.5 0 011.7.84l.94 1.88A1.5 1.5 0 0016 5H4a1.5 1.5 0 00-1.36.88l.94-1.88z" />
          <path d="M2 8a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8z" />
        </svg>
      </span>
    );
  }
  if (type === "ARTICLE") {
    return (
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-amber-100 text-amber-700"
        aria-hidden
      >
        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
        </svg>
      </span>
    );
  }
  return (
    <span
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-slate-100 text-slate-600"
      aria-hidden
    >
      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    </span>
  );
}

export function CourseCurriculumSidebar({
  courseId,
  modules,
  currentLessonId,
}: Props) {
  const currentModuleId = useMemo(
    () =>
      modules.find((m) => m.lessons.some((l) => l.id === currentLessonId))?.id ??
      modules[0]?.id ??
      null,
    [modules, currentLessonId]
  );

  const [openModuleId, setOpenModuleId] = useState<string | null>(
    () => currentModuleId
  );

  return (
    <aside
      className="w-full lg:w-80 shrink-0"
      aria-label="Course content"
    >
      <div className="sticky top-4 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-md shadow-slate-200/40 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Course content
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {modules.length} module{modules.length !== 1 ? "s" : ""} ·{" "}
            {modules.reduce((n, m) => n + m.lessons.length, 0)} lessons
          </p>
        </div>
        <nav className="max-h-[calc(100vh-12rem)] overflow-y-auto">
          {modules.map((module, mIndex) => {
            const isOpen = openModuleId === module.id;
            return (
              <div
                key={module.id}
                className="border-b border-slate-100 last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenModuleId((id) =>
                      id === module.id ? null : module.id
                    )
                  }
                  className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium text-slate-800 transition-colors hover:bg-indigo-50/50"
                  aria-expanded={isOpen}
                  aria-controls={`sidebar-module-${module.id}`}
                  id={`sidebar-heading-${module.id}`}
                >
                  <span className="flex min-w-0 items-center gap-2 truncate">
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700"
                      aria-hidden
                    >
                      {mIndex + 1}
                    </span>
                    {module.title}
                  </span>
                  <span
                    className={`shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>
                <div
                  id={`sidebar-module-${module.id}`}
                  role="region"
                  aria-labelledby={`sidebar-heading-${module.id}`}
                  className={`grid transition-[grid-template-rows] duration-200 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <ul className="bg-slate-50/70 pb-2">
                      {module.lessons.map((lesson, lIndex) => {
                        const hasVideo =
                          lesson.type === "VIDEO" &&
                          lesson.video?.muxPlaybackId;
                        const href = hasVideo
                          ? `/learn/${courseId}/lesson/${lesson.id}`
                          : undefined;
                        const isCurrent = lesson.id === currentLessonId;

                        return (
                          <li key={lesson.id}>
                            {href ? (
                              <Link
                                href={href}
                                className={`flex items-center gap-2 px-4 py-2 pl-11 text-sm transition-all duration-200 ${
                                  isCurrent
                                    ? "bg-indigo-50 text-indigo-800 font-medium border-l-2 border-indigo-500 -ml-px pl-[2.6rem]"
                                    : "text-slate-700 hover:bg-indigo-50/50 hover:text-slate-900"
                                }`}
                              >
                                <LessonIcon type={lesson.type} />
                                <span className="truncate">
                                  {mIndex + 1}.{lIndex + 1} {lesson.title}
                                </span>
                              </Link>
                            ) : (
                              <div
                                className="flex items-center gap-2 px-4 py-2 pl-11 text-sm text-slate-400"
                                title="Video not ready"
                              >
                                <LessonIcon type={lesson.type} />
                                <span className="truncate">
                                  {mIndex + 1}.{lIndex + 1} {lesson.title}
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
        </nav>
      </div>
    </aside>
  );
}
