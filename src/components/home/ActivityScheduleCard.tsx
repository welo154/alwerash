"use client";

import { useEffect, useState } from "react";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

const WEEK_DAYS = [
  { day: "SUN", date: "15" },
  { day: "MON", date: "16" },
  { day: "TUE", date: "17" },
  { day: "WED", date: "18" },
  { day: "THU", date: "19" },
  { day: "FRI", date: "20" },
  { day: "SAT", date: "21" },
] as const;

const TIME_ROWS = [
  "8:00 am",
  "9:00 am",
  "10:00 am",
  "11:00 am",
  "12:00 pm",
] as const;

/** Day column: 51px wide, 62px gap → 113px step. Lines start 46px before first day. */
const DAY_COL_WIDTH = 51;
const DAY_COL_GAP = 62;
const DAY_COL_STEP = DAY_COL_WIDTH + DAY_COL_GAP;
const SLOT_WIDTH = 106;
const SLOT_HEIGHT = 72;
const LINE_HEIGHT = 0.3;
/** Offset of day columns relative to the time-lines block (191−145). */
const DAYS_OFFSET_IN_LINES = 191 - 145;

type ScheduleSlot = {
  /** Index into TIME_ROWS — slot sits between this time and the next */
  hourIndex: number;
  /** Index into WEEK_DAYS */
  dayIndex: number;
  title: string;
  isCurrentDay: boolean;
};

const SCHEDULE_SLOTS: ScheduleSlot[] = [
  {
    hourIndex: 0,
    dayIndex: 1, // Monday 8–9
    title: "Editorial\nDesign Cl..",
    isCurrentDay: false,
  },
  {
    hourIndex: 3,
    dayIndex: 4, // Thursday 11–12
    title: "UI/UX\nDesign Cl..",
    isCurrentDay: true,
  },
  {
    hourIndex: 1,
    dayIndex: 6, // Saturday 9–10
    title: "Editorial\nDesign Cl..",
    isCurrentDay: false,
  },
];

function slotLeftForDay(dayIndex: number) {
  const dayCenter =
    DAYS_OFFSET_IN_LINES + dayIndex * DAY_COL_STEP + DAY_COL_WIDTH / 2;
  return dayCenter - SLOT_WIDTH / 2;
}

type AddCategory = "course" | "event" | "library";
type CourseAddStep = "courses" | "slots";

type AvailableCourse = {
  id: string;
  title: string;
  mentorName: string;
  /** Truncated label shown on the schedule slot */
  slotTitle: string;
  defaultStartTime: string;
  defaultEndTime: string;
  /** Days after today for the demo start/end date */
  dayOffset: number;
};

/** Demo catalog for the add-course flow (styling first). */
const AVAILABLE_COURSES: AvailableCourse[] = [
  {
    id: "editorial",
    title: "Editorial Design Class",
    mentorName: "Karim Al-Rashid",
    slotTitle: "Editorial\nDesign Cl..",
    defaultStartTime: "8:00 am",
    defaultEndTime: "9:00 am",
    dayOffset: 0,
  },
  {
    id: "uiux",
    title: "UI/UX Design Class",
    mentorName: "Omar Hassan",
    slotTitle: "UI/UX\nDesign Cl..",
    defaultStartTime: "9:00 am",
    defaultEndTime: "10:00 am",
    dayOffset: 0,
  },
  {
    id: "motion",
    title: "Motion Design Class",
    mentorName: "Youssef Mahmoud",
    slotTitle: "Motion\nDesign Cl..",
    defaultStartTime: "10:00 am",
    defaultEndTime: "11:00 am",
    dayOffset: 1,
  },
  {
    id: "brand",
    title: "Brand Identity Class",
    mentorName: "Tariq Nasser",
    slotTitle: "Brand\nIdentity Cl..",
    defaultStartTime: "11:00 am",
    defaultEndTime: "12:00 pm",
    dayOffset: 1,
  },
  {
    id: "figma",
    title: "Figma Fundamentals",
    mentorName: "Omar Hassan",
    slotTitle: "Figma\nFundamen..",
    defaultStartTime: "8:00 am",
    defaultEndTime: "9:00 am",
    dayOffset: 2,
  },
  {
    id: "illustration",
    title: "Digital Illustration",
    mentorName: "Karim Al-Rashid",
    slotTitle: "Digital\nIllustrat..",
    defaultStartTime: "9:00 am",
    defaultEndTime: "10:00 am",
    dayOffset: 2,
  },
  {
    id: "typography",
    title: "Typography Studio",
    mentorName: "Youssef Mahmoud",
    slotTitle: "Typograph\ny Studio..",
    defaultStartTime: "10:00 am",
    defaultEndTime: "11:00 am",
    dayOffset: 3,
  },
  {
    id: "prototype",
    title: "Prototyping in Figma",
    mentorName: "Omar Hassan",
    slotTitle: "Prototypi\nng Figm..",
    defaultStartTime: "11:00 am",
    defaultEndTime: "12:00 pm",
    dayOffset: 3,
  },
];

