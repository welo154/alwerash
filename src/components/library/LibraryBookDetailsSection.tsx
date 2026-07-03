import Image from "next/image";
import localFont from "next/font/local";
import {
  getBookAboutExcerpt,
  getBookAuthorsLabel,
  getBookDetailImageSrc,
  getBookDetailTitle,
  type LibraryBook,
} from "./library-books";

const pangeaVar = localFont({
  src: "../../../public/fonts/FwTRIAL-PangeaVAR.woff2",
  display: "swap",
  weight: "100 900",
  style: "normal",
});

const BOOK_IMAGE_WIDTH_PX = 460;
const BOOK_IMAGE_HEIGHT_PX = 698.214;
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

function LibraryBookDetailFavoriteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="33"
      viewBox="0 0 36 33"
      fill="none"
      className="h-[31px] w-[34px] shrink-0"
      aria-hidden
    >
      <path
        d="M32.1791 3.54061C31.3483 2.67175 30.3619 1.98252 29.2762 1.51227C28.1906 1.04202 27.0269 0.799988 25.8518 0.799988C24.6766 0.799988 23.513 1.04202 22.4273 1.51227C21.3417 1.98252 20.3553 2.67175 19.5245 3.54061L17.8003 5.34296L16.0762 3.54061C14.3981 1.7864 12.1221 0.800897 9.74892 0.800897C7.37572 0.800897 5.09973 1.7864 3.42163 3.54061C1.74353 5.29482 0.800781 7.67404 0.800781 10.1549C0.800781 12.6357 1.74353 15.0149 3.42163 16.7691L17.8003 31.8L32.1791 16.7691C33.0102 15.9007 33.6696 14.8696 34.1194 13.7347C34.5692 12.5998 34.8008 11.3833 34.8008 10.1549C34.8008 8.92641 34.5692 7.70998 34.1194 6.57509C33.6696 5.44019 33.0102 4.40906 32.1791 3.54061Z"
        fill="white"
        stroke="#1E1E1E"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LibraryBookAboutActions({ bookTitle }: { bookTitle: string }) {
  return (
    <div className="mt-[35px] flex items-center">
      <button
        type="button"
        className={`box-border flex h-[53px] w-[176px] items-center justify-center rounded-lg border border-black bg-[#EA83F0] px-4 text-center text-[#141413] hover:opacity-90 ${pangeaVar.className}`}
        style={{
          fontSize: "24px",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "19.6px",
        }}
      >
        DOWNLOAD
      </button>
      <button
        type="button"
        className="ml-[29px] shrink-0 hover:opacity-80"
        aria-label={`Save ${bookTitle}`}
      >
        <LibraryBookDetailFavoriteIcon />
      </button>
    </div>
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
      <div className="shrink-0" style={bookSizeStyle}>
        <Image
          src={getBookDetailImageSrc(book)}
          alt={book.imageAlt}
          width={BOOK_IMAGE_WIDTH_PX}
          height={Math.round(BOOK_IMAGE_HEIGHT_PX)}
          className="block"
          style={bookSizeStyle}
          draggable={false}
          unoptimized
          priority
        />
      </div>

      <div className="min-w-0 shrink-0">
        <h1
          className={`m-0 text-black ${pangeaVar.className}`}
          style={{
            width: "599px",
            fontSize: "36px",
            fontWeight: 500,
            lineHeight: "normal",
          }}
        >
          {getBookDetailTitle(book)}
        </h1>

        <p
          className={`m-0 mt-[20px] text-black/60 ${pangeaVar.className}`}
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
          className={`m-0 mt-[32px] text-black/60 ${pangeaVar.className}`}
          style={{
            fontSize: "24px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
          }}
        >
          About this book
        </h2>

        <p
          className={`m-0 mt-[19px] text-black ${pangeaVar.className}`}
          style={{
            width: "575px",
            fontSize: "24px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "127%",
          }}
        >
          {getBookAboutExcerpt(book)}
        </p>

        <LibraryBookAboutActions bookTitle={book.title} />
      </div>
    </section>
  );
}
