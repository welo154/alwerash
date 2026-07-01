export const LEARN_CAROUSEL_SLIDE_MS = 400;

/** One card per swipe — shared by featured tracks and popular classes. */
export const learnCarouselMousewheel = {
  forceToAxis: true,
  releaseOnEdges: true,
  sensitivity: 1,
  thresholdDelta: 40,
  thresholdTime: 350,
} as const;

export const learnCarouselSwiperBehavior = {
  slidesPerView: "auto" as const,
  spaceBetween: 18,
  slidesPerGroup: 1,
  slidesPerGroupAuto: false,
  speed: LEARN_CAROUSEL_SLIDE_MS,
  grabCursor: true,
  allowTouchMove: true,
  simulateTouch: true,
  observer: true,
  observeParents: true,
  shortSwipes: true,
  longSwipes: true,
  threshold: 10,
  touchReleaseOnEdges: true,
  resistanceRatio: 0.85,
  longSwipesRatio: 0.25,
};
