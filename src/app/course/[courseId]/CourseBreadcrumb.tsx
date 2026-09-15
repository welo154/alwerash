import Link from "next/link";

type CourseBreadcrumbProps = {
  courseTitle: string;
  fontFamily: string;
};

function BreadcrumbChevron() {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="5"
        height="10"
        viewBox="0 0 5 10"
        fill="none"
        className="h-[10px] w-[5px] shrink-0 min-[744px]:hidden"
        aria-hidden
      >
        <path
          opacity="0.6"
          d="M0.5 9.5L4.5 5L0.5 0.5"
          stroke="var(--Black, #000)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="8"
        height="15"
        viewBox="0 0 8 15"
        fill="none"
        className="hidden h-[15px] w-[8px] shrink-0 min-[744px]:block"
        style={{ opacity: 0.6 }}
        aria-hidden
      >
        <path
          d="M0.75 13.75L6.75 7.25L0.749999 0.75"
          stroke="var(--Black, #000)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
}

export function CourseBreadcrumb({ courseTitle, fontFamily }: CourseBreadcrumbProps) {
  const textStyle = {
    color: "var(--Black, #000)",
    fontFamily,
    fontStyle: "normal" as const,
    fontWeight: 400,
    opacity: 0.6,
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-[18px] min-[744px]:gap-[15px]"
    >
      <Link
        href="/course"
        className="text-[14px] leading-[127%] hover:opacity-80 min-[744px]:text-[18px] min-[744px]:leading-normal"
        style={textStyle}
      >
        Courses
      </Link>
      <BreadcrumbChevron />
      <Link
        href="/course"
        className="text-[14px] leading-[127%] hover:opacity-80 min-[744px]:text-[18px] min-[744px]:leading-normal"
        style={textStyle}
      >
        Classes
      </Link>
      <BreadcrumbChevron />
      <span
        className="text-[14px] leading-[127%] min-[744px]:text-[18px] min-[744px]:leading-normal"
        style={textStyle}
      >
        {courseTitle}
      </span>
    </nav>
  );
}
