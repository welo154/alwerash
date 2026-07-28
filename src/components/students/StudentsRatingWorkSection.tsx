import Link from "next/link";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

export type StudentRatingCard = {
  quote: string;
  initials: string;
  name: string;
  rating: string;
  role: string;
};

const DEFAULT_CARDS: StudentRatingCard[] = [
  {
    quote:
      "This class helped me understand that I already have a style within me... and all I need to do is trust myself and my process. The exercises and the way Ali explains them are awesome. Thank you for sharing.",
    initials: "MS",
    name: "MOHAMED SABRY",
    rating: "4.5",
    role: "Graphic designer",
  },
  {
    quote:
      "This class helped me understand that I already have a style within me... and all I need to do is trust myself and my process. The exercises and the way Ali explains them are awesome. Thank you for sharing.",
    initials: "MS",
    name: "MOHAMED SABRY",
    rating: "4.5",
    role: "Graphic designer",
  },
  {
    quote:
      "This class helped me understand that I already have a style within me... and all I need to do is trust myself and my process. The exercises and the way Ali explains them are awesome. Thank you for sharing.",
    initials: "MS",
    name: "MOHAMED SABRY",
    rating: "4.5",
    role: "Graphic designer",
  },
  {
    quote:
      "This class helped me understand that I already have a style within me... and all I need to do is trust myself and my process. The exercises and the way Ali explains them are awesome. Thank you for sharing.",
    initials: "MS",
    name: "MOHAMED SABRY",
    rating: "4.5",
    role: "Graphic designer",
  },
];

function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      aria-hidden
    >
      <path
        d="M8.5 0L11.1265 5.59516L17 6.4979L12.75 10.8507L13.753 17L8.5 14.0952L3.247 17L4.25 10.8507L0 6.4979L5.8735 5.59516L8.5 0Z"
        fill="var(--Black, #000)"
      />
    </svg>
  );
}

function ViewAllCommentsArrow() {
  return (
    <svg
      className="ml-[18px] shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      width="35"
      height="36"
      viewBox="0 0 37 38"
      fill="none"
      aria-hidden
    >
      <path
        d="M18.5 26.2L25.5 19M25.5 19L18.5 11.8M25.5 19L11.5 19M36 19C36 28.9411 28.165 37 18.5 37C8.83502 37 1 28.9411 1 19C1 9.05887 8.83502 1 18.5 1C28.165 1 36 9.05887 36 19Z"
        stroke="var(--White, #FFF)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type StudentsRatingWorkSectionProps = {
  cards?: StudentRatingCard[];
  viewAllHref?: string;
  className?: string;
  /** Extra top margin wrapper (e.g. course page `mt-[66px]`). */
  sectionClassName?: string;
};

/**
 * Dark-green “STUDENTS RATING & WORK” panel — same layout as the public course page.
 */
export function StudentsRatingWorkSection({
  cards = DEFAULT_CARDS,
  viewAllHref = "/course",
  className = "",
  sectionClassName = "",
}: StudentsRatingWorkSectionProps) {
  return (
    <section
      className={`w-full overflow-x-hidden ${sectionClassName}`.trim()}
      aria-label="Students rating and work"
      data-gsap-reveal
    >
      <div className={`mx-auto w-[1360px] max-w-full ${className}`.trim()}>
        <div className="relative h-[833px] w-full overflow-hidden">
          <svg
            className="absolute inset-0 h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
            width="1360"
            height="833"
            viewBox="0 0 1360 833"
            fill="none"
            aria-hidden
            preserveAspectRatio="none"
          >
            <path
              d="M55 833C24.6244 833 2.15273e-06 808.376 4.80825e-06 778L6.80149e-05 54.9999C7.06704e-05 24.6242 24.6245 -0.000116742 55.0001 -0.000114087L1305 -4.80825e-06C1335.38 -2.15273e-06 1360 24.6243 1360 55L1360 778C1360 808.376 1335.38 833 1305 833L55 833Z"
              fill="#004B3C"
            />
          </svg>

          <div className="relative z-10 px-[30px] pt-[56px]">
            <div className="flex items-center justify-between">
              <p
                className="m-0 ml-[19px] text-white"
                style={{
                  fontFamily: pangeaFont,
                  fontSize: "36px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "normal",
                }}
              >
                STUDENTS{" "}
                <span style={{ fontStyle: "italic", fontWeight: 600 }}>
                  RATING &amp; WORK
                </span>
              </p>

              <Link
                href={viewAllHref}
                className="flex items-center text-white no-underline transition-opacity hover:opacity-90"
              >
                <p
                  className="m-0"
                  style={{
                    color: "var(--White, #FFF)",
                    fontFamily: pangeaFont,
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "120%",
                  }}
                >
                  VIEW ALL COMMENTS
                </p>
                <ViewAllCommentsArrow />
              </Link>
            </div>

            <div className="mt-[49px] grid grid-cols-2 gap-x-[13px] gap-y-[21px]">
              {cards.map((card, idx) => (
                <div
                  key={`${card.name}-${idx}`}
                  className="h-[297.16px] w-[644px] max-w-full rounded-[36px] border border-black bg-white p-[28px]"
                >
                  <div className="flex h-full items-start justify-between gap-[26px]">
                    <div className="flex h-full min-h-0 flex-1 flex-col">
                      <p
                        className="m-0"
                        style={{
                          width: "311px",
                          maxWidth: "100%",
                          color: "var(--Black, #000)",
                          fontFamily: pangeaFont,
                          fontSize: "18px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "normal",
                        }}
                      >
                        {card.quote}
                      </p>
                      <div className="mt-auto flex items-center gap-[10px] pt-[18px]">
                        <div className="flex h-[63px] w-[63px] items-center justify-center rounded-full border border-black bg-white">
                          <span
                            style={{
                              color: "var(--Black, #000)",
                              fontFamily: pangeaFont,
                              fontSize: "32px",
                              fontStyle: "normal",
                              fontWeight: 600,
                              lineHeight: "normal",
                            }}
                          >
                            {card.initials}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-[8px]">
                            <p
                              className="m-0"
                              style={{
                                color: "var(--Black, #000)",
                                fontFamily: pangeaFont,
                                fontSize: "20px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "normal",
                              }}
                            >
                              {card.name}
                            </p>
                            <p
                              className="m-0"
                              style={{
                                color: "var(--Black, #000)",
                                fontFamily: pangeaFont,
                                fontSize: "18px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "normal",
                              }}
                            >
                              {card.rating}
                            </p>
                            <StarIcon />
                          </div>
                          <p
                            className="m-0"
                            style={{
                              color: "var(--Black, #000)",
                              fontFamily: pangeaFont,
                              fontSize: "20px",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "normal",
                              opacity: 0.6,
                            }}
                          >
                            {card.role}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="h-[253px] w-[226px] shrink-0 rounded-[36px] border border-black bg-[#E7E7E7]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
