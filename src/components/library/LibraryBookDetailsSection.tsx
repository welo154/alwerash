import Image from "next/image";
import localFont from "next/font/local";
import {
  getBookAboutExcerpt,
  getBookAuthorsLabel,
  getBookDetailTitle,
  type LibraryBook,
} from "./library-books";
import { LibraryBookDetailsScroller } from "./LibraryBookDetailsScroller";

const pangeaVar = localFont({
  src: "../../../public/fonts/FwTRIAL-PangeaVAR.woff2",
  display: "swap",
  weight: "100 900",
  style: "normal",
});

const BOOK_IMAGE_WIDTH_PX = 470.4;
const BOOK_IMAGE_HEIGHT_PX = 714;
const BOOK_DETAIL_COVER_SRC = "/library/books/book-detail-cover.png";
const DESCRIPTION_DIVIDER_WIDTH_PX = 589;
const DESCRIPTION_DIVIDER_STROKE_PX = 1;
const DESCRIPTION_DIVIDER_V_HEIGHT_PX = 92 * 2;
const DESCRIPTION_DIVIDER_INNER_X_PX = 176;
const BOOK_TOPICS = [
  "EDITORIAL DESIGN",
  "TYPOGRAPHY",
  "COLOR",
  "PUBLICATION AND MAGAZINE LAYOUT",
  "GRID SYSTEMS",
  "VISUAL HEIRARCHY",
] as const;
const DETAILS_GAP_PX = 71;
const INFO_BOX_WIDTH_PX = 589;
const INFO_BOX_HEIGHT_PX = 100;
const INFO_BOX_COL_1_PX = 250;
const INFO_BOX_COL_2_PX = 183;
const INFO_BOX_COL_3_PX =
  INFO_BOX_WIDTH_PX - INFO_BOX_COL_1_PX - INFO_BOX_COL_2_PX - 2;
const INFO_BOX_DIVIDER_WIDTH_PX = 1;

const READER_AVATARS = [
  { fill: "#FFFFFF", initials: "AM" },
  { fill: "#89F496", initials: "MA" },
  { fill: "#66E0F2", initials: "FM" },
] as const;
const READER_AVATAR_SIZE_PX = 54.258;
const READER_AVATAR_OFFSET_PX = 16;

function ReaderAvatarCircle({
  fill,
  left,
  initials,
}: {
  fill: string;
  left: number;
  initials: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={READER_AVATAR_SIZE_PX}
      height={READER_AVATAR_SIZE_PX}
      viewBox="0 0 56 56"
      fill="none"
      className="absolute top-1/2 -translate-y-1/2"
      style={{ left }}
      aria-hidden
    >
      <path
        d="M27.6292 54.7584C42.6122 54.7584 54.7584 42.6122 54.7584 27.6292C54.7584 12.6462 42.6122 0.5 27.6292 0.5C12.6462 0.5 0.5 12.6462 0.5 27.6292C0.5 42.6122 12.6462 54.7584 27.6292 54.7584Z"
        fill={fill}
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="28"
        y="28.5"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#000"
        className={pangeaVar.className}
        style={{
          fontSize: "24px",
          fontStyle: "normal",
          fontWeight: 600,
          lineHeight: "normal",
        }}
      >
        {initials}
      </text>
    </svg>
  );
}

function InfoBoxCell({
  width,
  children,
}: {
  width: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex h-full shrink-0 items-center justify-center overflow-hidden"
      style={{ width: `${width}px` }}
    >
      {children}
    </div>
  );
}

function LibraryBookReadersCell() {
  const avatarsWidth =
    READER_AVATAR_SIZE_PX + READER_AVATAR_OFFSET_PX * (READER_AVATARS.length - 1);

  return (
    <div className="flex items-center">
      <div
        className="relative shrink-0"
        style={{ width: `${avatarsWidth}px`, height: `${READER_AVATAR_SIZE_PX}px` }}
      >
        {READER_AVATARS.map((avatar, index) => (
          <ReaderAvatarCircle
            key={avatar.initials}
            fill={avatar.fill}
            initials={avatar.initials}
            left={index * READER_AVATAR_OFFSET_PX}
          />
        ))}
      </div>
      <p className={`m-0 ml-2 text-black ${pangeaVar.className}`}>
        <span
          style={{
            fontSize: "24px",
            fontStyle: "italic",
            fontWeight: 400,
            lineHeight: "normal",
          }}
        >
          +24
        </span>{" "}
        <span
          style={{
            fontSize: "24px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
          }}
        >
          Read
        </span>
      </p>
    </div>
  );
}

function LibraryBookIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="29"
      viewBox="0 0 24 29"
      fill="none"
      className="h-[27px] w-[22px] shrink-0"
      aria-hidden
    >
      <path
        d="M1 24.625C1 23.7299 1.36216 22.8715 2.00682 22.2385C2.65148 21.6056 3.52582 21.25 4.4375 21.25H23M1 24.625C1 25.5201 1.36216 26.3786 2.00682 27.0115C2.65148 27.6444 3.52582 28 4.4375 28H23V1H4.4375C3.52582 1 2.65148 1.35558 2.00682 1.98851C1.36216 2.62145 1 3.47989 1 4.375V24.625Z"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LibraryBookPagesCell({ pages }: { pages?: number }) {
  const pageCount = pages ?? 0;

  return (
    <div className="flex items-center">
      <LibraryBookIcon />
      <p className={`m-0 ml-2 text-black ${pangeaVar.className}`}>
        <span
          style={{
            fontSize: "24px",
            fontStyle: "italic",
            fontWeight: 400,
            lineHeight: "normal",
          }}
        >
          {pageCount}
        </span>{" "}
        <span
          style={{
            fontSize: "24px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
          }}
        >
          Pages
        </span>
      </p>
    </div>
  );
}

function LibraryBookLikeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="25"
      viewBox="0 0 28 25"
      fill="none"
      className="h-[23px] w-[26px] shrink-0"
      aria-hidden
    >
      <path
        d="M7.6048 11.3499L12.8886 1C13.9397 1 14.9476 1.36348 15.6908 2.01048C16.434 2.65747 16.8515 3.53499 16.8515 4.44998V9.04995H24.3282C24.7111 9.04617 25.0904 9.11493 25.4398 9.25145C25.7893 9.38797 26.1004 9.58899 26.3517 9.84059C26.603 10.0922 26.7885 10.3883 26.8952 10.7085C27.002 11.0287 27.0276 11.3653 26.9701 11.6949L25.1472 22.0449C25.0516 22.5933 24.7316 23.0932 24.2461 23.4525C23.7606 23.8117 23.1424 24.0061 22.5052 23.9999H7.6048M7.6048 11.3499V23.9999M7.6048 11.3499H3.64192C2.94124 11.3499 2.26926 11.5923 1.7738 12.0236C1.27834 12.4549 1 13.0399 1 13.6499V21.6999C1 22.3099 1.27834 22.8949 1.7738 23.3262C2.26926 23.7575 2.94124 23.9999 3.64192 23.9999H7.6048"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LibraryBookLikeCell() {
  return (
    <div className="flex items-center">
      <LibraryBookLikeIcon />
      <span
        className={`ml-[5px] text-black ${pangeaVar.className}`}
        style={{
          fontSize: "24px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
        }}
      >
        98%
      </span>
    </div>
  );
}

