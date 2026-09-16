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
  variant?: "desktop" | "mobile";
};

function MobileStudentRatingAvatar({ initials }: { initials: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={36.396}
      height={36.396}
      viewBox="0 0 37 37"
      fill="none"
      className="shrink-0"
      aria-hidden
    >
      <circle cx="18.5" cy="18.5" r="18.3" fill="#FFF" stroke="#000" strokeWidth="0.2" />
      <foreignObject x="0" y="0" width="37" height="37">
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: pangeaFont,
            color: "var(--Black, #000)",
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "normal",
          }}
        >
          {initials}
        </div>
      </foreignObject>
    </svg>
  );
}

function MobileStudentRatingProfileInfo({ card }: { card: StudentRatingCard }) {
  return (
    <div className="flex items-start gap-[9px]">
      <MobileStudentRatingAvatar initials={card.initials} />
      <div>
        <p
          className="m-0"
          style={{
            color: "var(--Black, #000)",
            fontFamily: pangeaFont,
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
          }}
        >
          {card.name}
        </p>
        <span
          className="mt-[4px] inline-flex h-[21px] w-auto items-center justify-center rounded-[8px] border-[0.2px] border-black px-4"
          style={{
            background: "var(--Blue, #64E1FF)",
            color: "var(--Text-Primary, #141413)",
            fontFamily: pangeaFont,
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "19.6px",
          }}
        >
          {card.role}
        </span>
      </div>
    </div>
  );
}

function StudentRatingProfileInfo({ card }: { card: StudentRatingCard }) {
  return (
    <div className="flex items-center gap-[10px]">
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
  );
}

export function MobileStudentRatingCard({
  card,
  width = 327,
  height = 293,
}: {
  card: StudentRatingCard;
  width?: number;
  height?: number;
}) {
  return (
    <div
      className="mx-auto box-border rounded-[36px] border border-black bg-white pb-[38px] pl-[25px] pt-[25px] pr-[25px]"
      style={{ width, height }}
    >
      <div className="flex items-start gap-[9px]">
        <p
          className="m-0 min-w-0 flex-1"
          style={{
            color: "var(--Black, #000)",
            fontFamily: pangeaFont,
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
          }}
        >
          {`"${card.quote}"`}
        </p>
        <div
          className="h-[168px] w-[112px] shrink-0 rounded-[20px] border-[0.2px] border-black bg-[#E7E7E7]"
          aria-hidden
        />
      </div>
      <div className="pt-[18px]">
        <MobileStudentRatingProfileInfo card={card} />
      </div>
    </div>
  );
}

export function TabletStudentRatingCard({ card }: { card: StudentRatingCard }) {
  return (
    <div
      className="box-border rounded-[36px] border border-black bg-white pb-[38px] pl-[45px] pr-[28px]"
      style={{ width: 621, height: 339 }}
    >
      <div className="flex h-full items-start justify-between gap-[16px]">
        <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col pt-[64px]">
          <p
            className="m-0 max-w-full"
            style={{
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
          <div className="mt-auto mb-[20px] pt-[18px]">
            <StudentRatingProfileInfo card={card} />
          </div>
        </div>
        <div
          className="mt-[29px] h-[260px] w-[203px] shrink-0 rounded-[36px] border border-black bg-[#E7E7E7]"
          aria-hidden
        />
      </div>
    </div>
  );
}

/**
 * Dark-green “WHY STUDENTS LOVE ALWERASH” panel — same layout as the public course page.
 */
export function StudentsRatingWorkSection({
  cards = DEFAULT_CARDS,
  className = "",
  sectionClassName = "",
  variant = "desktop",
}: StudentsRatingWorkSectionProps) {
  if (variant === "mobile") {
    return (
      <section
        className={`w-full min-[744px]:max-lg:mx-auto min-[744px]:max-lg:w-[732px] ${sectionClassName}`.trim()}
        aria-label="Why students love Alwerash"
      >
        <div
          className={`relative mx-auto box-border overflow-hidden min-[744px]:hidden ${className}`.trim()}
          style={{
            width: 393,
            height: 859,
            borderRadius: 55,
            background: "var(--Dark-Green, #004B3C)",
          }}
        >
          <div className="pt-[55px] pl-[35px]">
            <h2
              className="m-0 w-[336px] uppercase text-white"
              style={{ fontFamily: pangeaFont }}
            >
              <span
                style={{
                  color: "var(--White, #FFF)",
                  fontFamily: pangeaFont,
                  fontSize: "36px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "120%",
                }}
              >
                WHY STUDENTS{" "}
              </span>
              <span
                style={{
                  color: "var(--White, #FFF)",
                  fontFamily: pangeaFont,
                  fontSize: "36px",
                  fontStyle: "italic",
                  fontWeight: 700,
                  lineHeight: "120%",
                }}
              >
                LOVE
              </span>
              <span
                style={{
                  color: "var(--White, #FFF)",
                  fontFamily: pangeaFont,
                  fontSize: "36px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "120%",
                }}
              >
                {" "}
                US
              </span>
            </h2>
          </div>

          {cards.length > 0 ? (
            <div className="mt-[34px] flex flex-col items-center gap-[30px]">
              {cards.slice(0, 2).map((card, idx) => (
                <MobileStudentRatingCard key={`${card.name}-${idx}`} card={card} />
              ))}
            </div>
          ) : null}
        </div>

        <div
          className={`relative mx-auto box-border hidden overflow-hidden min-[744px]:block lg:hidden ${className}`.trim()}
          style={{
            width: 732,
            height: 1010.001,
            borderRadius: 55,
            background: "var(--Dark-Green, #004B3C)",
          }}
        >
          <div className="pl-[56px] pt-[64px]">
            <h2
              className="m-0 w-[583px] max-w-full uppercase text-white"
              style={{
                color: "#FFF",
                fontFamily: pangeaFont,
                fontSize: 40,
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "120%",
              }}
            >
              WHY STUDENTS LOVE{" "}
              <span style={{ fontStyle: "italic", fontWeight: 300 }}>AL</span>
              <span style={{ fontStyle: "italic", fontWeight: 700 }}>WERASH</span>
            </h2>
          </div>
          {cards.length > 0 ? (
            <div className="mt-[42px] flex flex-col gap-[40px] pl-[56px]">
              {cards.slice(0, 2).map((card, idx) => (
                <TabletStudentRatingCard key={`${card.name}-${idx}`} card={card} />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    );
  }

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
                      <div className="mt-auto pt-[18px]">
                        <StudentRatingProfileInfo card={card} />
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