function dateWithDayOffset(offset: number) {
  const d = clampDateNotBeforeToday(new Date());
  d.setDate(d.getDate() + offset);
  return d;
}

const ADD_CATEGORIES: { id: AddCategory; label: string }[] = [
  { id: "course", label: "Course" },
  { id: "event", label: "Event" },
  { id: "library", label: "Library" },
];

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Schedule dates cannot be before today. */
function clampDateNotBeforeToday(date: Date) {
  const today = startOfToday();
  return date.getTime() < today.getTime() ? today : date;
}

function formatScheduleDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ScheduleChip({ label }: { label: string }) {
  return (
    <div
      className="box-border flex shrink-0 items-center justify-center"
      style={{
        minWidth: 100,
        height: 28,
        padding: "0 16px",
        borderRadius: "var(--Radius-MD, 8px)",
        border: "0.3px solid var(--Black, #000)",
        background: "#FFF",
      }}
    >
      <span
        className="whitespace-nowrap"
        style={{
          color: "var(--Black, #000)",
          fontFamily: pangeaFont,
          fontSize: 14,
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function ScheduleAddModal({
  open,
  onClose,
  onAddCourseSlot,
}: {
  open: boolean;
  onClose: () => void;
  onAddCourseSlot: (slot: ScheduleSlot) => void;
}) {
  const [category, setCategory] = useState<AddCategory>("course");
  const [courseStep, setCourseStep] = useState<CourseAddStep>("courses");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(() => clampDateNotBeforeToday(new Date()));
  const [endDate, setEndDate] = useState(() => clampDateNotBeforeToday(new Date()));
  const [startTime, setStartTime] = useState("8:00 am");
  const [endTime, setEndTime] = useState("9:00 am");

  useEffect(() => {
    if (!open) {
      setCategory("course");
      setCourseStep("courses");
      setSelectedCourseId(null);
      const today = clampDateNotBeforeToday(new Date());
      setStartDate(today);
      setEndDate(today);
      setStartTime("8:00 am");
      setEndTime("9:00 am");
    }
  }, [open]);

  if (!open) return null;

  const selectedCourse = AVAILABLE_COURSES.find((c) => c.id === selectedCourseId);

  const handleSelectCourse = (courseId: string) => {
    const course = AVAILABLE_COURSES.find((c) => c.id === courseId);
    if (!course) return;
    setSelectedCourseId(courseId);
    setCourseStep("slots");
    const date = dateWithDayOffset(course.dayOffset);
    setStartDate(date);
    setEndDate(date);
    setStartTime(course.defaultStartTime);
    setEndTime(course.defaultEndTime);
  };

  const handleConfirmAdd = () => {
    if (!selectedCourse) return;

    const hourIndex = TIME_ROWS.findIndex(
      (t) => t.toLowerCase() === startTime.toLowerCase()
    );
    if (hourIndex < 0 || hourIndex >= TIME_ROWS.length - 1) return;

    const dayIndex = startDate.getDay(); // 0 = Sunday … matches WEEK_DAYS
    const today = startOfToday();
    const isCurrentDay =
      startDate.getFullYear() === today.getFullYear() &&
      startDate.getMonth() === today.getMonth() &&
      startDate.getDate() === today.getDate();

    onAddCourseSlot({
      hourIndex,
      dayIndex,
      title: selectedCourse.slotTitle,
      isCurrentDay,
    });
    onClose();
  };

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center p-4"
      aria-modal
      role="dialog"
      aria-label="Add schedule item"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 z-0 bg-black/20"
        aria-label="Close add dialog"
      />
      <div
        className="relative z-10 box-border flex shrink-0 flex-col overflow-hidden"
        style={{
          width: 481,
          height: 215,
          borderRadius: 20,
          border: "2px solid var(--Green, #8AF396)",
          background: "var(--White, #FFF)",
          boxShadow: "4px 4px 10px 0 rgba(0, 0, 0, 0.25)",
          paddingTop: 16,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {category === "course" && courseStep === "slots" && selectedCourse ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <div style={{ paddingLeft: 24, paddingRight: 24 }}>
              <button
                type="button"
                onClick={() => {
                  setCourseStep("courses");
                  setSelectedCourseId(null);
                }}
                className="border-0 bg-transparent p-0"
                style={{
                  color: "var(--Purple, #FF8CFF)",
                  fontFamily: pangeaFont,
                  fontSize: 16,
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "normal",
                  cursor: "pointer",
                }}
              >
                Course
              </button>
              <div className="flex flex-col" style={{ marginTop: 6 }}>
                <span
                  style={{
                    color: "var(--Black, #000)",
                    fontFamily: pangeaFont,
                    fontSize: 18,
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",
                  }}
                >
                  {selectedCourse.title}
                </span>
                <span
                  style={{
                    marginTop: 1,
                    color: "var(--Black, #000)",
                    fontFamily: pangeaFont,
                    fontSize: 16,
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",
                    opacity: 0.6,
                  }}
                >
                  {selectedCourse.mentorName}
                </span>
              </div>
            </div>

            <div
              className="w-full shrink-0"
              style={{
                marginTop: 13,
                height: 0.3,
                background: "#8AF396",
              }}
            />

            <div style={{ marginTop: 19, paddingLeft: 30 }}>
              <div className="flex items-center">
                <span
                  className="shrink-0"
                  style={{
                    width: 56,
                    color: "var(--Black, #000)",
                    fontFamily: pangeaFont,
                    fontSize: 18,
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",
                  }}
                >
                  Starts
                </span>
                <div className="flex items-center" style={{ marginLeft: 28, gap: 9 }}>
                  <ScheduleChip label={formatScheduleDate(startDate)} />
                  <ScheduleChip label={startTime} />
                </div>
              </div>

              <div className="flex items-center" style={{ marginTop: 8 }}>
                <span
                  className="shrink-0"
                  style={{
                    width: 56,
                    color: "var(--Black, #000)",
                    fontFamily: pangeaFont,
                    fontSize: 18,
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",
                  }}
                >
                  Ends
                </span>
                <div className="flex items-center" style={{ marginLeft: 28, gap: 9 }}>
                  <ScheduleChip label={formatScheduleDate(endDate)} />
                  <ScheduleChip label={endTime} />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmAdd}
              className="absolute border-0 bg-transparent p-0"
              style={{
                right: 27,
                bottom: 21,
                width: 40,
                height: 40,
                cursor: "pointer",
              }}
              aria-label="Add course to schedule"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                aria-hidden
                className="block"
              >
                <circle cx="20" cy="20" r="19" stroke="#EA83F0" strokeWidth="2" />
                <path
                  d="M30 14L15.5625 28L9 21.6364"
                  stroke="#EA83F0"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ) : (
          <>
            <div
              className="flex shrink-0 items-center"
              style={{ paddingLeft: 24, gap: 26 }}
              role="tablist"
              aria-label="Add type"
            >
              {ADD_CATEGORIES.map(({ id, label }) => {
                const selected = category === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => {
                      setCategory(id);
                      if (id === "course") {
                        setCourseStep("courses");
                        setSelectedCourseId(null);
                      }
                    }}
                    className="border-0 bg-transparent p-0"
                    style={{
                      color: selected ? "var(--Purple, #FF8CFF)" : "#000",
                      fontFamily: pangeaFont,
                      fontSize: 16,
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "normal",
                      opacity: selected ? 1 : 0.6,
                      cursor: "pointer",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div
              className="w-full shrink-0"
              style={{
                marginTop: 13,
                height: 0.3,
                background: "#8AF396",
              }}
            />

            <div className="schedule-add-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
              {category === "course" && courseStep === "courses" ? (
                <ul className="m-0 list-none p-0">
                  {AVAILABLE_COURSES.map((course) => (
                    <li key={course.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectCourse(course.id)}
                        className="flex w-full flex-col border-0 bg-transparent text-left"
                        style={{
                          padding: 0,
                          cursor: "pointer",
                        }}
                      >
                        <span
                          className="flex flex-col"
                          style={{
                            paddingTop: 11,
                            paddingLeft: 24,
                            paddingRight: 24,
                          }}
                        >
                          <span
                            style={{
                              color: "var(--Black, #000)",
                              fontFamily: pangeaFont,
                              fontSize: 18,
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "normal",
                            }}
                          >
                            {course.title}
                          </span>
                          <span
                            style={{
                              marginTop: 1,
                              color: "var(--Black, #000)",
                              fontFamily: pangeaFont,
                              fontSize: 16,
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "normal",
                              opacity: 0.6,
                            }}
                          >
                            {course.mentorName}
                          </span>
                        </span>
                        <span
                          aria-hidden
                          className="block w-full"
                          style={{
                            marginTop: 10,
                            height: 0.3,
                            background: "#8AF396",
                          }}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}

              {category !== "course" ? (
                <p
                  className="m-0"
                  style={{
                    padding: "16px 24px",
                    fontFamily: pangeaFont,
                    fontSize: 16,
                    opacity: 0.6,
                  }}
                >
                  Coming soon
                </p>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ActivityScheduleModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [addOpen, setAddOpen] = useState(false);
  const [slots, setSlots] = useState<ScheduleSlot[]>(SCHEDULE_SLOTS);

  useEffect(() => {
    if (!open) setAddOpen(false);
  }, [open]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (addOpen) {
        setAddOpen(false);
        return;
      }
      onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, addOpen, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex h-full items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      aria-modal
      role="dialog"
      aria-label="Schedule"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 z-0"
        aria-label="Close overlay"
      />
      <div
        className="relative z-10 box-border flex max-h-[90vh] w-full max-w-[1041px] shrink-0 flex-col overflow-visible rounded-[50px] border-2 border-[var(--Green,#8AF396)] bg-[var(--White,#FFF)]"
        style={{
          aspectRatio: "1041 / 599",
          paddingLeft: 48,
          paddingRight: 40,
          paddingTop: 78,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="absolute z-20 flex h-10 w-[39px] items-center justify-center border-0 bg-transparent p-0"
          style={{
            top: 78 - 13 - 40,
            right: 40,
          }}
          aria-label="Add schedule item"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="41"
            viewBox="0 0 40 41"
            fill="none"
            aria-hidden
            className="block"
          >
            <path
              d="M19.75 12.25V20.25V24.25V28.25M11.95 20.25H27.55M39.25 20.25C39.25 31.2957 30.5196 40.25 19.75 40.25C8.98045 40.25 0.25 31.2957 0.25 20.25C0.25 9.2043 8.98045 0.25 19.75 0.25C30.5196 0.25 39.25 9.2043 39.25 20.25Z"
              stroke="#1E1E1E"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="flex w-full items-center justify-between">
          <div
            className="box-border flex h-[51px] w-[97px] shrink-0 items-center justify-center rounded-[var(--Radius-MD,8px)] border-[0.3px] border-[var(--Black,#000)] bg-[var(--White,#FFF)] px-4"
          >
            <span
              style={{
                color: "var(--Black, #000)",
                textAlign: "center",
                fontFamily: pangeaFont,
                fontSize: 18,
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "var(--Line-height-Heading-sm, 19.6px)",
              }}
            >
              MAY
            </span>
          </div>

          <h2
            className="m-0"
            style={{
              color: "var(--Black, #000)",
              fontFamily: pangeaFont,
              fontSize: 36,
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "120%",
            }}
          >
            JUNE 2026
          </h2>

          <div
            className="box-border flex h-[51px] w-[97px] shrink-0 items-center justify-center rounded-[var(--Radius-MD,8px)] border-[0.3px] border-[var(--Black,#000)] bg-[var(--White,#FFF)] px-4"
          >
            <span
              style={{
                color: "var(--Black, #000)",
                textAlign: "center",
                fontFamily: pangeaFont,
                fontSize: 18,
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "var(--Line-height-Heading-sm, 19.6px)",
              }}
            >
              JULY
            </span>
          </div>
        </div>

        <div
          className="flex shrink-0"
          style={{
            marginTop: 50,
            /* 191px from modal left; content already has 48px padding */
            marginLeft: 191 - 48,
            gap: DAY_COL_GAP,
          }}
        >
          {WEEK_DAYS.map(({ day, date }) => (
            <div
              key={day}
              className="flex shrink-0 flex-col items-center justify-center text-center"
              style={{
                width: DAY_COL_WIDTH,
                color: "var(--Black, #000)",
                fontFamily: pangeaFont,
                fontSize: 18,
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
                opacity: 0.4,
              }}
            >
              <span>{day}</span>
              <span>{date}</span>
            </div>
          ))}
        </div>

        <div
          className="relative flex flex-col"
          style={{
            marginTop: 28,
            gap: SLOT_HEIGHT,
          }}
        >
          {TIME_ROWS.map((time) => (
            <div
              key={time}
              className="relative flex shrink-0 items-center"
              style={{
                /* 145px from modal left; content already has 48px padding */
                marginLeft: 145 - 48,
              }}
            >
              <span
                className="absolute whitespace-nowrap"
                style={{
                  right: "100%",
                  marginRight: 16,
                  color: "var(--Black, #000)",
                  fontFamily: pangeaFont,
                  fontSize: 18,
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "normal",
                }}
              >
                {time}
              </span>
              <div
                className="shrink-0"
                style={{
                  width: 856,
                  height: LINE_HEIGHT,
                  background: "#8AF396",
                }}
              />
            </div>
          ))}

          {slots.map((slot) => {
            const slotKey = `${slot.dayIndex}-${slot.hourIndex}-${slot.title}`;
            return (
              <div
                key={slotKey}
                className="group absolute box-border flex items-center justify-center"
                style={{
                  top: slot.hourIndex * (SLOT_HEIGHT + LINE_HEIGHT) + LINE_HEIGHT,
                  left: 145 - 48 + slotLeftForDay(slot.dayIndex),
                  width: SLOT_WIDTH,
                  height: SLOT_HEIGHT,
                  padding: "0 16px",
                  borderRadius: 24,
                  border: "0.3px solid var(--Black, #000)",
                  background: slot.isCurrentDay
                    ? "var(--Purple, #FF8CFF)"
                    : "var(--Grey, #E9E9E9)",
                }}
              >
                <span
                  className="whitespace-pre-line text-center"
                  style={{
                    color: "var(--Black, #000)",
                    fontFamily: pangeaFont,
                    fontSize: 16,
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: slot.isCurrentDay ? "19px" : "16px",
                    opacity: slot.isCurrentDay ? 1 : 0.5,
                  }}
                >
                  {slot.title}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setSlots((prev) =>
                      prev.filter(
                        (s) =>
                          !(
                            s.dayIndex === slot.dayIndex &&
                            s.hourIndex === slot.hourIndex &&
                            s.title === slot.title
                          )
                      )
                    )
                  }
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full border-0 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ background: "rgba(255, 255, 255, 0.6)" }}
                  aria-label="Remove course from schedule"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5"
                      stroke="#000"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <ScheduleAddModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAddCourseSlot={(slot) =>
          setSlots((prev) => {
            const withoutOverlap = prev.filter(
              (s) =>
                !(s.dayIndex === slot.dayIndex && s.hourIndex === slot.hourIndex)
            );
            return [...withoutOverlap, slot];
          })
        }
      />
    </div>
  );
}

export function ActivityScheduleCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative box-border h-[401px] w-[727px] max-w-full shrink-0 cursor-pointer overflow-hidden rounded-[50px] border border-[var(--Black,#000)] bg-[var(--White,#FFF)] p-0 text-left transition-[border-color,box-shadow] duration-200 hover:border-[var(--Green,#8AF396)] hover:shadow-[0_0_0_1px_var(--Green,#8AF396)]"
        aria-label="Activity details card"
      >
        <div className="absolute left-[34px] top-[33px] flex h-[36px] w-[68px] items-center justify-center rounded-[8px] border border-[var(--Black,#000)] bg-white px-[16px]">
          <span
            style={{
              color: "#000",
              fontFamily: pangeaFont,
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "19.6px",
              fontVariationSettings: '"wght" 400',
            }}
          >
            MAY
          </span>
        </div>

        <h3
          className="absolute left-[277px] top-[26px] m-0"
          style={{
            color: "#000",
            fontFamily: pangeaFont,
            fontSize: "36px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "120%",
            fontVariationSettings: '"wght" 400',
          }}
        >
          JUNE 2026
        </h3>

        <div className="absolute left-[626px] top-[33px] flex h-[36px] w-[73px] items-center justify-center rounded-[8px] border border-[var(--Black,#000)] bg-white px-[16px]">
          <span
            style={{
              color: "#000",
              fontFamily: pangeaFont,
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "19.6px",
              fontVariationSettings: '"wght" 400',
            }}
          >
            JULY
          </span>
        </div>

        <div className="absolute left-[124px] top-[93px] text-center text-[18px] leading-normal text-black opacity-40">
          <p className="m-0" style={{ fontFamily: pangeaFont }}>
            SUN
          </p>
          <p className="m-0" style={{ fontFamily: pangeaFont }}>
            15
          </p>
        </div>
        <div className="absolute left-[203px] top-[93px] text-center text-[18px] leading-normal text-black opacity-40">
          <p className="m-0" style={{ fontFamily: pangeaFont }}>
            MON
          </p>
          <p className="m-0" style={{ fontFamily: pangeaFont }}>
            16
          </p>
        </div>
        <div className="absolute left-[287px] top-[93px] text-center text-[18px] leading-normal text-black opacity-40">
          <p className="m-0" style={{ fontFamily: pangeaFont }}>
            TUE
          </p>
          <p className="m-0" style={{ fontFamily: pangeaFont }}>
            17
          </p>
        </div>
        <div className="absolute left-[363px] top-[93px] text-center text-[18px] leading-normal text-black">
          <p className="m-0" style={{ fontFamily: pangeaFont }}>
            WED
          </p>
          <p className="m-0" style={{ fontFamily: pangeaFont }}>
            18
          </p>
        </div>
        <div className="absolute left-[447px] top-[93px] text-center text-[18px] leading-normal text-black opacity-40">
          <p className="m-0" style={{ fontFamily: pangeaFont }}>
            THU
          </p>
          <p className="m-0" style={{ fontFamily: pangeaFont }}>
            19
          </p>
        </div>
        <div className="absolute left-[525px] top-[93px] text-center text-[18px] leading-normal text-black opacity-40">
          <p className="m-0" style={{ fontFamily: pangeaFont }}>
            FRI
          </p>
          <p className="m-0" style={{ fontFamily: pangeaFont }}>
            20
          </p>
        </div>

        <p
          className="absolute left-[28px] top-[185px] m-0"
          style={{
            color: "var(--Black, #000)",
            fontFamily: pangeaFont,
            fontSize: "18px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
            fontVariationSettings: '"wght" 400',
          }}
        >
          8:00 am
        </p>
        <p
          className="absolute left-[28px] top-[235px] m-0"
          style={{
            color: "var(--Black, #000)",
            fontFamily: pangeaFont,
            fontSize: "18px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
            fontVariationSettings: '"wght" 400',
          }}
        >
          9:00 am
        </p>
        <p
          className="absolute left-[29px] top-[285px] m-0"
          style={{
            color: "var(--Black, #000)",
            fontFamily: pangeaFont,
            fontSize: "18px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
            fontVariationSettings: '"wght" 400',
          }}
        >
          10:00 am
        </p>
        <p
          className="absolute left-[28px] top-[335px] m-0"
          style={{
            color: "var(--Black, #000)",
            fontFamily: pangeaFont,
            fontSize: "18px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
            fontVariationSettings: '"wght" 400',
          }}
        >
          11:00 am
        </p>

        <div
          className="absolute left-[132px] top-[237px] inline-flex h-[74px] w-fit flex-col items-start justify-center rounded-[24px] border border-[var(--Black,#000)] px-[16px]"
          style={{ background: "var(--Purple, #FF8CFF)" }}
        >
          <div className="flex items-center justify-start gap-[8px]">
            <p
              className="m-0"
              style={{
                color: "#000",
                fontFamily: pangeaFont,
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "23px",
                fontVariationSettings: '"wght" 500',
              }}
            >
              {"WHAT'S FIGMA?"}
            </p>
            <p
              className="m-0"
              style={{
                color: "#000",
                fontFamily: pangeaFont,
                fontSize: "18px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "23px",
                opacity: 0.6,
                fontVariationSettings: '"wght" 400',
              }}
            >
              40mins
            </p>
          </div>
          <p
            className="m-0 text-left"
            style={{
              color: "#000",
              fontFamily: pangeaFont,
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "23px",
              opacity: 0.6,
              fontVariationSettings: '"wght" 400',
            }}
          >
            UI/UX Design Class with Mohamed Tarek Mostafa
          </p>
        </div>
      </button>

      <ActivityScheduleModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
