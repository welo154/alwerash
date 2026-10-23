import { pangeaFontFamily } from "@/lib/fonts/pangea";

/** Shown on the public course page when the admin marked the class as Coming soon. */
export function CourseComingSoonPanel({ courseTitle }: { courseTitle: string }) {
  return (
    <section
      className="mt-[24px] max-lg:order-2 rounded-[16px] border border-black/20 bg-[#FFF7E8] px-6 py-8 max-lg:mr-[30px]"
      aria-live="polite"
    >
      <p
        className="m-0 inline-flex rounded-full bg-amber-100 px-3 py-1 text-[14px] font-medium text-amber-900"
        style={{ fontFamily: pangeaFontFamily }}
      >
        Coming soon
      </p>
      <h2
        className="m-0 mt-4 text-[28px] font-medium text-black max-lg:text-[22px]"
        style={{ fontFamily: pangeaFontFamily, lineHeight: "120%" }}
      >
        We&apos;re still preparing this class
      </h2>
      <p
        className="m-0 mt-3 max-w-[520px] text-[18px] text-black/70 max-lg:text-[16px]"
        style={{ fontFamily: pangeaFontFamily, lineHeight: "140%" }}
      >
        {courseTitle} is in production for the soft launch. Lessons and enrollment stay closed until
        we finish shooting and publish it.
      </p>
    </section>
  );
}
