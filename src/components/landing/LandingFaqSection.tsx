"use client";

import { useId, useState } from "react";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

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

function FaqExpandIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={50}
      height={50}
      viewBox="0 0 53 53"
      fill="none"
      className="shrink-0 transition-transform duration-200"
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

/**
 * FAQ accordion — below “Why students love”, with 145px top offset from that section.
 */
export function LandingFaqSection() {
  const baseId = useId().replace(/:/g, "");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `landing-faq-panel-${baseId}-${index}`;
            const buttonId = `landing-faq-trigger-${baseId}-${index}`;
            return (
              <div key={item.question} className="border-b border-black">
                <button
                  id={buttonId}
                  type="button"
                  className="flex h-[90px] w-full shrink-0 items-center justify-between gap-4 pl-[53px] pr-[164px] text-left transition-colors hover:bg-black/[0.02]"
                  style={{ fontFamily: pangeaFont }}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span
                    className="font-bold"
                    style={{
                      color: "var(--Black, #000)",
                      fontFamily: pangeaFont,
                      fontSize: "32px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      fontVariationSettings: '"wght" 700',
                      lineHeight: "normal",
                    }}
                  >
                    {item.question}
                  </span>
                  <FaqExpandIcon open={isOpen} />
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  aria-hidden={!isOpen}
                  className={`grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="min-h-0 overflow-hidden pl-[53px] pr-[164px]">
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
        </div>
      </div>
    </section>
  );
}
