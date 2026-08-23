export const ARTICLE_CARD_WIDTH = 194.43;
export const ARTICLE_CARD_HEIGHT = 295.117;
export const ARTICLE_COVER_WIDTH = 194;
export const ARTICLE_COVER_HEIGHT = 294;
export const ARTICLE_COVER_IMAGE = "/library/articles/article-card-cover.png";

const ARTICLE_CLIP_WIDTH = 26;
const ARTICLE_CLIP_HEIGHT = 60;
const ARTICLE_CLIP_TOP_PX = -10;
const ARTICLE_CLIP_RIGHT_PX = 53.94;

function ArticleCardShape() {
  return (
    <div
      aria-hidden
      className="absolute left-0 top-0"
      style={{
        zIndex: 0,
        width: ARTICLE_CARD_WIDTH,
        height: ARTICLE_CARD_HEIGHT,
        transform: "rotate(-5.863deg)",
        borderRadius: 20,
        background: "#8AF396",
        boxShadow:
          "16px 16px 11px 0 rgba(0, 0, 0, 0.06), -3px 0 5px 0 rgba(0, 0, 0, 0.15) inset",
      }}
    />
  );
}

function ArticleCardGray() {
  return (
    <div
      aria-hidden
      className="absolute left-0 top-0"
      style={{
        zIndex: 1,
        width: ARTICLE_COVER_WIDTH,
        height: ARTICLE_COVER_HEIGHT,
        borderRadius: 20,
        background: "#D9D9D9",
        boxShadow:
          "16px 16px 11px 0 rgba(0, 0, 0, 0.06), -3px 0 5px 0 rgba(0, 0, 0, 0.15) inset",
      }}
    />
  );
}

function ArticleCardCover() {
  return (
    <div
      aria-hidden
      className="absolute left-0 top-0 overflow-hidden"
      style={{
        zIndex: 2,
        width: ARTICLE_COVER_WIDTH,
        height: ARTICLE_COVER_HEIGHT,
        borderRadius: 20,
        boxShadow:
          "16px 16px 11px 0 rgba(0, 0, 0, 0.06), -3px 0 5px 0 rgba(0, 0, 0, 0.15) inset",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ARTICLE_COVER_IMAGE}
        alt=""
        className="h-full w-full object-cover"
        draggable={false}
      />
    </div>
  );
}

function ArticleCardClip({ clipId }: { clipId: string }) {
  const filterId = `article-clip-shadow-${clipId}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={ARTICLE_CLIP_WIDTH}
      height={ARTICLE_CLIP_HEIGHT}
      viewBox="0 0 26 60"
      fill="none"
      aria-hidden
      className="absolute"
      style={{
        zIndex: 3,
        top: ARTICLE_CLIP_TOP_PX,
        right: ARTICLE_CLIP_RIGHT_PX,
        transform: "rotate(1.9deg)",
        filter: "drop-shadow(2px -1px 1.8px rgba(0, 0, 0, 0.30))",
      }}
    >
      <g filter={`url(#${filterId})`}>
        <path
          d="M4.92519 9.6527C5.29551 6.06912 8.50077 3.46426 12.0843 3.83457L13.6635 3.99776C18.1193 4.4582 21.3581 8.44355 20.8977 12.8993L17.0212 50.4129C16.5652 54.8251 12.6188 58.0323 8.20665 57.5763C3.73335 57.1141 0.511281 53.0692 1.06088 48.6058L2.98124 33.0102"
          stroke="#8AF396"
          strokeWidth="2"
        />
      </g>
      <defs>
        <filter
          id={filterId}
          x="0"
          y="-0.000195265"
          width="25.7414"
          height="59.4193"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="2" dy="-1" />
          <feGaussianBlur stdDeviation="0.9" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}

/** Upper article card stack: green + gray + photo + clip (no meta). */
export function LibraryArticleCardVisual({ clipId }: { clipId: string }) {
  return (
    <div
      className="relative overflow-visible"
      style={{
        width: ARTICLE_COVER_WIDTH,
        height: ARTICLE_COVER_HEIGHT,
      }}
    >
      <ArticleCardShape />
      <ArticleCardGray />
      <ArticleCardCover />
      <ArticleCardClip clipId={clipId} />
    </div>
  );
}
