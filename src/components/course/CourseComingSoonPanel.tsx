import { LocalizedText } from "@/components/i18n/LocalizedText";
import { Tr } from "@/components/i18n/Tr";

type CourseComingSoonPanelProps = {
  courseTitle: string;
  courseTitleAr?: string | null;
  instructorName: string;
  instructorNameAr?: string | null;
  instructorRole: string;
  instructorRoleAr?: string | null;
  description: string;
  fontFamily: string;
};

/**
 * Public course page left column when the admin marked the class as Coming soon.
 * Desktop spacing matches the Figma frame (120px inset from the 1440px course container).
 */
export function CourseComingSoonPanel({
  courseTitle,
  courseTitleAr,
  instructorName,
  instructorNameAr,
  instructorRole,
  instructorRoleAr,
  description,
  fontFamily,
}: CourseComingSoonPanelProps) {
  const textBase = {
    color: "var(--Black, #000)",
    fontFamily,
    fontStyle: "normal" as const,
    lineHeight: "normal",
  };

  return (
    <section className="max-lg:max-w-full max-lg:pr-[30px]" aria-live="polite">
      <div
        className="box-border flex h-[51px] w-[441px] max-w-full items-center justify-center rounded-[23px] bg-[var(--Purple,#FF8CFF)] px-4 max-lg:h-auto max-lg:min-h-[44px] max-lg:w-full max-lg:py-3"
      >
        <p
          className="m-0 text-center text-[24px] font-medium uppercase max-lg:text-[16px]"
          style={{
            ...textBase,
            fontWeight: 500,
            fontVariationSettings: '"wght" 500',
          }}
        >
          <Tr>{"We're still preparing this class"}</Tr>
        </p>
      </div>

      {/* 70px from container left while the column sits at 120px → −50px */}
      <div
        className="mt-[25px] h-0 w-[775px] max-w-none border-0 border-t border-black bg-black opacity-60 max-lg:ms-0 max-lg:w-full lg:-ms-[50px]"
        aria-hidden
      />

      <h1
        className="m-0 mt-[19px] w-full text-[36px] font-medium max-lg:text-[24px] lg:ar:text-right lg:ar:text-[32px]"
        style={{
          ...textBase,
          fontWeight: 500,
          fontVariationSettings: '"wght" 500',
        }}
      >
        <LocalizedText en={courseTitle} ar={courseTitleAr} />
      </h1>

      <p
        className="m-0 mt-[3px] text-[18px] font-normal max-lg:text-[16px] lg:ar:text-right"
        style={{
          ...textBase,
          fontWeight: 400,
          fontVariationSettings: '"wght" 400',
          lineHeight: "127%",
          opacity: 0.6,
        }}
      >
        <span className="ar:hidden">
          A course by {instructorName}, {instructorRole}
        </span>
        <span className="hidden ar:inline">
          دورة من تقديم {instructorNameAr?.trim() || instructorName}
          {", "}
          {instructorRoleAr?.trim() || instructorRole}
        </span>
      </p>

      {/* Same 70px container inset as the rule above the title */}
      <div
        className="mt-[19px] h-0 w-[775px] max-w-none border-0 border-t border-black bg-black opacity-60 max-lg:ms-0 max-lg:w-full lg:-ms-[50px]"
        aria-hidden
      />

      <h2
        className="m-0 mt-[25px] text-[24px] font-normal max-lg:text-[20px] lg:ar:text-right"
        style={{
          ...textBase,
          fontWeight: 400,
          fontVariationSettings: '"wght" 400',
        }}
      >
        <Tr>Description</Tr>
      </h2>

      <p
        className="m-0 mt-[22px] w-[673px] max-w-full whitespace-pre-line text-[18px] font-normal max-lg:text-[16px] lg:ar:text-right"
        style={{
          ...textBase,
          fontWeight: 400,
          fontVariationSettings: '"wght" 400',
        }}
      >
        <span className="ar:hidden">{description}</span>
        <span className="hidden ar:inline">
          {`ستظهر لك الدورة النهائية للرسم الرقمي كيفية إنشاء فن متقدم يمكن أن يتنافس كعمل احترافي. ستعزز هذه الدورة مهاراتك في عالم الرسم الرقمي - أو استرداد أموالك.

الدورة هي مسارك للحصول على مهارات الرسم والرسم الرقمي كما كنت تعرف دائماً أنه يجب أن تكون لديك! سواء لمشاريعك الخاصة أو للرسم للعملاء.`}
        </span>
      </p>

      <div
        className="mt-[41px] box-border flex h-[50px] w-[201px] items-center justify-center rounded-[23px] border border-[var(--Purple,#FF8CFF)] bg-[var(--Grey,#E9E9E9)] px-4"
      >
        <span
          className="whitespace-nowrap"
          style={{
            color: "var(--Black, #000)",
            fontFamily,
            fontSize: "24px",
            fontStyle: "normal",
            fontWeight: 500,
            fontVariationSettings: '"wght" 500',
            lineHeight: "var(--Line-height-Heading-sm, 19.6px)",
          }}
        >
          <Tr>COMING SOON</Tr>
        </span>
      </div>
    </section>
  );
}
