"use client";
// @refresh reset

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { localizedText } from "@/components/i18n/LocalizedText";
import { useT } from "@/components/i18n/Tr";
import { useArabicLayout } from "@/components/providers/LocaleProvider";
import {
  type CourseViewerAccess,
  getLockedLessonRedirect,
} from "@/lib/course-access";

export type CourseAccordionModule = {
  id: string;
  title: string;
  titleAr?: string | null;
  lessons: { id: string; title: string; titleAr?: string | null; type: string }[];
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
  titleAr?: string | null;
  firstPlayableLessonId: string | null;
  lessons: {
    id: string;
    index: number;
    title: string;
    titleAr?: string | null;
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
        index,
        title: lesson.title,
        titleAr: lesson.titleAr,
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
      titleAr: module.titleAr,
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
  const t = useT();
  const arabic = useArabicLayout();
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

  const mins = totalDurationMinutes ?? lessonCount * 15;
  const durationLabel = (() => {
    if (mins <= 0) return "0m";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) return m > 0 ? `${h}h ${m}m` : `${h}h`;
    return `${m}m`;
  })();
  const durationLabelCompact = (() => {
    if (mins <= 0) return "0m";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) return m > 0 ? `${h}h${String(m).padStart(2, "0")}m` : `${h}h`;
    return `${m}m`;
  })();

  const handleLockedLesson = (lessonId: string) => {
    router.push(getLockedLessonRedirect(courseId, viewerAccess, lessonId));
  };

  const handleFreeLesson = (lessonId: string) => {
    onSelectFreeLesson?.(lessonId);
  };

  const arabicDurationLabel = (() => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0 && m > 0) return `${h} ساعة و${m} دقيقة`;
    if (h > 0) return `${h} ساعة`;
    return `${m} دقيقة`;
  })();

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

  return (
    <>
      <div className="mt-[35px] flex items-center justify-between min-[744px]:max-lg:mt-[43px] min-[744px]:max-lg:w-[676px] lg:mt-[100px] lg:w-[758px]">
        <p
          className="m-0 text-[24px] min-[744px]:max-lg:text-[32px] lg:text-[36px] lg:ar:text-right lg:ar:text-[32px]"
          style={{
            color: "var(--Black, #000)",
            fontFamily,
            fontStyle: "normal",
            fontWeight: 400,
            fontVariationSettings: '"wght" 400',
            lineHeight: "normal",
            textAlign: arabic ? "right" : undefined,
          }}
        >
          {arabic ? (
            "محتـــوى الدورة"
          ) : (
            <>
              COURSE{" "}
              <span style={{ fontStyle: "italic", fontWeight: 600, fontVariationSettings: '"wght" 600' }}>
                CONTENT
              </span>
            </>
          )}
        </p>

        <div className="hidden items-center lg:flex">
          <span
            style={{
              color: "var(--Black, #000)",
              fontFamily,
              fontSize: arabic ? 18 : 24,
              fontStyle: "normal",
              fontWeight: 400,
              fontVariationSettings: '"wght" 400',
              lineHeight: "normal",
              textAlign: arabic ? "right" : undefined,
            }}
          >
            {arabic ? `${lessonCount} درساً` : `${lessonCount} ${t(lessonCount === 1 ? "Lesson" : "Lessons")}`}
          </span>
          <svg className="ms-[22px]" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 27 27" fill="none" aria-hidden>
            <path
              d="M13.5 6V13.5L18.5 16M26 13.5C26 20.4036 20.4036 26 13.5 26C6.59644 26 1 20.4036 1 13.5C1 6.59644 6.59644 1 13.5 1C20.4036 1 26 6.59644 26 13.5Z"
              stroke="var(--Black, #000)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            className="ms-[13px]"
            style={{
              color: "var(--Black, #000)",
              fontFamily,
              fontSize: arabic ? 18 : 24,
              fontStyle: "normal",
              fontWeight: 400,
              fontVariationSettings: '"wght" 400',
              lineHeight: "normal",
              textAlign: arabic ? "right" : undefined,
            }}
          >
            {arabic ? arabicDurationLabel : durationLabel}
          </span>
        </div>
      </div>

      <div className="mt-[5px] flex items-center justify-between max-[743px]:pe-[29px] min-[744px]:max-lg:mt-[9px] min-[744px]:max-lg:w-[676px] lg:mt-[26px] lg:w-[758px]">
        <p
          className="m-0 text-[14px] min-[744px]:max-lg:text-[18px] lg:text-[24px] lg:ar:text-right lg:ar:text-[18px]"
          style={{
            color: "var(--Black, #000)",
            fontFamily,
            fontStyle: "normal",
            fontWeight: 400,
            fontVariationSettings: '"wght" 400',
            lineHeight: "normal",
            opacity: 0.6,
            textAlign: arabic ? "right" : undefined,
          }}
        >
          {arabic
            ? `${sections.length} قسم - ${lessonCount} محاضرة`
            : `${sections.length} ${t(sections.length === 1 ? "Section" : "Sections")} - ${lessonCount} ${t(lessonCount === 1 ? "Lecture" : "Lectures")}`}
        </p>
        <div className="flex items-center lg:hidden">
          <span
            className="text-[14px] min-[744px]:max-lg:text-[18px]"
            style={{
              color: "var(--Black, #000)",
              fontFamily,
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
            }}
          >
            {lessonCount} {t(lessonCount === 1 ? "Lesson" : "Lessons")}
          </span>
          <svg className="ms-[12px] min-[744px]:max-lg:hidden" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 27 27" fill="none" aria-hidden>
            <path
              d="M13.5 6V13.5L18.5 16M26 13.5C26 20.4036 20.4036 26 13.5 26C6.59644 26 1 20.4036 1 13.5C1 6.59644 6.59644 1 13.5 1C20.4036 1 26 6.59644 26 13.5Z"
              stroke="var(--Black, #000)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg
            className="ms-[17px] hidden min-[744px]:max-lg:block"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden
          >
            <path
              d="M9.75 4.35V9.75L13.35 11.55M18.75 9.75C18.75 14.7206 14.7206 18.75 9.75 18.75C4.77944 18.75 0.75 14.7206 0.75 9.75C0.75 4.77944 4.77944 0.75 9.75 0.75C14.7206 0.75 18.75 4.77944 18.75 9.75Z"
              stroke="var(--Black, #000)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            className="ms-[12px] min-[744px]:max-lg:hidden"
            style={{
              color: "var(--Black, #000)",
              fontFamily,
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
            }}
          >
            {durationLabel}
          </span>
          <span
            className="ms-[7px] me-[50px] hidden text-[18px] min-[744px]:max-lg:inline"
            style={{
              color: "var(--Black, #000)",
              fontFamily,
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
            }}
          >
            {durationLabelCompact}
          </span>
        </div>
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
          className="hidden flex-col items-start bg-transparent p-0 text-start lg:flex"
        >
          <span
            style={{
              color: "var(--Purple, #FF8CFF)",
              fontFamily,
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 400,
              fontVariationSettings: '"wght" 400',
              lineHeight: "120%",
              textAlign: arabic ? "right" : undefined,
            }}
          >
            {t("EXPAND ALL SECTIONS")}
          </span>
          <span className={`mt-[2px] h-px bg-[#FF8CFF] ${arabic ? "w-full" : "w-[191px]"}`} aria-hidden />
        </button>
      </div>

      {freeLessonIds.length > 0 ? (
        <p
          className="m-0 mt-[14px] max-lg:hidden"
          style={{
            color: "var(--Black, #000)",
            fontFamily,
            fontSize: "18px",
            fontWeight: 400,
            opacity: 0.65,
          }}
        >
          {freeLessonIds.length}{" "}
          {t(
            freeLessonIds.length === 1
              ? "free preview lesson in the first section — subscribe to unlock the full course."
              : "free preview lessons in the first section — subscribe to unlock the full course."
          )}
        </p>
      ) : null}

      <div className="mt-[20px] flex w-[843px] max-w-full flex-col gap-[17px] max-[743px]:-ml-[30px] max-[743px]:ar:ml-0 max-[743px]:ar:mr-0 max-[743px]:ar:w-[334px] max-[743px]:w-[calc(100%+30px)] max-[743px]:max-w-none max-[743px]:items-center min-[744px]:max-lg:mt-[48px] min-[744px]:max-lg:w-[622px] lg:w-[758px] lg:gap-[22px]">
        {sections.map((section) => {
          const isOpen = !!openMap[section.id];
          const openHeightMobile = 54 + section.lessons.length * 74;
          const openHeightDesktop = 74 + section.lessons.length * 74;
          return (
            <div
              key={section.id}
              className={`h-[var(--h-sm)] w-[334px] overflow-hidden rounded-[30px] border border-black max-[743px]:mx-auto min-[744px]:max-lg:h-[var(--h-lg)] min-[744px]:max-lg:w-[622px] lg:h-[var(--h-lg)] lg:w-full ${
                isOpen ? "bg-[#89F496]" : "bg-white"
              }`}
              style={{
                ["--h-sm" as string]: isOpen ? `${openHeightMobile}px` : "54px",
                ["--h-lg" as string]: isOpen ? `${openHeightDesktop}px` : "74px",
                transition: "height 320ms ease-in-out, background-color 300ms ease-in-out",
              }}
            >
              <div
                className={`flex h-[54px] w-full items-center px-4 transition-[height,background-color] duration-300 ease-in-out min-[744px]:max-lg:h-[74px] min-[744px]:max-lg:ps-[31px] lg:h-[74px] lg:px-[38px] ${
                  isOpen ? "bg-[#89F496]" : "bg-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenMap((prev) => ({ ...prev, [section.id]: !isOpen }))}
                  className="inline-flex shrink-0 items-center bg-transparent p-0"
                  aria-expanded={isOpen}
                  aria-label={isOpen ? `${t("Collapse")} ${localizedText(arabic, section.title, section.titleAr)}` : `${t("Expand")} ${localizedText(arabic, section.title, section.titleAr)}`}
                >
                  <svg
                    className="h-[9px] w-[19px] transition-transform duration-300 ease-in-out"
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
                  className="ms-[20px] inline-flex min-w-0 flex-1 items-center bg-transparent p-0 text-start transition-opacity hover:opacity-80"
                  aria-label={`${t("Start")} ${localizedText(arabic, section.title, section.titleAr)}`}
                >
                  <span
                    className="truncate text-[16px] font-medium min-[744px]:max-lg:text-[24px] lg:text-[24px]"
                    style={{
                      color: "var(--Black, #000)",
                      fontFamily,
                      fontStyle: "normal",
                      fontWeight: 500,
                      fontVariationSettings: '"wght" 500',
                      lineHeight: "normal",
                      textAlign: arabic ? "right" : undefined,
                    }}
                  >
                    {localizedText(arabic, section.title, section.titleAr)}
                  </span>
                </button>
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {section.lessons.map((lesson, lessonIndex) => {
                  const rowClassName = `flex h-[74px] w-full items-center justify-between border-t border-black bg-white px-4 text-start transition-colors duration-200 min-[744px]:max-lg:ps-[24px] lg:ps-[34px] lg:pe-[38px] ${
                    lesson.isFree
                      ? activeFreeLessonId === lesson.id
                        ? "bg-[#64E1FF] hover:bg-[#64E1FF]"
                        : "hover:bg-[#64E1FF]"
                      : "opacity-80 hover:bg-[#FFF5F5]"
                  } ${lessonIndex === 0 ? "rounded-t-[30px]" : ""}`;

                  const labelStyle = {
                    color: "var(--Black, #000)",
                    fontFamily,
                    fontStyle: "normal" as const,
                    fontWeight: 400,
                    fontVariationSettings: '"wght" 400',
                    lineHeight: "normal",
                    textAlign: arabic ? ("right" as const) : undefined,
                  };

                  const badgeStyle = {
                    color: "var(--Black, #000)",
                    fontFamily,
                    fontStyle: "normal" as const,
                    fontWeight: 400,
                    fontVariationSettings: '"wght" 400',
                    lineHeight: "var(--Line-height-Heading-sm, 19.6px)",
                    textAlign: arabic ? ("right" as const) : undefined,
                  };

                  const badgeClassName = lesson.isFree
                    ? "box-border inline-flex h-[24px] w-[55px] shrink-0 items-center justify-center rounded-[8px] border border-black bg-[#FF8CFF] px-4 text-[14px] lg:h-[31px] lg:w-auto lg:text-[18px]"
                    : "inline-flex h-[31px] shrink-0 items-center rounded-[8px] border border-black bg-white px-[16px] text-[18px]";

                  const lessonTitle = localizedText(arabic, lesson.title, lesson.titleAr);
                  const lessonName = arabic
                    ? `${lesson.index + 1}.${lessonTitle}`
                    : `${lesson.index + 1}. ${lessonTitle}`;
                  const rowContent = (
                    <>
                      <p
                        dir={arabic ? "ltr" : undefined}
                        className="m-0 min-w-0 flex-1 truncate text-[16px] min-[744px]:max-lg:text-[24px] lg:text-[24px]"
                        style={labelStyle}
                      >
                        {arabic ? (
                          <>
                            {lesson.index + 1}
                            .<span>{lessonTitle}</span>
                          </>
                        ) : (
                          lessonName
                        )}
                      </p>
                      {lesson.isAction ? (
                        <span className={badgeClassName} style={badgeStyle}>
                          {t(lesson.right)}
                        </span>
                      ) : (
                        <p className="m-0 text-[16px] lg:text-[24px]" style={labelStyle}>
                          {t(lesson.right)}
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
                            ? `${t("Open free preview")}: ${lessonName}`
                            : `${t("Play free preview")}: ${lessonName}`
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
                      aria-label={`${lessonName} — ${t("locked, subscribe to unlock")}`}
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