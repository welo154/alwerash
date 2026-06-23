"use client";

import { useEffect, useMemo, useState } from "react";

export type CourseAccordionModule = {
  id: string;
  title: string;
  lessons: { id: string; title: string; type: string }[];
};

type CourseContentAccordionProps = {
  fontFamily: string;
  modules: CourseAccordionModule[];
  totalDurationMinutes?: number | null;
};

type AccordionSection = {
  id: string;
  title: string;
  lessons: { id: string; name: string; right: string; isView: boolean }[];
};

function lessonMeta(type: string): { right: string; isView: boolean } {
  const normalized = type.toUpperCase();
  if (normalized === "ARTICLE" || normalized === "READING") {
    return { right: "VIEW", isView: true };
  }
  if (normalized === "ASSIGNMENT") {
    return { right: "TASK", isView: true };
  }
  return { right: "—", isView: false };
}

function mapModules(modules: CourseAccordionModule[]): AccordionSection[] {
  return modules.map((module) => ({
    id: module.id,
    title: module.title,
    lessons: module.lessons.map((lesson, index) => {
      const meta = lessonMeta(lesson.type);
      return {
        id: lesson.id,
        name: `${index + 1}. ${lesson.title}`,
        right: meta.right,
        isView: meta.isView,
      };
    }),
  }));
}

export function CourseContentAccordion({
  fontFamily,
  modules,
  totalDurationMinutes,
}: CourseContentAccordionProps) {
  const sections = useMemo(() => mapModules(modules), [modules]);
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
              <button
                type="button"
                onClick={() => setOpenMap((prev) => ({ ...prev, [section.id]: !isOpen }))}
                className={`flex w-full items-center justify-between px-[38px] text-left transition-[height,background-color] duration-300 ease-in-out ${
                  isOpen ? "bg-[#89F496]" : "bg-white"
                }`}
                style={{ height: "74px" }}
              >
                <span className="inline-flex items-center">
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
                  <span
                    className="ml-[20px]"
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
                </span>
                <span aria-hidden />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {section.lessons.map((lesson, lessonIndex) => (
                  <div
                    key={lesson.id}
                    className={`border-t border-black bg-white transition-colors duration-200 hover:bg-[#64E1FF] ${
                      lessonIndex === 0 ? "rounded-t-[30px]" : ""
                    }`}
                  >
                    <div className="flex h-[74px] items-center justify-between pl-[34px] pr-[38px]">
                      <p
                        className="m-0"
                        style={{
                          color: "var(--Black, #000)",
                          fontFamily,
                          fontSize: "24px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "normal",
                        }}
                      >
                        {lesson.name}
                      </p>
                      {lesson.isView ? (
                        <button
                          type="button"
                          className="inline-flex h-[31px] items-center rounded-[8px] border border-black bg-[#FF8CFF] px-[16px]"
                          style={{
                            color: "var(--Black, #000)",
                            fontFamily,
                            fontSize: "18px",
                            fontStyle: "normal",
                            fontWeight: 400,
                            lineHeight: "var(--Line-height-Heading-sm, 19.6px)",
                          }}
                        >
                          {lesson.right}
                        </button>
                      ) : (
                        <p
                          className="m-0"
                          style={{
                            color: "var(--Black, #000)",
                            fontFamily,
                            fontSize: "24px",
                            fontStyle: "normal",
                            fontWeight: 400,
                            lineHeight: "normal",
                          }}
                        >
                          {lesson.right}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
