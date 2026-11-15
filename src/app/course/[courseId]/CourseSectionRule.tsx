type CourseSectionRuleProps = {
  className?: string;
  /**
   * - default: phone + tablet, hidden on desktop
   * - phone: phone only
   * - tablet: tablet only (parent already full-bleed — no padding breakout)
   * - column: phone + tablet + desktop hairline in the details column
   */
  show?: "default" | "phone" | "tablet" | "column";
};

/**
 * Centered rule between course-page sections.
 * Breaks out of the 30px column padding (except tablet, whose parent already
 * does), then centers a fixed-width line with physical left/translate so LTR
 * and RTL both land on the same center.
 */
export function CourseSectionRule({
  className,
  show = "default",
}: CourseSectionRuleProps) {
  const shell =
    show === "phone"
      ? "mt-[35px] min-[744px]:hidden"
      : show === "tablet"
        ? "mt-0 hidden min-[744px]:max-lg:block"
        : show === "column"
          ? "mt-[35px] min-[744px]:max-lg:mt-[51px] lg:mt-[57px]"
          : "mt-[35px] min-[744px]:max-lg:mt-[51px] lg:hidden";

  const breakout =
    show === "tablet"
      ? "w-full"
      : show === "column"
        ? "w-[calc(100%+30px)] -ms-[30px] lg:ms-0 lg:w-full"
        : "w-[calc(100%+30px)] -ms-[30px]";

  return (
    <div
      className={[
        "relative box-border h-0 max-w-none self-stretch",
        breakout,
        shell,
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden
    >
      <div
        className={[
          // Physical centering — identical in LTR and RTL
          "absolute left-1/2 top-0 box-border h-0 -translate-x-1/2",
          "border-0 border-t border-black bg-black opacity-30",
          // Shared width on phone / tablet
          "w-[359px] max-w-[calc(100%-34px)]",
          "min-[744px]:max-lg:w-[676px] min-[744px]:max-lg:max-w-[calc(100%-34px)]",
          show === "column"
            ? "lg:static lg:left-auto lg:translate-x-0 lg:h-px lg:w-full lg:max-w-none lg:border-0"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
      />
    </div>
  );
}
