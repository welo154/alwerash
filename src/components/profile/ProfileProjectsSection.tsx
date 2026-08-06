import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

export type ProjectQuoteCardData = {
  quote: string;
  initials: string;
  name: string;
  role: string;
};

const DEFAULT_PROJECT_CARDS: ProjectQuoteCardData[] = [
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

/** Same card as “Why students love Alwerash” / course students section — no panel background. */
export function ProjectQuoteCard({ card }: { card: ProjectQuoteCardData }) {
  return (
    <div className="h-[327px] w-[587px] max-w-full shrink-0 rounded-[36px] border border-black bg-white pb-[38px] pl-[45px] pr-[28px]">
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
  );
}

export function ProfileProjectsSection({
  cards = DEFAULT_PROJECT_CARDS,
  className = "",
}: {
  cards?: ProjectQuoteCardData[];
  className?: string;
}) {
  const visible = cards.slice(0, 2);

  return (
    <div
      className={`pl-[120px] pr-[120px] ${className}`.trim()}
      aria-label="Projects"
    >
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
        YOUR{" "}
        <span style={{ fontStyle: "italic", fontWeight: 600 }}>PROJECTS</span>
      </h2>

      <div
        className="mt-[45px] flex flex-nowrap items-start"
        style={{ gap: 31 }}
      >
        {visible.map((card, idx) => (
          <ProjectQuoteCard key={`${card.name}-${idx}`} card={card} />
        ))}
      </div>
    </div>
  );
}
