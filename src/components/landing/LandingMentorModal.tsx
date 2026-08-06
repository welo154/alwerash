"use client";

import { useEffect, useId, type ReactNode } from "react";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;
const MENTOR_PHOTO = "/landing/mentor-modal-photo.png";

const PLACEHOLDER_BIO =
  "I'm a working professional creative in the game industry. I work as a concept artist and freelance illustrator. I've worked in-house at an animation studio but currently, work from home. As an instructor, I strive to provide the best learning experience possible for my students by creating clear content and maintaining a personable demeanor.";

const MODAL_PATH =
  "M859 0C889.376 3.2213e-06 914 24.6243 914 55V598C914 628.376 889.376 653 859 653H55C24.6243 653 0 628.376 0 598V128.48C0 100.866 22.3858 78.4805 50 78.4805H163.197C177.557 78.4805 189.197 66.8397 189.197 52.4805V50C189.197 22.3858 211.583 0 239.197 0H859Z";

const MODAL_STROKE_MASK_PATH =
  "M859 0V-2V-2V0ZM914 598H916V598H914ZM55 653V655V655V653ZM189.197 52.4805L191.197 52.4805V52.4805H189.197ZM859 0V2C888.271 2 912 25.7289 912 55H914H916C916 23.5198 890.48 -2 859 -2V0ZM914 55H912V598H914H916V55H914ZM914 598H912C912 627.271 888.271 651 859 651V653V655C890.48 655 916 629.48 916 598H914ZM859 653V651H55V653V655H859V653ZM55 653V651C25.7289 651 2 627.271 2 598H0H-2C-2 629.48 23.5198 655 55 655V653ZM0 598H2V128.48H0H-2V598H0ZM50 78.4805V80.4805H163.197V78.4805V76.4805H50V78.4805ZM163.197 78.4805V80.4805C178.661 80.4805 191.197 67.9442 191.197 52.4805L189.197 52.4805L187.197 52.4804C187.197 65.7351 176.452 76.4805 163.197 76.4805V78.4805ZM189.197 52.4805H191.197V50H189.197H187.197V52.4805H189.197ZM239.197 0V2H859V0V-2H239.197V0ZM189.197 50H191.197C191.197 23.4903 212.688 2 239.197 2V0V-2C210.478 -2 187.197 21.2812 187.197 50H189.197ZM0 128.48H2C2 101.971 23.4903 80.4805 50 80.4805V78.4805V76.4805C21.2812 76.4805 -2 99.7617 -2 128.48H0Z";

/** Left photo panel silhouette — 369×653 (Figma). */
const PHOTO_PATH =
  "M314 0C344.376 0 369 24.6243 369 55V598C369 628.376 344.376 653 314 653H55C24.6243 653 0 628.376 0 598V128.48C0 100.866 22.3858 78.4805 50 78.4805H163.197C177.557 78.4805 189.197 66.8397 189.197 52.4805V50C189.197 22.3858 211.583 0 239.197 0H314Z";

const PHOTO_STROKE_MASK_PATH =
  "M369 598H371V598H369ZM189.197 52.4805L191.197 52.4805V52.4805H189.197ZM314 0V2C343.271 2 367 25.7289 367 55H369H371C371 23.5198 345.48 -2 314 -2V0ZM369 55H367V598H369H371V55H369ZM369 598H367C367 627.271 343.271 651 314 651V653V655C345.48 655 371 629.48 371 598H369ZM314 653V651H55V653V655H314V653ZM55 653V651C25.7289 651 2 627.271 2 598H0H-2C-2 629.48 23.5198 655 55 655V653ZM0 598H2V128.48H0H-2V598H0ZM50 78.4805V80.4805H163.197V78.4805V76.4805H50V78.4805ZM163.197 78.4805V80.4805C178.661 80.4805 191.197 67.9442 191.197 52.4805L189.197 52.4805L187.197 52.4804C187.197 65.7351 176.452 76.4805 163.197 76.4805V78.4805ZM189.197 52.4805H191.197V50H189.197H187.197V52.4805H189.197ZM239.197 0V2H314V0V-2H239.197V0ZM189.197 50H191.197C191.197 23.4903 212.688 2 239.197 2V0V-2C210.478 -2 187.197 21.2812 187.197 50H189.197ZM0 128.48H2C2 101.971 23.4903 80.4805 50 80.4805V78.4805V76.4805C21.2812 76.4805 -2 99.7617 -2 128.48H0Z";