function LibraryBookMetaCell({
  label,
  value,
  paddingLeft = 30,
  verticallyCentered = true,
}: {
  label: string;
  value: string;
  paddingLeft?: number;
  verticallyCentered?: boolean;
}) {
  return (
    <div
      className={`flex min-w-0 flex-col ${verticallyCentered ? "h-full justify-center" : ""}`}
      style={{ paddingLeft }}
    >
      <p
        className={`m-0 text-black ${pangeaVar.className}`}
        style={{
          fontSize: "24px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
          opacity: 0.6,
        }}
      >
        {label}
      </p>
      <p
        className={`m-0 text-black ${pangeaVar.className}`}
        style={{
          marginTop: 8,
          fontSize: "24px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "127%",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function BookDetailPageBox() {
  return (
    <div
      className={`box-border flex items-center justify-center text-black ${pangeaVar.className}`}
      style={{
        width: 62,
        height: 38,
        padding: "0 16px",
        borderRadius: 8,
        border: "0.3px solid #000",
        background: "#FFF",
        fontSize: "24px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "normal",
      }}
    >
      1
    </div>
  );
}

function BookDetailFavoriteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="33"
      viewBox="0 0 36 33"
      fill="none"
      className="shrink-0"
      style={{ width: 34, height: 31 }}
      aria-hidden
    >
      <path
        d="M32.3783 3.74063C31.5475 2.87177 30.5611 2.18253 29.4755 1.71228C28.3898 1.24204 27.2262 1 26.051 1C24.8758 1 23.7122 1.24204 22.6265 1.71228C21.5409 2.18253 20.5545 2.87177 19.7237 3.74063L17.9996 5.54297L16.2754 3.74063C14.5973 1.98641 12.3213 1.00091 9.94813 1.00091C7.57494 1.00091 5.29895 1.98641 3.62085 3.74063C1.94275 5.49484 1 7.87405 1 10.3549C1 12.8357 1.94275 15.2149 3.62085 16.9691L17.9996 32L32.3783 16.9691C33.2094 16.1007 33.8688 15.0696 34.3186 13.9347C34.7685 12.7998 35 11.5833 35 10.3549C35 9.12642 34.7685 7.91 34.3186 6.7751C33.8688 5.6402 33.2094 4.60908 32.3783 3.74063Z"
        fill="#FFF"
        stroke="#000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookDetailDownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="37"
      height="37"
      viewBox="0 0 37 37"
      fill="none"
      className="shrink-0"
      aria-hidden
    >
      <path
        d="M36 24.3333V32.1111C36 33.1425 35.5903 34.1317 34.861 34.861C34.1317 35.5903 33.1425 36 32.1111 36H4.88889C3.85749 36 2.86834 35.5903 2.13903 34.861C1.40972 34.1317 1 33.1425 1 32.1111V24.3333M28.2222 14.6111L18.5 24.3333L8.77778 14.6111M18.5 24.3333V1"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookDetailShareIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="33"
      height="37"
      viewBox="0 0 33 37"
      fill="none"
      className="shrink-0"
      aria-hidden
    >
      <path
        d="M10.6272 21.1425L22.39 28.1075M22.3728 8.8925L10.6272 15.8575M32 6.25C32 9.1495 29.6868 11.5 26.8333 11.5C23.9799 11.5 21.6667 9.1495 21.6667 6.25C21.6667 3.35051 23.9799 1 26.8333 1C29.6868 1 32 3.35051 32 6.25ZM11.3333 18.5C11.3333 21.3995 9.02014 23.75 6.16667 23.75C3.3132 23.75 1 21.3995 1 18.5C1 15.6005 3.3132 13.25 6.16667 13.25C9.02014 13.25 11.3333 15.6005 11.3333 18.5ZM32 30.75C32 33.6495 29.6868 36 26.8333 36C23.9799 36 21.6667 33.6495 21.6667 30.75C21.6667 27.8505 23.9799 25.5 26.8333 25.5C29.6868 25.5 32 27.8505 32 30.75Z"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LibraryBookDetailsSection({ book }: { book: LibraryBook }) {
  const bookSizeStyle = {
    width: `${BOOK_IMAGE_WIDTH_PX}px`,
    height: `${BOOK_IMAGE_HEIGHT_PX}px`,
  } as const;

  return (
    <section
      className="mx-auto flex w-fit items-start"
      style={{ gap: `${DETAILS_GAP_PX}px` }}
      aria-label="Book details"
    >
      <div className="flex shrink-0 flex-col" style={{ width: BOOK_IMAGE_WIDTH_PX }}>
        <div className="shrink-0" style={{ ...bookSizeStyle, marginTop: 14 }}>
          <Image
            src={BOOK_DETAIL_COVER_SRC}
            alt={book.imageAlt}
            width={470}
            height={BOOK_IMAGE_HEIGHT_PX}
            className="block"
            style={bookSizeStyle}
            draggable={false}
            unoptimized
            priority
          />
        </div>

        <div
          className="flex w-full items-center justify-between"
          style={{ marginTop: 20 }}
        >
          <div className="flex items-center">
            <BookDetailPageBox />
            <span
              className={`text-black ${pangeaVar.className}`}
              style={{
                marginLeft: 9,
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
              }}
            >
              / 1
            </span>
          </div>
          <div className="flex items-center">
            <button type="button" className="shrink-0 hover:opacity-80" aria-label={`Save ${book.title}`}>
              <BookDetailFavoriteIcon />
            </button>
            <button
              type="button"
              className="shrink-0 hover:opacity-80"
              style={{ marginLeft: 17 }}
              aria-label={`Download ${book.title}`}
            >
              <BookDetailDownloadIcon />
            </button>
            <button
              type="button"
              className="shrink-0 hover:opacity-80"
              style={{ marginLeft: 17 }}
              aria-label={`Share ${book.title}`}
            >
              <BookDetailShareIcon />
            </button>
          </div>
        </div>
      </div>

      <LibraryBookDetailsScroller
        className="box-border flex min-w-0 shrink-0 flex-col overflow-hidden"
        style={{
          width: 694,
          height: BOOK_IMAGE_HEIGHT_PX + 34,
          padding: "50px 47px 0",
          borderRadius: 50,
          border: "2px solid #89F496",
        }}
      >
          <h1
            className={`m-0 w-full text-black ${pangeaVar.className}`}
            style={{
              fontSize: "36px",
              fontWeight: 500,
              lineHeight: "normal",
            }}
          >
            {getBookDetailTitle(book)}
          </h1>

          <p
            className={`m-0 mt-[20px] w-full text-black/60 ${pangeaVar.className}`}
            style={{
              fontSize: "24px",
              fontWeight: 400,
              lineHeight: "normal",
            }}
          >
            {getBookAuthorsLabel(book)}
          </p>

          <div
            className="mt-[32px] box-border flex overflow-hidden border border-black/60 bg-white"
            style={{
              width: `${INFO_BOX_WIDTH_PX}px`,
              height: `${INFO_BOX_HEIGHT_PX}px`,
            }}
          >
            <InfoBoxCell width={INFO_BOX_COL_1_PX}>
              <LibraryBookReadersCell />
            </InfoBoxCell>
            <div
              className="shrink-0 bg-black"
              style={{ width: `${INFO_BOX_DIVIDER_WIDTH_PX}px`, height: `${INFO_BOX_HEIGHT_PX}px` }}
            />
            <InfoBoxCell width={INFO_BOX_COL_2_PX}>
              <LibraryBookPagesCell pages={book.pages} />
            </InfoBoxCell>
            <div
              className="shrink-0 bg-black"
              style={{ width: `${INFO_BOX_DIVIDER_WIDTH_PX}px`, height: `${INFO_BOX_HEIGHT_PX}px` }}
            />
            <InfoBoxCell width={INFO_BOX_COL_3_PX}>
              <LibraryBookLikeCell />
            </InfoBoxCell>
          </div>

          <h2
            className={`m-0 mt-[32px] w-full text-black/60 ${pangeaVar.className}`}
            style={{
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
            }}
          >
            Description
          </h2>

          <p
            className={`m-0 mt-[19px] w-full text-black ${pangeaVar.className}`}
            style={{
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "127%",
            }}
          >
            {getBookAboutExcerpt(book)}
          </p>

          <div
            className="mx-auto mt-[38px] box-border grid"
            style={{
              width: DESCRIPTION_DIVIDER_WIDTH_PX,
              height: DESCRIPTION_DIVIDER_V_HEIGHT_PX,
              gridTemplateColumns: `${DESCRIPTION_DIVIDER_INNER_X_PX}px 1fr`,
              gridTemplateRows: "1fr 1fr",
              border: `${DESCRIPTION_DIVIDER_STROKE_PX}px solid rgba(0, 0, 0, 0.6)`,
            }}
          >
            <div
              style={{
                borderRight: `${DESCRIPTION_DIVIDER_STROKE_PX}px solid rgba(0, 0, 0, 0.6)`,
                borderBottom: `${DESCRIPTION_DIVIDER_STROKE_PX}px solid rgba(0, 0, 0, 0.6)`,
              }}
            >
              <LibraryBookMetaCell
                label="Year"
                value={String(book.publishedYear ?? 2003)}
              />
            </div>
            <div
              style={{
                borderBottom: `${DESCRIPTION_DIVIDER_STROKE_PX}px solid rgba(0, 0, 0, 0.6)`,
              }}
            >
              <LibraryBookMetaCell
                label="Location"
                value="New York, USA"
                paddingLeft={65}
              />
            </div>
            <div
              style={{
                borderRight: `${DESCRIPTION_DIVIDER_STROKE_PX}px solid rgba(0, 0, 0, 0.6)`,
              }}
            >
              <LibraryBookMetaCell label="Type" value="Book" />
            </div>
            <div>
              <LibraryBookMetaCell
                label="Media"
                value="Print Book.eBook"
                paddingLeft={65}
              />
            </div>
          </div>

          <div
            className="mx-auto"
            style={{ width: DESCRIPTION_DIVIDER_WIDTH_PX, marginTop: 38 }}
          >
            <LibraryBookMetaCell
              label="Publisher"
              value="Allworth press"
              verticallyCentered={false}
            />
          </div>

          <div
            className="mx-auto"
            style={{ width: DESCRIPTION_DIVIDER_WIDTH_PX, marginTop: 38 }}
          >
            <div
              style={{
                width: DESCRIPTION_DIVIDER_WIDTH_PX,
                height: 1,
                opacity: 0.5,
                background: "#000",
              }}
              aria-hidden
            />

            <p
              className={`m-0 mt-[32px] text-black ${pangeaVar.className}`}
              style={{
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
                opacity: 0.6,
              }}
            >
              Topics
            </p>

            <div className="mt-[19px] flex flex-wrap" style={{ gap: 12 }}>
              {BOOK_TOPICS.map((topic) => (
                <span
                  key={topic}
                  className={`inline-flex h-[45px] items-center justify-center rounded-[8px] border border-black bg-white px-4 text-center text-black ${pangeaVar.className}`}
                  style={{
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "19.6px",
                  }}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
      </LibraryBookDetailsScroller>
    </section>
  );
}
