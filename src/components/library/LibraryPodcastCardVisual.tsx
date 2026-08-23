export const PODCAST_HOME_PORTRAIT_WIDTH = 157.165;
export const PODCAST_HOME_PORTRAIT_HEIGHT = 251.742;
export const PODCAST_HOME_SHAPE_WIDTH = 149.153;
export const PODCAST_HOME_SHAPE_HEIGHT = 264.025;

const PODCAST_HOME_PHOTO_LEFT = 62.81;
const PODCAST_HOME_PHOTO_TOP = 38;
const PODCAST_HOME_SHAPE_NUDGE_X = 26;
const PODCAST_HOME_SHAPE_NUDGE_Y = 33;

/** Tight stack: green accent + portrait (no outer panel margins). */
export function LibraryPodcastCardVisual() {
  return (
    <div
      className="relative overflow-visible"
      style={{
        width: Math.max(PODCAST_HOME_PORTRAIT_WIDTH, PODCAST_HOME_SHAPE_WIDTH + PODCAST_HOME_SHAPE_NUDGE_X),
        height: Math.max(
          PODCAST_HOME_PORTRAIT_HEIGHT,
          PODCAST_HOME_SHAPE_HEIGHT + PODCAST_HOME_SHAPE_NUDGE_Y
        ),
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={PODCAST_HOME_SHAPE_WIDTH}
        height={PODCAST_HOME_SHAPE_HEIGHT}
        viewBox="0 0 150 265"
        fill="none"
        aria-hidden
        className="absolute"
        style={{
          zIndex: 0,
          left:
            (PODCAST_HOME_PORTRAIT_WIDTH - PODCAST_HOME_SHAPE_WIDTH) / 2 +
            PODCAST_HOME_SHAPE_NUDGE_X,
          top:
            (PODCAST_HOME_PORTRAIT_HEIGHT - PODCAST_HOME_SHAPE_HEIGHT) / 2 +
            PODCAST_HOME_SHAPE_NUDGE_Y,
        }}
      >
        <path
          d="M148.786 250.232C150.933 259.222 143.194 268.125 138.556 262.003L112.816 228.025C105.146 232.813 96.0859 235.584 86.3778 235.584L24.163 235.584C15.3991 235.583 7.16316 233.326 0.000842263 229.365C4.47034 230.675 9.19933 231.378 14.0926 231.378L81.6034 231.379C109.218 231.379 131.603 208.993 131.603 181.379L131.603 15.4937C131.603 10.0855 130.745 4.87787 129.156 -0.000398477C133.739 7.55331 136.378 16.4174 136.378 25.898L136.378 185.584C136.378 188.715 136.088 191.78 135.537 194.753L148.786 250.232Z"
          fill="#89F496"
        />
      </svg>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/library/podcasts/podcasts-section-portrait.png"
        alt="Podcast host portrait"
        width={PODCAST_HOME_PORTRAIT_WIDTH}
        height={PODCAST_HOME_PORTRAIT_HEIGHT}
        className="absolute left-0 top-0"
        style={{
          zIndex: 1,
          width: PODCAST_HOME_PORTRAIT_WIDTH,
          height: PODCAST_HOME_PORTRAIT_HEIGHT,
          objectFit: "cover",
        }}
        draggable={false}
      />
    </div>
  );
}

/** Home category-card layout: photo inset in the dark green panel. */
export function LibraryPodcastHomePanelVisual() {
  const shapeLeft =
    PODCAST_HOME_PHOTO_LEFT +
    (PODCAST_HOME_PORTRAIT_WIDTH - PODCAST_HOME_SHAPE_WIDTH) / 2 +
    PODCAST_HOME_SHAPE_NUDGE_X;
  const shapeTop =
    PODCAST_HOME_PHOTO_TOP +
    (PODCAST_HOME_PORTRAIT_HEIGHT - PODCAST_HOME_SHAPE_HEIGHT) / 2 +
    PODCAST_HOME_SHAPE_NUDGE_Y;

  return (
    <div className="relative h-full w-full overflow-visible">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={PODCAST_HOME_SHAPE_WIDTH}
        height={PODCAST_HOME_SHAPE_HEIGHT}
        viewBox="0 0 150 265"
        fill="none"
        aria-hidden
        className="absolute"
        style={{
          zIndex: 0,
          left: shapeLeft,
          top: shapeTop,
        }}
      >
        <path
          d="M148.786 250.232C150.933 259.222 143.194 268.125 138.556 262.003L112.816 228.025C105.146 232.813 96.0859 235.584 86.3778 235.584L24.163 235.584C15.3991 235.583 7.16316 233.326 0.000842263 229.365C4.47034 230.675 9.19933 231.378 14.0926 231.378L81.6034 231.379C109.218 231.379 131.603 208.993 131.603 181.379L131.603 15.4937C131.603 10.0855 130.745 4.87787 129.156 -0.000398477C133.739 7.55331 136.378 16.4174 136.378 25.898L136.378 185.584C136.378 188.715 136.088 191.78 135.537 194.753L148.786 250.232Z"
          fill="#89F496"
        />
      </svg>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/library/podcasts/podcasts-section-portrait.png"
        alt="Podcast host portrait"
        width={PODCAST_HOME_PORTRAIT_WIDTH}
        height={PODCAST_HOME_PORTRAIT_HEIGHT}
        className="absolute"
        style={{
          zIndex: 1,
          left: PODCAST_HOME_PHOTO_LEFT,
          top: PODCAST_HOME_PHOTO_TOP,
          width: PODCAST_HOME_PORTRAIT_WIDTH,
          height: PODCAST_HOME_PORTRAIT_HEIGHT,
          objectFit: "cover",
        }}
        draggable={false}
      />
    </div>
  );
}