export type LandingMentorModalMentor = {
  id: string;
  variant: "popular" | "watched";
  name: string;
  profession: string;
};

type Props = {
  mentor: LandingMentorModalMentor | null;
  open: boolean;
  onClose: () => void;
};

function StatRow({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center">
      <span className="flex shrink-0 items-center justify-center" aria-hidden>
        {icon}
      </span>
      <span
        style={{
          marginLeft: 18,
          color: "var(--Black, #000)",
          fontFamily: pangeaFont,
          fontSize: 16,
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function LandingMentorModal({ mentor, open, onClose }: Props) {
  const rawId = useId().replace(/:/g, "");
  const shellMaskId = `mentor-modal-shell-mask-${rawId}`;
  const photoMaskId = `mentor-modal-photo-mask-${rawId}`;
  const photoClipId = `mentor-modal-photo-clip-${rawId}`;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !mentor) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex h-full items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      aria-modal
      role="dialog"
      aria-label={`${mentor.name}, ${mentor.profession}`}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 z-0"
        aria-label="Close overlay"
      />

      <div
        className="relative z-10 max-h-[90vh] w-full max-w-[914px] shrink-0"
        style={{ aspectRatio: "914 / 653" }}
      >
        {/* Exit — true top-left (outside overflow clip) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-0 left-0 z-30 flex h-10 w-10 items-center justify-center border-0 bg-transparent p-0 text-white outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-white/40"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 41 41"
            fill="none"
            aria-hidden
            className="block"
          >
            <path
              d="M26.5 14.5L14.5 26.5M14.5 14.5L26.5 26.5M40.5 20.5C40.5 31.5457 31.5457 40.5 20.5 40.5C9.4543 40.5 0.5 31.5457 0.5 20.5C0.5 9.4543 9.4543 0.5 20.5 0.5C31.5457 0.5 40.5 9.4543 40.5 20.5Z"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="relative h-full w-full overflow-hidden">
          {/* Outer white shell + green border */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 914 653"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
          >
            <defs>
              <mask id={shellMaskId} fill="white">
                <path d={MODAL_PATH} />
              </mask>
            </defs>
            <path d={MODAL_PATH} fill="var(--White, #FFF)" />
            <path
              d={MODAL_STROKE_MASK_PATH}
              fill="var(--Green, #8AF396)"
              mask={`url(#${shellMaskId})`}
            />
          </svg>

          {/* Left photo panel — 369×653, flush left */}
          <svg
            className="absolute top-0 left-0 h-full"
            style={{ width: "calc(369 / 914 * 100%)" }}
            viewBox="0 0 369 653"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
          >
            <defs>
              <clipPath id={photoClipId}>
                <path d={PHOTO_PATH} />
              </clipPath>
              <mask id={photoMaskId} fill="white">
                <path d={PHOTO_PATH} />
              </mask>
            </defs>

            <image
              href={MENTOR_PHOTO}
              x="0"
              y="0"
              width="369"
              height="653"
              preserveAspectRatio="xMidYMin slice"
              clipPath={`url(#${photoClipId})`}
            />

            <path
              d={PHOTO_STROKE_MASK_PATH}
              fill="var(--Green, #8AF396)"
              mask={`url(#${photoMaskId})`}
            />
          </svg>

          {/* Content — 51px right of photo, 85px from top */}
          <div
            className="absolute z-10 flex flex-col items-start"
            style={{
              left: "calc(420 / 914 * 100%)",
              top: "calc(85 / 653 * 100%)",
              maxWidth: "calc(363 / 914 * 100%)",
            }}
          >
            <div
              className="box-border flex items-center justify-center"
              style={{
                width: 164,
                height: 39,
                padding: "0 16px",
                borderRadius: "var(--Radius-SM, 6px)",
                border: "0.3px solid var(--Black, #000)",
                background: "#89F496",
                color: "var(--Text-Primary, #141413)",
                textAlign: "center",
                fontFamily: pangeaFont,
                fontSize: 18,
                fontWeight: 500,
                lineHeight: "var(--Line-height-Heading-sm, 19.6px)",
              }}
            >
              <span style={{ fontStyle: "normal" }}>MOST </span>
              <span style={{ fontStyle: "italic" }}>WATCHED</span>
            </div>

            <div
              style={{
                marginTop: 33.5,
                color: "var(--Black, #000)",
                fontFamily: pangeaFont,
                fontSize: 24,
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
                opacity: 0.6,
              }}
            >
              MEET
            </div>

            <div
              style={{
                marginTop: 6,
                color: "var(--Black, #000)",
                fontFamily: pangeaFont,
                fontSize: 32,
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
              }}
            >
              {mentor.name}
            </div>

            <div
              style={{
                color: "var(--Black, #000)",
                fontFamily: pangeaFont,
                fontSize: 24,
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
              }}
            >
              {mentor.profession}
            </div>

            <div className="flex flex-col" style={{ marginTop: 22, gap: 11 }}>
              <StatRow
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="20"
                    viewBox="0 0 23 22"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M11.25 0.75L14.4945 7.33254L21.75 8.39458L16.5 13.5155L17.739 20.75L11.25 17.3325L4.761 20.75L6 13.5155L0.75 8.39458L8.0055 7.33254L11.25 0.75Z"
                      stroke="var(--Black, #000)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                label="4.8 Instructor Rating"
              />
              <StatRow
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="23"
                    height="20"
                    viewBox="0 0 23 20"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M16.0227 18.75V16.75C16.0227 15.6891 15.6205 14.6717 14.9044 13.9216C14.1884 13.1714 13.2172 12.75 12.2045 12.75H4.56818C3.55554 12.75 2.58437 13.1714 1.86832 13.9216C1.15227 14.6717 0.75 15.6891 0.75 16.75V18.75M21.75 18.75V16.75C21.7494 15.8637 21.4678 15.0028 20.9495 14.3023C20.4312 13.6019 19.7055 13.1016 18.8864 12.88M15.0682 0.88C15.8895 1.1003 16.6174 1.6007 17.1373 2.30231C17.6571 3.00392 17.9393 3.86683 17.9393 4.755C17.9393 5.64317 17.6571 6.50608 17.1373 7.20769C16.6174 7.9093 15.8895 8.4097 15.0682 8.63M12.2045 4.75C12.2045 6.95914 10.4951 8.75 8.38636 8.75C6.27764 8.75 4.56818 6.95914 4.56818 4.75C4.56818 2.54086 6.27764 0.75 8.38636 0.75C10.4951 0.75 12.2045 2.54086 12.2045 4.75Z"
                      stroke="var(--Black, #000)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                label="231 students"
              />
              <StatRow
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="23"
                    height="22"
                    viewBox="0 0 23 22"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M11.25 5.19444C11.25 4.0157 10.8075 2.88524 10.0198 2.05175C9.2322 1.21825 8.16391 0.75 7.05 0.75H0.75V17.4167H8.1C8.93543 17.4167 9.73665 17.7679 10.3274 18.393C10.9181 19.0181 11.25 19.8659 11.25 20.75M11.25 5.19444V20.75M11.25 5.19444C11.25 4.0157 11.6925 2.88524 12.4802 2.05175C13.2678 1.21825 14.3361 0.75 15.45 0.75H21.75V17.4167H14.4C13.5646 17.4167 12.7634 17.7679 12.1726 18.393C11.5819 19.0181 11.25 19.8659 11.25 20.75"
                      stroke="var(--Black, #000)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                label="4 courses"
              />
            </div>

            <p
              style={{
                marginTop: 24,
                marginBottom: 0,
                width: 363,
                maxWidth: "100%",
                color: "var(--Black, #000)",
                fontFamily: pangeaFont,
                fontSize: 18,
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
              }}
            >
              “{PLACEHOLDER_BIO}”
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
