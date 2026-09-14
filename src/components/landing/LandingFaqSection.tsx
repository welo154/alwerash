"use client";

import { useId, useState } from "react";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

const FAQ_ITEMS: readonly { question: string; answer: string }[] = [
  {
    question: "What is ElWerash?",
    answer:
      "ElWerash is an online learning platform where you can take courses in design, creative skills, and more—taught by working professionals, on your schedule.",
  },
  {
    question: "What is included in my ElWerash membership?",
    answer:
      "A membership unlocks the full catalog: stream lessons, download resources where available, and track your progress across courses and tracks.",
  },
  {
    question: "What can I learn from ElWerash?",
    answer:
      "You can learn illustration, motion, UI/UX, photography, and related creative disciplines—structured paths from foundations to portfolio-ready projects.",
  },
  {
    question: "What happens after my trial is over?",
    answer:
      "When your trial ends, you can choose a plan to keep access. If you do not subscribe, your account switches to limited access until you upgrade.",
  },
  {
    question: "Can I teach on ElWerash?",
    answer:
      "We partner with qualified instructors. If you are interested in teaching, reach out through our contact or instructor application flow when it is open.",
  },
];

function FaqExpandIcon({
  open,
  size = 50,
  className,
}: {
  open: boolean;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 53 53"
      fill="none"
      className={`shrink-0 transition-transform duration-200 ${className ?? ""}`}
      style={{ transform: open ? "rotate(45deg)" : undefined }}
      aria-hidden
    >
      <path
        d="M26.5 16.5V36.5M16.5 26.5H36.5M51.5 26.5C51.5 40.3071 40.3071 51.5 26.5 51.5C12.6929 51.5 1.5 40.3071 1.5 26.5C1.5 12.6929 12.6929 1.5 26.5 1.5C40.3071 1.5 51.5 12.6929 51.5 26.5Z"
        stroke="#FF8CFF"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FaqAccordionList({
  baseId,
  openIndex,
  setOpenIndex,
  layout = "desktop",
}: {
  baseId: string;
  openIndex: number | null;
  setOpenIndex: (index: number | null) => void;
  layout?: "desktop" | "mobile";
}) {
  const isMobile = layout === "mobile";

  return (
    <>
      {FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `landing-faq-panel-${baseId}-${index}`;
        const buttonId = `landing-faq-trigger-${baseId}-${index}`;
        return (
          <div key={item.question} className={isMobile ? undefined : "border-b border-black"}>
            {isMobile ? <FaqMobileRule /> : null}
            <button
              id={buttonId}
              type="button"
              className={
                isMobile
                  ? "mt-[18px] flex w-full shrink-0 items-center justify-between gap-4 pl-[30px] pr-[30px] text-left transition-colors hover:bg-black/[0.02] min-[744px]:mt-0 min-[744px]:py-[22px] min-[744px]:pl-[62px] min-[744px]:pr-[62px]"
                  : "flex h-[90px] w-full shrink-0 items-center justify-between gap-4 pl-[53px] pr-[164px] text-left transition-colors hover:bg-black/[0.02]"
              }
              style={{ fontFamily: pangeaFont }}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              suppressHydrationWarning
            >
              <span
                className={
                  isMobile
                    ? "min-w-0 flex-1 text-[20px] font-bold min-[744px]:text-[24px]"
                    : "font-bold"
                }
                style={{
                  color: "var(--Black, #000)",
                  fontFamily: pangeaFont,
                  fontSize: isMobile ? undefined : "32px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  fontVariationSettings: '"wght" 700',
                  lineHeight: "normal",
                }}
              >
                {item.question}
              </span>
              <FaqExpandIcon
                open={isOpen}
                size={isMobile ? 30.735 : 50}
                className={isMobile ? "min-[744px]:h-[46px] min-[744px]:w-[46px]" : undefined}
              />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!isOpen}
              className={`grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div
                className={
                  isMobile
                    ? "min-h-0 overflow-hidden pl-[30px] pr-[30px] min-[744px]:pl-[62px] min-[744px]:pr-[62px]"
                    : "min-h-0 overflow-hidden pl-[53px] pr-[164px]"
                }
              >
                <p
                  className="pb-6 text-[16px] font-normal leading-[150%] text-black/85 sm:text-[17px]"
                  style={{ fontFamily: pangeaFont }}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
      {isMobile ? <FaqMobileRule includeTablet={false} /> : null}
    </>
  );
}

const FULL_BLEED = "w-screen max-w-[100vw] ml-[calc(50%-50vw)]";

function FaqMobileRule({ includeTablet = true }: { includeTablet?: boolean }) {
  return (
    <>
      <div className={`${FULL_BLEED} mt-[21px] min-[744px]:hidden`} aria-hidden>
        <div className="bg-black" style={{ height: "0.3px" }} />
      </div>
      {includeTablet ? (
        <div
          className="mx-auto hidden bg-black min-[744px]:block lg:hidden"
          style={{ width: 676, height: 0.3 }}
          aria-hidden
        />
      ) : null}
    </>
  );
}

/**
 * FAQ accordion — below “Why students love”, with 145px top offset from that section.
 */
export function LandingFaqSection({
  variant = "desktop",
  className,
}: {
  variant?: "desktop" | "mobile";
  className?: string;
} = {}) {
  const baseId = useId().replace(/:/g, "");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (variant === "mobile") {
    return (
      <section
        className={`w-full bg-white ${className ?? "mt-[100px]"}`}
        aria-labelledby="landing-faq-heading-mobile"
      >
        <h2
          id="landing-faq-heading-mobile"
          className="m-0 ml-[30px] w-[334px] max-w-[334px] uppercase text-black min-[744px]:mx-auto min-[744px]:w-full min-[744px]:max-w-none min-[744px]:text-center"
          style={{ fontFamily: pangeaFont }}
        >
          <span
            className="text-[36px] font-bold italic leading-[120%] min-[744px]:text-[40px]"
            style={{
              color: "#000",
              fontFamily: pangeaFont,
              fontStyle: "italic",
              fontWeight: 700,
              lineHeight: "120%",
            }}
          >
            FREQUENTLY{" "}
          </span>
          <span
            className="text-[36px] font-normal not-italic leading-[120%] min-[744px]:text-[40px]"
            style={{
              color: "#000",
              fontFamily: pangeaFont,
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "120%",
            }}
          >
            ASKED QUESTIONS
          </span>
        </h2>

        <div className={`${FULL_BLEED} min-[744px]:ml-0 min-[744px]:mt-[61px] min-[744px]:w-full min-[744px]:max-w-none`}>
          <FaqAccordionList
            baseId={baseId}
            openIndex={openIndex}
            setOpenIndex={setOpenIndex}
            layout="mobile"
          />
        </div>
      </section>
    );
  }

  return (
    <section
      className="mt-[145px] w-full bg-white pb-0 pl-4 pr-4 sm:px-6"
      aria-labelledby="landing-faq-heading"
      data-gsap-reveal
    >
      <div className="mx-auto max-w-[1600px]">
        <h2 id="landing-faq-heading" className="pl-6 uppercase text-black xl:pl-[314px]">
          <span
            style={{
              color: "#000",
              fontFamily: pangeaFont,
              fontSize: "48px",
              fontStyle: "italic",
              fontWeight: 700,
              lineHeight: "120%",
            }}
          >
            FREQUENTLY{" "}
          </span>
          <span
            style={{
              color: "#000",
              fontFamily: pangeaFont,
              fontSize: "48px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "120%",
            }}
          >
            ASKED QUESTIONS
          </span>
        </h2>

        <div className="mx-auto mt-[53px] w-[1228px] max-w-full border-t border-black">
          <FaqAccordionList
            baseId={baseId}
            openIndex={openIndex}
            setOpenIndex={setOpenIndex}
          />
        </div>
      </div>
    </section>
  );
}
