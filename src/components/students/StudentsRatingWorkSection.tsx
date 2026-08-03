import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

export type StudentRatingCard = {
  quote: string;
  initials: string;
  name: string;
  role: string;
};

const DEFAULT_CARDS: StudentRatingCard[] = [
  {
    quote:
      "This class helped me understand that I already have a style within me... and all I need to do is trust myself and my process. The exercises and the way Ali explains them are awesome. Thank you for sharing.",
    initials: "MS",
    name: "MOHAMED SABRY",
    role: "Graphic designer",
  },
  {
    quote:
      "This class helped me understand that I already have a style within me... and all I need to do is trust myself and my process. The exercises and the way Ali explains them are awesome. Thank you for sharing.",
    initials: "MS",
    name: "MOHAMED SABRY",
    role: "Graphic designer",
  },
  {
    quote:
      "This class helped me understand that I already have a style within me... and all I need to do is trust myself and my process. The exercises and the way Ali explains them are awesome. Thank you for sharing.",
    initials: "MS",
    name: "MOHAMED SABRY",
    role: "Graphic designer",
  },
  {
    quote:
      "This class helped me understand that I already have a style within me... and all I need to do is trust myself and my process. The exercises and the way Ali explains them are awesome. Thank you for sharing.",
    initials: "MS",
    name: "MOHAMED SABRY",
    role: "Graphic designer",
  },
];

type StudentsRatingWorkSectionProps = {
  cards?: StudentRatingCard[];
  className?: string;
  /** Extra top margin wrapper (e.g. course page `mt-[66px]`). */
  sectionClassName?: string;
};

/**
 * Dark-green “WHY STUDENTS LOVE ALWERASH” panel — same layout as the public course page.
 */
export function StudentsRatingWorkSection({
  cards = DEFAULT_CARDS,
  className = "",
  sectionClassName = "",
}: StudentsRatingWorkSectionProps) {
  return (
    <section
      className={`w-full overflow-x-hidden ${sectionClassName}`.trim()}
      aria-label="Why students love Alwerash"
      data-gsap-reveal
    >
      <div className={`mx-auto w-[1303px] max-w-full ${className}`.trim()}>
        <div className="relative h-[977px] w-full overflow-hidden">
          <svg
            className="absolute inset-0 h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
            width="1303"
            height="977"
            viewBox="0 0 1303 977"
            fill="none"
            aria-hidden
            preserveAspectRatio="none"
          >
            <path
              d="M55 977C24.6244 977 2.15273e-06 952.376 4.80825e-06 922L6.80149e-05 54.9999C7.06704e-05 24.6242 24.6245 -0.000116742 55.0001 -0.000114087L1248 -4.80825e-06C1278.38 -2.15273e-06 1303 24.6243 1303 55L1303 922C1303 952.376 1278.38 977 1248 977L55 977Z"
              fill="#004B3C"
            />
          </svg>

          <div className="relative z-10 px-[48px] pt-[59px]">
            <h2
              className="m-0 uppercase text-white"
              style={{
                width: "612px",
                maxWidth: "100%",
                color: "#FFF",
                fontFamily: pangeaFont,
                fontSize: "48px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "120%",
              }}
            >
              WHY STUDENTS LOVE
              <br />
              <span style={{ fontStyle: "italic", fontWeight: 300 }}>AL</span>
              <span style={{ fontStyle: "italic", fontWeight: 700 }}>
                WERASH
              </span>
            </h2>

            <div className="mx-auto mt-[39px] grid w-[1205px] max-w-full grid-cols-2 justify-items-stretch gap-x-[31px] gap-y-[40px]">
              {cards.map((card, idx) => (
                <div
                  key={`${card.name}-${idx}`}
                  className="h-[327px] w-[587px] max-w-full rounded-[36px] border border-black bg-white pb-[38px] pl-[45px] pr-[28px]"
                >
                  <div className="flex h-full items-start justify-between gap-[16px]">
                    <div className="flex h-full min-h-0 flex-1 flex-col pt-[80px]">
                      <p
                        className="m-0"
                        style={{
                          width: "286px",
                          maxWidth: "100%",
                          color: "var(--Black, #000)",
                          fontFamily: pangeaFont,
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "normal",
                        }}
                      >
                        {`"${card.quote}"`}
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
                          <span
                            className="mt-[6px] inline-flex h-[31px] items-center rounded-[8px] border border-black px-4"
                            style={{
                              background: "var(--Blue, #64E1FF)",
                              color: "var(--Text-Primary, #141413)",
                              fontFamily: pangeaFont,
                              fontSize: "18px",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "19.6px",
                            }}
                          >
                            {card.role}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-[29px] h-[260px] w-[203px] shrink-0 rounded-[36px] border border-black bg-[#E7E7E7]" />
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
