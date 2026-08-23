"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import type { LearnCourseTypeFilter } from "@/components/learn/learn-all-courses-types";
import {
  LEARN_SIDEBAR_COURSE_FILTERS,
  LEARN_SIDEBAR_EXTRA_CATEGORIES,
  type LearnCoursesSidebarCategory,
} from "@/components/learn/LearnCoursesSidebar";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

type OpenMenu = "courses" | "categories" | null;

type CourseFilterAction = {
  type?: LearnCourseTypeFilter;
  scrollTargetId?: string;
};

const COURSE_FILTER_ACTIONS: Record<string, CourseFilterAction> = {
  "All Couses": { type: "all", scrollTargetId: "all-courses" },
  "Top Rated": { type: "topRated", scrollTargetId: "all-courses" },
  "Deep Dive": { type: "deepDive", scrollTargetId: "all-courses" },
  "Popular Courses": { scrollTargetId: "popular-classes" },
};

function FilterChevron({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="6"
      viewBox="0 0 15 8"
      fill="none"
      aria-hidden
      className={`shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M0.599609 0.599609L7.09961 6.59961L13.5996 0.599609"
        stroke="black"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FilterPill({
  label,
  open,
  onToggle,
  menuId,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  menuId: string;
}) {
  return (
    <button
      type="button"
      id={menuId}
      aria-haspopup="menu"
      aria-expanded={open}
      onClick={onToggle}
      className="box-border inline-flex h-[26px] min-w-[101px] items-center justify-center gap-[7px] rounded-[8px] border-[0.3px] border-black bg-white px-4 text-black"
      style={{
        fontFamily: pangeaFont,
        fontSize: "14px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "19.6px",
      }}
    >
      <span className="text-center">{label}</span>
      <FilterChevron open={open} />
    </button>
  );
}

export function LearnCoursesPageFilterBar({
  categories,
}: {
  categories: LearnCoursesSidebarCategory[];
}) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);

  const categoryItems = useMemo(
    () => [...categories, ...LEARN_SIDEBAR_EXTRA_CATEGORIES],
    [categories]
  );

  useEffect(() => {
    if (!openMenu) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu]);

  const scrollToSection = (targetId: string) => {
    window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const applyCourseFilter = (label: string) => {
    const action = COURSE_FILTER_ACTIONS[label] ?? { scrollTargetId: "all-courses" };
    const params = new URLSearchParams(window.location.search);

    if (action.type) {
      if (action.type === "all") params.delete("type");
      else params.set("type", action.type);
    }

    const query = params.toString();
    router.replace(query ? `/course?${query}` : "/course", { scroll: false });
    setOpenMenu(null);

    if (action.scrollTargetId) {
      scrollToSection(action.scrollTargetId);
    }
  };

  const onCategorySelect = (item: LearnCoursesSidebarCategory) => {
    setOpenMenu(null);
    if (item.href) {
      router.push(item.href);
      return;
    }
    scrollToSection("all-courses");
  };

  const menuClassName =
    "absolute top-[calc(100%+8px)] z-50 max-h-[280px] min-w-[220px] overflow-y-auto rounded-[8px] border border-black bg-white py-2 shadow-[4px_4px_10px_0_rgba(0,0,0,0.25)]";

  return (
    <div ref={rootRef} className="flex justify-center gap-[10px]">
      <div className="relative">
        <FilterPill
          label="Courses"
          open={openMenu === "courses"}
          onToggle={() => setOpenMenu((prev) => (prev === "courses" ? null : "courses"))}
          menuId="learn-courses-page-courses-menu"
        />
        {openMenu === "courses" ? (
          <ul
            role="menu"
            aria-labelledby="learn-courses-page-courses-menu"
            className={`${menuClassName} left-1/2 -translate-x-1/2`}
            style={{ fontFamily: pangeaFont }}
          >
            {LEARN_SIDEBAR_COURSE_FILTERS.map((item) => (
              <li key={item} role="none">
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full px-4 py-2 text-left text-[14px] font-normal leading-[19.6px] text-black transition-colors hover:bg-[#8AF396]"
                  onClick={() => applyCourseFilter(item)}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="relative">
        <FilterPill
          label="Categories"
          open={openMenu === "categories"}
          onToggle={() => setOpenMenu((prev) => (prev === "categories" ? null : "categories"))}
          menuId="learn-courses-page-categories-menu"
        />
        {openMenu === "categories" ? (
          <ul
            role="menu"
            aria-labelledby="learn-courses-page-categories-menu"
            className={`${menuClassName} left-1/2 -translate-x-1/2`}
            style={{ fontFamily: pangeaFont }}
          >
            {categoryItems.map((item) => (
              <li key={item.key} role="none">
                {"href" in item && item.href ? (
                  <Link
                    href={item.href}
                    role="menuitem"
                    className="flex w-full px-4 py-2 text-left text-[14px] font-normal leading-[19.6px] text-black no-underline transition-colors hover:bg-[#8AF396]"
                    onClick={() => setOpenMenu(null)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    type="button"
                    role="menuitem"
                    className="flex w-full px-4 py-2 text-left text-[14px] font-normal leading-[19.6px] text-black transition-colors hover:bg-[#8AF396]"
                    onClick={() => onCategorySelect(item)}
                  >
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
