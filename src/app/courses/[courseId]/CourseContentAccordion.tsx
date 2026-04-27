"use client";

import { useState } from "react";

type CourseContentAccordionProps = {
  fontFamily: string;
};

export function CourseContentAccordion({ fontFamily }: CourseContentAccordionProps) {
  const sections = [
    {
      id: "illustration-basics",
      title: "What's Illustration?",
      lessons: [
        { name: "1. Introduction", right: "50:35" },
        { name: "2. Brush Types", right: "43:54" },
        { name: "3. Article 01", right: "VIEW", isView: true },
      ],
    },
    {
      id: "foundations",
      title: "Illustration Foundations",
      lessons: [
        { name: "1. Shape Language", right: "18:22" },
        { name: "2. Composition Rules", right: "27:40" },
        { name: "3. Practice Sheet", right: "VIEW", isView: true },
      ],
    },
    {
      id: "line-work",
      title: "Line Work Mastery",
      lessons: [
        { name: "1. Line Confidence", right: "21:09" },
        { name: "2. Pressure Control", right: "16:31" },
        { name: "3. Inking Drill", right: "VIEW", isView: true },
      ],
    },
    {
      id: "color-theory",
      title: "Color Theory Essentials",
      lessons: [
        { name: "1. Hue and Value", right: "24:19" },
        { name: "2. Color Harmony", right: "19:44" },
        { name: "3. Palette Exercise", right: "VIEW", isView: true },
      ],
    },
    {
      id: "lighting",
      title: "Lighting and Shadows",
      lessons: [
        { name: "1. Light Direction", right: "20:48" },
        { name: "2. Cast Shadows", right: "22:10" },
        { name: "3. Study Notes", right: "VIEW", isView: true },
      ],
    },
    {
      id: "textures",
      title: "Textures and Materials",
      lessons: [
        { name: "1. Fabric Rendering", right: "17:56" },
        { name: "2. Metal and Glass", right: "23:11" },
        { name: "3. Texture Pack", right: "VIEW", isView: true },
      ],
    },
    {
      id: "character-design",
      title: "Character Design",
      lessons: [
        { name: "1. Silhouette Pass", right: "26:27" },
        { name: "2. Facial Features", right: "31:08" },
        { name: "3. Design Sheet", right: "VIEW", isView: true },
      ],
    },
    {
      id: "environment",
      title: "Environment Illustration",
      lessons: [
        { name: "1. Perspective Grids", right: "28:35" },
        { name: "2. Atmospheric Depth", right: "22:47" },
        { name: "3. Scene Template", right: "VIEW", isView: true },
      ],
    },
    {
      id: "digital-tools",
      title: "Digital Tools Workflow",
      lessons: [
        { name: "1. Layer Strategy", right: "14:40" },
        { name: "2. Custom Brushes", right: "19:02" },
        { name: "3. Tool Presets", right: "VIEW", isView: true },
      ],
    },
    {
      id: "style-dev",
      title: "Personal Style Development",
      lessons: [
        { name: "1. Style Exploration", right: "25:16" },
        { name: "2. Reference Boards", right: "18:09" },
        { name: "3. Style Checklist", right: "VIEW", isView: true },
      ],
    },
    {
      id: "final-project",
      title: "Final Project",
      lessons: [
        { name: "1. Project Brief", right: "12:55" },
        { name: "2. Final Rendering", right: "34:20" },
        { name: "3. Submission Guide", right: "VIEW", isView: true },
      ],
    },
  ] as const;

  const [openMap, setOpenMap] = useState<Record<string, boolean>>({
    [sections[0].id]: true,
    [sections[1].id]: false,
    [sections[2].id]: false,
    [sections[3].id]: false,
    [sections[4].id]: false,
    [sections[5].id]: false,
    [sections[6].id]: false,
    [sections[7].id]: false,
    [sections[8].id]: false,
    [sections[9].id]: false,
    [sections[10].id]: false,
  });

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
            52 Lessons
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
            23h34m
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
          13 Sections - 126 Lectures
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
          return (
            <div
              key={section.id}
              className={`w-full overflow-hidden rounded-[30px] border border-black ${
                isOpen ? "bg-[#89F496]" : "bg-white"
              }`}
              style={{
                height: isOpen ? "296px" : "74px",
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
                  isOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {section.lessons.map((lesson, lessonIndex) => (
                  <div
                    key={`${section.id}-${lesson.name}`}
                    className={`cursor-pointer border-t border-black bg-white transition-colors duration-200 hover:bg-[#64E1FF] ${
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
