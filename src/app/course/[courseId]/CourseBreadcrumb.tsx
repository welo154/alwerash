import Link from "next/link";

type CourseBreadcrumbProps = {
  courseTitle: string;
  fontFamily: string;
};

function BreadcrumbChevron() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="15"
      viewBox="0 0 8 15"
      fill="none"
      className="h-[15px] w-[8px] shrink-0"
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
  );
}

export function CourseBreadcrumb({ courseTitle, fontFamily }: CourseBreadcrumbProps) {
  const textStyle = {
    color: "var(--Black, #000)",
    fontFamily,
    fontSize: "18px",
    fontStyle: "normal" as const,
    fontWeight: 400,
    lineHeight: "normal",
    opacity: 0.6,
  };

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-[15px]">
      <Link href="/course" className="hover:opacity-80" style={textStyle}>
        Courses
      </Link>
      <BreadcrumbChevron />
      <Link href="/course" className="hover:opacity-80" style={textStyle}>
        Classes
      </Link>
      <BreadcrumbChevron />
      <span style={textStyle}>{courseTitle}</span>
    </nav>
  );
}
