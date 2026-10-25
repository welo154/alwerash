"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";

import { COURSE_FILTER_ACTIONS } from "@/components/learn/course-filter-actions";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

const NAV_HEADING_STYLE = {
  color: "var(--Black, #000)",
  fontFamily: pangeaFont,
  fontSize: 24,
  fontStyle: "normal" as const,
  fontWeight: 500,
  lineHeight: "200%",
  fontVariationSettings: '"wght" 500',
};

const NAV_LINE_BAND_PX = 51;
const NAV_HEADING_LINE_PX = 24 * 2;
const NAV_HEADING_TO_LINE_GAP_PX = (NAV_LINE_BAND_PX - NAV_HEADING_LINE_PX) / 2;
const NAV_WIDTH_PX = 266;
const NAV_LINE = { width: NAV_WIDTH_PX, height: 0.3, background: "#000" } as const;

const EXPAND_TRANSITION =
  "grid-template-rows 480ms cubic-bezier(0.22, 1, 0.36, 1)";

type SectionId = "courses" | "categories" | "software";

type NavItem = {
  key: string;
  label: string;
  href?: string;
};

const sidebarSoftware = [
  { label: "Adobe Photoshop", href: "/course" },
  { label: "Adobe Illustrator", href: "/course" },
  { label: "Adobe InDesign", href: "/course" },
  { label: "Adobe After Effects", href: "/course" },
  { label: "Canva", href: "/course" },
  { label: "Procreate", href: "/course" },
  { label: "+ See More", href: "/tracks/design-softwares" },
] as const;

function itemStyle(active: boolean) {
  return {
    fontFamily: pangeaFont,
    fontSize: "18px",
    fontWeight: 400,
    lineHeight: "28.98px",
    color: active ? "#FF8CFF" : "#000",
    cursor: "pointer" as const,
  };
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  return reduced;
}

function scrollToSection(targetId: string) {
  window.setTimeout(() => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 0);
}

function ExpandableSection({
  id,
  label,
  headingLevel,
  open,
  onToggle,
  showTopGap,
  showUnderline,
  reduceMotion,
  children,
}: {
  id: string;
  label: string;
  headingLevel: 2 | 3;
  open: boolean;
  onToggle: () => void;
  showTopGap: boolean;
  showUnderline: boolean;
  reduceMotion: boolean;
  children: React.ReactNode;
}) {
  const HeadingTag = headingLevel === 2 ? "h2" : "h3";
  const panelId = `${id}-panel`;

  return (
    <div className="w-[266px]">
      {showTopGap ? <div aria-hidden style={{ height: NAV_HEADING_TO_LINE_GAP_PX }} /> : null}
      <HeadingTag className="m-0">
        <button
          type="button"
          id={id}
          className="m-0 w-full cursor-pointer border-0 bg-transparent p-0 text-left uppercase outline-none hover:opacity-80 focus-visible:opacity-80"
          style={NAV_HEADING_STYLE}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
        >
          {label}
        </button>
      </HeadingTag>

      <div
        id={panelId}
        role="region"
        aria-labelledby={id}
        aria-hidden={!open}
        className="grid"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: reduceMotion ? "none" : EXPAND_TRANSITION,
        }}
      >
        <div className="min-h-0 overflow-hidden" {...(!open ? { inert: true } : {})}>
          <div className="flex items-stretch pt-[8px] pb-[10px]">
            <div
              aria-hidden
              className="shrink-0 self-stretch"
              style={{ width: 1, background: "#000" }}
            />
            <div className="min-w-0 flex-1" style={{ marginLeft: 11 }}>
              {children}
            </div>
          </div>
        </div>
      </div>

      {showUnderline ? (
        <>
          <div aria-hidden style={{ height: NAV_HEADING_TO_LINE_GAP_PX }} />
          <div aria-hidden style={NAV_LINE} />
        </>
      ) : null}
    </div>
  );
}

function NavTextButton({
  children,
  active = false,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full cursor-pointer border-0 bg-transparent p-0 text-left hover:opacity-80 focus-visible:opacity-80"
      style={itemStyle(active)}
    >
      {children}
    </button>
  );
}

export function CoursesPageExpandableNav({
  courseFilters,
  categories,
  activeCategoryKey,
  defaultSection = "courses",
}: {
  courseFilters: readonly string[];
  categories: NavItem[];
  activeCategoryKey?: string;
  defaultSection?: SectionId;
}) {
  const router = useRouter();
  const uid = useId();
  const reduceMotion = usePrefersReducedMotion();
  const [openSection, setOpenSection] = useState<SectionId | null>(defaultSection);

  const toggle = (id: SectionId) => {
    setOpenSection((current) => (current === id ? null : id));
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

    if (action.scrollTargetId) {
      scrollToSection(action.scrollTargetId);
    }
  };

  const onCategorySelect = (item: NavItem) => {
    if (item.href) {
      router.push(item.href);
      return;
    }
    scrollToSection("all-courses");
  };

  return (
    <nav aria-label="Course sections" className="w-[266px]">
      <ExpandableSection
        id={`${uid}-courses`}
        label="COURSES"
        headingLevel={2}
        open={openSection === "courses"}
        onToggle={() => toggle("courses")}
        showTopGap={false}
        showUnderline
        reduceMotion={reduceMotion}
      >
        <ul className="m-0 list-none space-y-0.5 p-0">
          {courseFilters.map((item, idx) => (
            <li key={item}>
              <NavTextButton active={idx === 0} onClick={() => applyCourseFilter(item)}>
                {item}
              </NavTextButton>
            </li>
          ))}
        </ul>
      </ExpandableSection>

      <ExpandableSection
        id={`${uid}-categories`}
        label="CATEGORIES"
        headingLevel={3}
        open={openSection === "categories"}
        onToggle={() => toggle("categories")}
        showTopGap
        showUnderline
        reduceMotion={reduceMotion}
      >
        <ul className="m-0 list-none space-y-0.5 p-0">
          {categories.map((item) => (
            <li key={item.key}>
              {item.href ? (
                <Link
                  href={item.href}
                  className="block cursor-pointer no-underline hover:opacity-80 focus-visible:opacity-80"
                  style={itemStyle(activeCategoryKey === item.key)}
                >
                  {item.label}
                </Link>
              ) : (
                <NavTextButton
                  active={activeCategoryKey === item.key}
                  onClick={() => onCategorySelect(item)}
                >
                  {item.label}
                </NavTextButton>
              )}
            </li>
          ))}
        </ul>
      </ExpandableSection>

      <ExpandableSection
        id={`${uid}-software`}
        label="SOFTWARE"
        headingLevel={3}
        open={openSection === "software"}
        onToggle={() => toggle("software")}
        showTopGap
        showUnderline={false}
        reduceMotion={reduceMotion}
      >
        <ul className="m-0 list-none space-y-0.5 p-0">
          {sidebarSoftware.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="block cursor-pointer no-underline hover:opacity-80 focus-visible:opacity-80"
                style={itemStyle(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </ExpandableSection>
    </nav>
  );
}
