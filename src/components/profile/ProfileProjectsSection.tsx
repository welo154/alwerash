"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useT } from "@/components/i18n/Tr";
import { pangeaFontFamily } from "@/lib/fonts/pangea";
import { useArabicLayout } from "@/components/providers/LocaleProvider";
import {
  MobileStudentRatingCard,
  TabletStudentRatingCard,
} from "@/components/students/StudentsRatingWorkSection";

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
  const arabic = useArabicLayout();
  const t = useT();

  return (
    <div
      className={`h-[327px] w-[587px] max-w-full shrink-0 rounded-[36px] bg-white pb-[38px] ${
        arabic ? "pr-[45px] pl-[28px]" : "pl-[45px] pr-[28px]"
      }`}
      style={{ border: "0.3px solid rgba(0, 0, 0, 0.2)" }}
    >
      <div
        className={`flex h-full items-start justify-between gap-[16px] ${
          arabic ? "flex-row-reverse" : ""
        }`}
      >
        <div
          className={`flex h-full min-h-0 flex-1 flex-col pt-[80px] ${
            arabic ? "items-end" : ""
          }`}
        >
          <p
            className="m-0"
            dir={arabic ? "rtl" : undefined}
            style={{
              width: "286px",
              maxWidth: "100%",
              color: "var(--Black, #000)",
              fontFamily: pangeaFont,
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
              textAlign: arabic ? "right" : undefined,
            }}
          >
            {`"${t(card.quote)}"`}
          </p>
          <div
            className={`mt-auto flex items-center gap-[10px] pt-[18px] ${
              arabic ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className="flex h-[63px] w-[63px] items-center justify-center rounded-full bg-white"
              style={{ border: "0.3px solid rgba(0, 0, 0, 0.2)" }}
            >
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
            <div className={arabic ? "text-right" : undefined}>
              <p
                className="m-0"
                style={{
                  color: "var(--Black, #000)",
                  fontFamily: pangeaFont,
                  fontSize: "20px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "normal",
                  textTransform: arabic ? "none" : "uppercase",
                }}
              >
                {t(card.name)}
              </p>
              <span
                className="mt-[6px] box-border"
                style={{
                  display: "inline-flex",
                  height: 31,
                  padding: "0 16px",
                  alignItems: "center",
                  borderRadius: 25,
                  border: "0.3px solid rgba(0, 0, 0, 0.2)",
                  background: "var(--Blue, #64E1FF)",
                  color: "var(--Text-Primary, #141413)",
                  fontFamily: pangeaFont,
                  fontSize: "18px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "19.6px",
                }}
              >
                {t(card.role)}
              </span>
            </div>
          </div>
        </div>
        <div
          className="mt-[29px] h-[260px] w-[203px] shrink-0 rounded-[36px] bg-[#E7E7E7]"
          style={{ border: "0.3px solid rgba(0, 0, 0, 0.2)" }}
        />
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
  const arabic = useArabicLayout();

  const titleInsetClass = arabic
    ? "max-[743px]:pr-[30px] min-[744px]:max-lg:pr-[61px] lg:pr-[120px] lg:pl-[120px]"
    : "max-[743px]:pl-[30px] min-[744px]:max-lg:pl-[61px] lg:pl-[120px]";

  return (
    <div
      className={`${arabic ? "text-right" : ""} ${className}`.trim()}
      aria-label="Projects"
    >
      <h2
        className={`m-0 hidden max-[743px]:block ${titleInsetClass} ${arabic ? "" : "uppercase"}`}
        style={{
          color: "var(--Black, #000)",
          fontFamily: pangeaFont,
          fontSize: 24,
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "120%",
          textAlign: arabic ? "right" : undefined,
        }}
      >
        {arabic ? (
          "مشاريعك"
        ) : (
          <>
            YOUR{" "}
            <span style={{ fontStyle: "italic", fontWeight: 700 }}>PROJECTS</span>
          </>
        )}
      </h2>

      <h2
        className={`m-0 hidden min-[744px]:max-lg:block ${titleInsetClass} ${arabic ? "" : "uppercase"}`}
        style={{
          color: "var(--Black, #000)",
          fontFamily: pangeaFont,
          fontSize: 32,
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "120%",
          textAlign: arabic ? "right" : undefined,
        }}
      >
        {arabic ? (
          "مشاريعك"
        ) : (
          <>
            YOUR{" "}
            <span style={{ fontStyle: "italic", fontWeight: 600 }}>PROJECTS</span>
          </>
        )}
      </h2>

      <h2
        className={`m-0 hidden lg:block ${titleInsetClass} ${arabic ? "" : "uppercase"}`}
        style={{
          color: "var(--Black, #000)",
          fontFamily: pangeaFont,
          fontSize: 36,
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "120%",
          textAlign: arabic ? "right" : undefined,
        }}
      >
        {arabic ? (
          "مشاريعك"
        ) : (
          <>
            YOUR{" "}
            <span style={{ fontStyle: "italic", fontWeight: 600 }}>PROJECTS</span>
          </>
        )}
      </h2>

      <div
        className={`mt-[27px] overflow-x-clip min-[744px]:hidden ${
          arabic ? "pr-[30px]" : "pl-[30px]"
        }`}
      >
        <Swiper
          key={arabic ? "mobile-rtl" : "mobile-ltr"}
          dir={arabic ? "rtl" : "ltr"}
          slidesPerView="auto"
          spaceBetween={16}
          slidesPerGroup={1}
          slidesOffsetBefore={0}
          slidesOffsetAfter={30}
          speed={400}
          grabCursor
          allowTouchMove
          simulateTouch
          className="overflow-visible!"
        >
          {visible.map((card, idx) => (
            <SwiperSlide key={`${card.name}-${idx}`} className="w-[327px]!">
              <div className="[&>div]:mx-0">
                <MobileStudentRatingCard card={card} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div
        className={`mt-[27px] hidden overflow-x-clip min-[744px]:max-lg:block ${
          arabic ? "pr-[61px]" : "pl-[61px]"
        }`}
      >
        <Swiper
          key={arabic ? "rtl" : "ltr"}
          dir={arabic ? "rtl" : "ltr"}
          slidesPerView="auto"
          spaceBetween={31}
          slidesPerGroup={1}
          slidesOffsetBefore={0}
          slidesOffsetAfter={61}
          speed={400}
          grabCursor
          allowTouchMove
          simulateTouch
          className="overflow-visible!"
        >
          {visible.map((card, idx) => (
            <SwiperSlide key={`${card.name}-${idx}`} className="w-[621px]!">
              <TabletStudentRatingCard card={card} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div
        className={`mt-[45px] hidden flex-nowrap items-start lg:flex ${titleInsetClass} ${
          arabic ? "flex-row-reverse justify-start" : "lg:pr-[120px]"
        }`}
        style={{ gap: 31 }}
      >
        {visible.map((card, idx) => (
          <ProjectQuoteCard key={`${card.name}-${idx}`} card={card} />
        ))}
      </div>
    </div>
  );
}
