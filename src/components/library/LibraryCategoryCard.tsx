import Image from "next/image";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

const LEFT_BOX_WIDTH = 347;
const LEFT_BOX_HEIGHT = 378;
const RIGHT_BOX_WIDTH = 347;
const RIGHT_BOX_HEIGHT = 306;
const BOX_OVERLAP = LEFT_BOX_WIDTH - 254;

const LEFT_BOX_PADDING_TOP = 47;
const LEFT_BOX_PADDING_LEFT = 37;
const TITLE_GAP = 127;
const RIGHT_BOX_IMAGE_PADDING = 48;

type TitleLinePart = {
  text: string;
  arrowAfter?: boolean;
};

export type LibraryCategoryCardProps = {
  titleLines: TitleLinePart[][];
  imageSrc: string;
  imageAlt: string;
};

function SectionArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="none"
      className="h-5 w-5 shrink-0"
      style={{ transform: "rotate(-90deg)" }}
      aria-hidden
    >
      <path
        d="M1.25 21.25L21.25 1.25M21.25 21.25L21.25 1.25L1.25 1.25"
        stroke="#1E1E1E"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LeftBoxContent({ titleLines }: { titleLines: TitleLinePart[][] }) {
  return (
    <div
      className="absolute left-1/2 top-1/2 flex flex-col"
      style={{
        width: LEFT_BOX_HEIGHT,
        height: LEFT_BOX_WIDTH,
        transform: "translate(-50%, -50%) rotate(90deg)",
        fontFamily: pangeaFont,
      }}
    >
      <div
        className="flex h-full flex-col"
        style={{
          paddingTop: LEFT_BOX_PADDING_TOP,
          paddingLeft: LEFT_BOX_PADDING_LEFT,
        }}
      >
        <span className="inline-flex h-9 w-fit items-center justify-center rounded-lg border border-black bg-white px-4 text-[18px] font-normal leading-[19.6px] text-[#141413]">
          ALL
        </span>

        <div
          className="text-[32px] font-normal not-italic leading-normal text-black"
          style={{ marginTop: TITLE_GAP }}
        >
          {titleLines.map((line, lineIndex) => (
            <p key={lineIndex} className="mb-0 flex items-center gap-2">
              {line.map((part, partIndex) => (
                <span key={partIndex} className="inline-flex items-center gap-2">
                  <span>{part.text}</span>
                  {part.arrowAfter ? <SectionArrowIcon /> : null}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function RightBoxContent({
  imageSrc,
  imageAlt,
}: {
  imageSrc: string;
  imageAlt: string;
}) {
  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        width: RIGHT_BOX_HEIGHT,
        height: RIGHT_BOX_WIDTH,
        transform: "translate(-50%, -50%) rotate(90deg)",
      }}
    >
      <div
        className="relative h-full w-full"
        style={{ padding: RIGHT_BOX_IMAGE_PADDING }}
      >
        <div className="relative h-full w-full">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes={`${RIGHT_BOX_HEIGHT}px`}
            className="object-contain"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}

export function LibraryCategoryCard({
  titleLines,
  imageSrc,
  imageAlt,
}: LibraryCategoryCardProps) {
  return (
    <div className="relative flex items-center overflow-visible">
      <div
        className="relative shrink-0 overflow-hidden"
        style={{
          width: LEFT_BOX_WIDTH,
          height: LEFT_BOX_HEIGHT,
          transform: "rotate(-90deg)",
          borderRadius: 50,
          border: "1px solid #000",
          background: "#FFF",
          zIndex: 1,
        }}
      >
        <LeftBoxContent titleLines={titleLines} />
      </div>
      <div
        className="relative shrink-0 overflow-hidden"
        style={{
          width: RIGHT_BOX_WIDTH,
          height: RIGHT_BOX_HEIGHT,
          marginLeft: -BOX_OVERLAP,
          transform: "rotate(-90deg)",
          borderRadius: 50,
          border: "2px solid #FFF",
          background: "#07423C",
          zIndex: 2,
        }}
      >
        <RightBoxContent imageSrc={imageSrc} imageAlt={imageAlt} />
      </div>
    </div>
  );
}
