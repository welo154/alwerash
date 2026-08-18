"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CoursesMenuLink = { label: string; href: string };
type CoursesMenuPayload = {
  allCourses: CoursesMenuLink[];
  software: CoursesMenuLink[];
};

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

const MAX_COLUMN_ITEMS = 8;
const HIDDEN_TRACK_HREFS = new Set([
  "/tracks/graphic-design",
  "/tracks/motion-design",
  "/tracks/design-softwares",
]);

const itemClassName =
  "block h-[33px] max-w-full overflow-hidden text-ellipsis whitespace-nowrap leading-[33px] text-[18px] font-normal text-black hover:opacity-70";

const headingClassName =
  "mb-0 inline-flex items-center text-[18px] font-bold uppercase leading-[33px] text-black hover:opacity-70";

const viewMoreClassName =
  "flex h-[33px] items-center leading-[33px] whitespace-nowrap text-[18px] font-normal text-black underline underline-offset-2 hover:opacity-70";

function visibleLinks(items: CoursesMenuLink[]) {
  return items
    .filter((item) => !HIDDEN_TRACK_HREFS.has(item.href))
    .slice(0, MAX_COLUMN_ITEMS);
}

export function CoursesMegaMenuPanel() {
  const [menu, setMenu] = useState<CoursesMenuPayload | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/catalog/courses-menu", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) return null;
        const data = (await res.json()) as CoursesMenuPayload;
        if (!Array.isArray(data.allCourses) || !Array.isArray(data.software)) {
          return null;
        }
        return data;
      })
      .then((next) => {
        if (!cancelled && next) setMenu(next);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const allCourses = visibleLinks(menu?.allCourses ?? []);
  const software = visibleLinks(menu?.software ?? []);

  return (
    <div
      className="w-[582px] rounded-[50px] border border-black bg-white px-[35px] py-[28px] shadow-[4px_4px_10px_0_rgba(0,0,0,0.25)]"
      style={{ fontFamily: pangeaFont }}
    >
      <div className="grid grid-cols-2 gap-x-8 text-black">
        <div className="min-w-0 overflow-hidden">
          <Link href="/course" className={headingClassName}>
            ALL COURSES <span aria-hidden>↗</span>
          </Link>
          {allCourses.length > 0 ? (
            <ul className="space-y-0 text-[18px] font-normal text-black">
              {allCourses.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={itemClassName}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="min-w-0 overflow-hidden">
          <Link href="/tracks/design-softwares" className={headingClassName}>
            SOFTWARE <span aria-hidden>↗</span>
          </Link>
          {software.length > 0 ? (
            <ul className="space-y-0 text-[18px] font-normal text-black">
              {software.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={itemClassName}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <Link href="/course" className={`${viewMoreClassName} mt-[12px]`}>
        View more
      </Link>
    </div>
  );
}
