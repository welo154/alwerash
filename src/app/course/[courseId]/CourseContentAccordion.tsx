"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  type CourseViewerAccess,
  getLockedLessonRedirect,
} from "@/lib/course-access";

export type CourseAccordionModule = {
  id: string;
  title: string;
  lessons: { id: string; title: string; type: string }[];
};

type CourseContentAccordionProps = {
  courseId: string;
  fontFamily: string;
  modules: CourseAccordionModule[];
  totalDurationMinutes?: number | null;
  freeLessonIds: string[];
  viewerAccess: CourseViewerAccess;
  activeFreeLessonId?: string | null;
  onSelectFreeLesson?: (lessonId: string) => void;
};

type AccordionSection = {
  id: string;
  title: string;
  firstPlayableLessonId: string | null;
  lessons: {
    id: string;
    name: string;
    right: string;
    isAction: boolean;
    isFree: boolean;
  }[];
};

function lessonMeta(type: string): { right: string; isAction: boolean } {
  const normalized = type.toUpperCase();
  if (normalized === "ARTICLE" || normalized === "READING") {
    return { right: "VIEW", isAction: true };
  }
  if (normalized === "ASSIGNMENT") {
    return { right: "TASK", isAction: true };
  }
  if (normalized === "RESOURCE") {
    return { right: "VIEW", isAction: true };
  }
  return { right: "PLAY", isAction: true };
}

function mapModules(
  courseId: string,
  modules: CourseAccordionModule[],
  freeLessonIdSet: Set<string>
): AccordionSection[] {
  return modules.map((module) => {
    const lessons = module.lessons.map((lesson, index) => {
      const meta = lessonMeta(lesson.type);
      const isFree = freeLessonIdSet.has(lesson.id);
      return {
        id: lesson.id,
        name: `${index + 1}. ${lesson.title}`,
        right: isFree ? meta.right : "LOCKED",
        isAction: meta.isAction,
        isFree,
      };
    });

    const firstPlayableLessonId =
      lessons.find((lesson) => lesson.isFree)?.id ?? null;

    return {
      id: module.id,
      title: module.title,
      firstPlayableLessonId,
      lessons,
    };
  });
}

