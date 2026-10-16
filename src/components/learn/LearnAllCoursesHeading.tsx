"use client";

import { LearnClassesCarouselHeading } from "@/components/learn/LearnClassesCarouselHeading";

export function LearnAllCoursesHeading({
  onNext,
  atEnd = false,
}: {
  onNext?: () => void;
  atEnd?: boolean;
}) {
  return (
    <LearnClassesCarouselHeading
      primary="ALL"
      secondary="COURSES"
      onNext={onNext}
      atEnd={atEnd}
      nextAriaLabel="Next courses"
      arrowGapPx={30}
      arrowSize={47}
      className="max-[743px]:-ms-6 max-[743px]:ps-[30px] sm:max-[743px]:-ms-8 min-[744px]:max-lg:-ms-8 min-[744px]:max-lg:ps-[61px]"
      pillClassName="max-lg:bg-transparent max-lg:px-0 lg:px-[22px]"
      arrowGapClassName="max-[743px]:gap-[30px] min-[744px]:max-lg:gap-[23px] lg:gap-[30px]"
      tabletArrowSize={41}
    />
  );
}