export function CourseContentAccordion({
  courseId,
  fontFamily,
  modules,
  totalDurationMinutes,
  freeLessonIds,
  viewerAccess,
  activeFreeLessonId = null,
  onSelectFreeLesson,
}: CourseContentAccordionProps) {
  const router = useRouter();
  const freeLessonIdSet = useMemo(() => new Set(freeLessonIds), [freeLessonIds]);
  const sections = useMemo(
    () => mapModules(courseId, modules, freeLessonIdSet),
    [courseId, modules, freeLessonIdSet]
  );
  const lessonCount = useMemo(
    () => sections.reduce((acc, section) => acc + section.lessons.length, 0),
    [sections]
  );
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initial: Record<string, boolean> = {};
    sections.forEach((section, index) => {
      initial[section.id] = index === 0;
    });
    setOpenMap(initial);
  }, [sections]);

  const durationLabel = (() => {
    const mins = totalDurationMinutes ?? lessonCount * 15;
    if (mins <= 0) return "0m";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) return m > 0 ? `${h}h ${m}m` : `${h}h`;
    return `${m}m`;
  })();

  const handleLockedLesson = (lessonId: string) => {
    router.push(getLockedLessonRedirect(courseId, viewerAccess, lessonId));
  };

  const handleFreeLesson = (lessonId: string) => {
    onSelectFreeLesson?.(lessonId);
  };

  const startSection = (section: AccordionSection) => {
    if (section.firstPlayableLessonId) {
      handleFreeLesson(section.firstPlayableLessonId);
      return;
    }
    const firstLessonId = section.lessons[0]?.id;
    if (firstLessonId) {
      handleLockedLesson(firstLessonId);
    }
  };

  if (sections.length === 0) {
    return (
      <p
        className="mt-[46px] m-0 opacity-60"
        style={{ fontFamily, fontSize: "24px", fontWeight: 400 }}
      >
        Course content will be available soon.
      </p>
    );
  }

  return (
    <>
      <div className="mt-[46px] flex items-center justify-between">
        <p
          className="m-0"
          style={{
            color: "var(--Black, #000)",
            fontFamily,
            fontSize: "36px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
          }}
        >
          COURSE <span style={{ fontStyle: "italic", fontWeight: 600 }}>CONTENT</span>
        </p>

        <div className="flex items-center">
          <span
            style={{
              color: "var(--Black, #000)",
              fontFamily,
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
            }}
          >
            {lessonCount} {lessonCount === 1 ? "Lesson" : "Lessons"}
          </span>
          <svg className="ml-[22px]" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 27 27" fill="none" aria-hidden>
            <path
              d="M13.5 6V13.5L18.5 16M26 13.5C26 20.4036 20.4036 26 13.5 26C6.59644 26 1 20.4036 1 13.5C1 6.59644 6.59644 1 13.5 1C20.4036 1 26 6.59644 26 13.5Z"
              stroke="var(--Black, #000)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            className="ml-[13px]"
            style={{
              color: "var(--Black, #000)",
              fontFamily,
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
            }}
          >
            {durationLabel}
          </span>
        </div>
      </div>

      <div className="mt-[26px] flex items-center justify-between">
        <p
          className="m-0"
          style={{
            color: "var(--Black, #000)",
            fontFamily,
            fontSize: "24px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
            opacity: 0.6,
          }}
        >
          {sections.length} {sections.length === 1 ? "Section" : "Sections"} - {lessonCount}{" "}
          {lessonCount === 1 ? "Lecture" : "Lectures"}
        </p>
        <button
          type="button"
          onClick={() =>
            setOpenMap((prev) => {
              const next = { ...prev };
              sections.forEach((section) => {
                next[section.id] = true;
              });
              return next;
            })
          }
          className="flex flex-col items-start bg-transparent p-0 text-left"
        >
          <span
            style={{
              color: "var(--Purple, #FF8CFF)",
              fontFamily,
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "120%",
            }}
          >
            EXPAND ALL SECTIONS
          </span>
          <span className="mt-[2px] h-px w-[191px] bg-[#FF8CFF]" aria-hidden />
        </button>
      </div>

      {freeLessonIds.length > 0 ? (
        <p
          className="m-0 mt-[14px]"
          style={{
            color: "var(--Black, #000)",
            fontFamily,
            fontSize: "18px",
            fontWeight: 400,
            opacity: 0.65,
          }}
        >
          {freeLessonIds.length} free preview{" "}
          {freeLessonIds.length === 1 ? "lesson" : "lessons"} in the first section — subscribe to
          unlock the full course.
        </p>
      ) : null}

      <div className="mt-[20px] flex w-[843px] flex-col gap-[22px]">
        {sections.map((section) => {
          const isOpen = !!openMap[section.id];
          const openHeight = 74 + section.lessons.length * 74;
          return (
            <div
              key={section.id}
              className={`w-full overflow-hidden rounded-[30px] border border-black ${
                isOpen ? "bg-[#89F496]" : "bg-white"
              }`}
              style={{
                height: isOpen ? `${openHeight}px` : "74px",
                transition: "height 320ms ease-in-out, background-color 300ms ease-in-out",
              }}
            >
              <div
                className={`flex w-full items-center px-[38px] transition-[height,background-color] duration-300 ease-in-out ${
                  isOpen ? "bg-[#89F496]" : "bg-white"
                }`}
                style={{ height: "74px" }}
              >
                <button
                  type="button"
                  onClick={() => setOpenMap((prev) => ({ ...prev, [section.id]: !isOpen }))}
                  className="inline-flex shrink-0 items-center bg-transparent p-0"
                  aria-expanded={isOpen}
                  aria-label={isOpen ? `Collapse ${section.title}` : `Expand ${section.title}`}
                >
                  <svg
                    className="transition-transform duration-300 ease-in-out"
                    style={{ transform: isOpen ? "rotate(0deg)" : "rotate(180deg)" }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="9"
                    viewBox="0 0 21 11"
                    fill="none"
                    aria-hidden
                  >
                    <path d="M20 10L10.5 1L1 10" stroke="var(--Black, #000)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => startSection(section)}
                  className="ml-[20px] inline-flex min-w-0 flex-1 items-center bg-transparent p-0 text-left transition-opacity hover:opacity-80"
                  aria-label={`Start ${section.title}`}
                >
                  <span
                    className="truncate"
                    style={{
                      color: "var(--Black, #000)",
                      fontFamily,
                      fontSize: "24px",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "normal",
                    }}
                  >
                    {section.title}
                  </span>
                </button>
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {section.lessons.map((lesson, lessonIndex) => {
                  const rowClassName = `flex h-[74px] w-full items-center justify-between border-t border-black bg-white pl-[34px] pr-[38px] text-left transition-colors duration-200 ${
                    lesson.isFree
                      ? activeFreeLessonId === lesson.id
                        ? "bg-[#64E1FF] hover:bg-[#64E1FF]"
                        : "hover:bg-[#64E1FF]"
                      : "opacity-80 hover:bg-[#FFF5F5]"
                  } ${lessonIndex === 0 ? "rounded-t-[30px]" : ""}`;

                  const labelStyle = {
                    color: "var(--Black, #000)",
                    fontFamily,
                    fontSize: "24px",
                    fontStyle: "normal" as const,
                    fontWeight: 400,
                    lineHeight: "normal",
                  };

                  const badgeStyle = {
                    color: "var(--Black, #000)",
                    fontFamily,
                    fontSize: "18px",
                    fontStyle: "normal" as const,
                    fontWeight: 400,
                    lineHeight: "var(--Line-height-Heading-sm, 19.6px)",
                  };

                  const badgeClassName = lesson.isFree
                    ? "inline-flex h-[31px] shrink-0 items-center rounded-[8px] border border-black bg-[#FF8CFF] px-[16px]"
                    : "inline-flex h-[31px] shrink-0 items-center rounded-[8px] border border-black bg-white px-[16px]";

                  const rowContent = (
                    <>
                      <p className="m-0 truncate" style={labelStyle}>
                        {lesson.name}
                      </p>
                      {lesson.isAction ? (
                        <span className={badgeClassName} style={badgeStyle}>
                          {lesson.right}
                        </span>
                      ) : (
                        <p className="m-0" style={labelStyle}>
                          {lesson.right}
                        </p>
                      )}
                    </>
                  );

                  if (lesson.isFree) {
                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => handleFreeLesson(lesson.id)}
                        className={rowClassName}
                        aria-current={activeFreeLessonId === lesson.id ? "true" : undefined}
                        aria-label={
                          lesson.right === "VIEW" || lesson.right === "TASK"
                            ? `Open free preview: ${lesson.name}`
                            : `Play free preview: ${lesson.name}`
                        }
                      >
                        {rowContent}
                      </button>
                    );
                  }

                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => handleLockedLesson(lesson.id)}
                      className={rowClassName}
                      aria-label={`${lesson.name} — locked, subscribe to unlock`}
                    >
                      {rowContent}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}