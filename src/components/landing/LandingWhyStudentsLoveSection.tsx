import Image from "next/image";
import Link from "next/link";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

/** Green panel silhouette — 1360×1092, corner radius 55 (matches `rounded-[55px]`). */
const PANEL_PATH =
  "M55 1092C24.6244 1092 -1.66197e-06 1067.38 9.93555e-07 1037L8.68427e-05 54.9999C8.94982e-05 24.6243 24.6245 -0.000116742 55.0001 -0.000114087L1305 -4.80825e-06C1335.38 -2.15273e-06 1360 24.6244 1360 55L1360 1037C1360 1067.38 1335.38 1092 1305 1092L55 1092Z";

const portrait = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=140&h=140&q=80`;

/** 70×70 circle: 1px black stroke, photo fill (Next `Image` — reliable vs SVG `<image href>`). */
function StudentAvatarPhoto({ photoSrc, name }: { photoSrc: string; name: string }) {
  return (
    <div className="relative h-[70px] w-[70px] shrink-0 overflow-hidden rounded-full border border-[var(--Black,#000)] bg-[var(--White,#FFF)]">
      <Image
        src={photoSrc}
        alt={`Portrait of ${name}`}
        fill
        className="object-cover"
        sizes="70px"
      />
    </div>
  );
}

function ViewAllCommentsArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={35}
      height={36}
      viewBox="0 0 37 38"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M18.5 26.2L25.5 19M25.5 19L18.5 11.8M25.5 19L11.5 19M36 19C36 28.9411 28.165 37 18.5 37C8.83502 37 1 28.9411 1 19C1 9.05887 8.83502 1 18.5 1C28.165 1 36 9.05887 36 19Z"
        stroke="#FFF"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const TESTIMONIALS = [
  {
    quote:
      "This class showed me I already have a style—I just needed to trust the process. Ali’s exercises are clear and practical. Thank you for sharing.\u201D",
    name: "MOHAMED SABRY",
    tag: "3D Animation",
    photoSrc: portrait("photo-1506794778202-cad84cf45f1d"),
  },
  {
    quote:
      "Clear structure, great exercises, and a supportive community. I finally built a portfolio piece I am proud to show.",
    name: "SARA EL-MASRY",
    tag: "Illustration",
    photoSrc: portrait("photo-1519345182560-a897359ad994"),
  },
  {
    quote:
      "From fundamentals to polished layouts — every lesson felt intentional. Worth every hour I put in after work.",
    name: "KARIM HASSAN",
    tag: "Graphic Design",
    photoSrc: portrait("photo-1560250097-0b93528c311a"),
  },
  {
    quote:
      "I learned to see light and composition differently. Assignments were challenging in the best way.",
    name: "LAYLA OSMAN",
    tag: "Photography",
    photoSrc: portrait("photo-1599566150163-94334dc67655"),
  },
  {
    quote:
      "I had never coded before. The course met me where I was and now I am shipping small interactive projects.",
    name: "YOUSSEF ADEL",
    tag: "Creative Coding",
    photoSrc: portrait("photo-1633332755192-727a05c4013d"),
  },
  {
    quote:
      "Professional pacing and real industry tips. I recommend ELWERASH to anyone serious about levelling up.",
    name: "NOUR HANY",
    tag: "UI/UX Design",
    photoSrc: portrait("photo-1521572267630-61e19aafbd1a"),
  },
];

/**
 * “Why students love ELWERASH” — dark green rounded panel with testimonial grid.
 * Placed after the mentors strip on the public landing.
 */
export function LandingWhyStudentsLoveSection() {
  return (
    <section
      className="mb-0 w-full overflow-x-hidden px-10"
      data-gsap-reveal
      aria-labelledby="landing-why-students-love-heading"
    >
      <div className="mx-auto w-full max-w-[1360px]">
        <div className="relative w-full overflow-hidden rounded-[55px] bg-[var(--Dark-Green,#004B3C)] lg:min-h-[1092px] lg:bg-transparent">
          <svg
            className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
            viewBox="0 0 1360 1092"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path d={PANEL_PATH} fill="var(--Dark-Green, #004B3C)" />
          </svg>

          <div className="relative z-10 flex flex-col pt-[59px] pl-[76px] pr-[56px] pb-[95px] text-white">
            <header className="flex flex-row flex-wrap items-end justify-between gap-x-6 gap-y-3">
              <h2
                id="landing-why-students-love-heading"
                className="min-w-0 max-w-[612px] flex-1 text-[48px] leading-[120%] text-white"
                style={{ fontFamily: pangeaFont }}
              >
                <span
                  className="uppercase"
                  style={{
                    color: "#FFF",
                    fontFamily: pangeaFont,
                    fontSize: "48px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "120%",
                  }}
                >
                  WHY STUDENTS LOVE{" "}
                </span>
                <span
                  style={{
                    color: "#FFF",
                    fontFamily: pangeaFont,
                    fontSize: "48px",
                    fontStyle: "italic",
                    fontWeight: 300,
                    lineHeight: "120%",
                  }}
                >
                  EL
                </span>
                <span
                  style={{
                    color: "#FFF",
                    fontFamily: pangeaFont,
                    fontSize: "48px",
                    fontStyle: "italic",
                    fontWeight: 700,
                    lineHeight: "120%",
                  }}
                >
                  WERASH
                </span>
              </h2>

              <div className="shrink-0">
                <Link
                  href="/course"
                  className="group inline-flex items-end gap-[18px] text-white no-underline transition-opacity hover:opacity-90"
                  style={{
                    color: "#FFF",
                    fontFamily: pangeaFont,
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "120%",
                  }}
                >
                  <span>VIEW ALL COMMENTS</span>
                  <ViewAllCommentsArrowIcon className="shrink-0 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </header>

            <div className="mt-[36px] grid grid-cols-1 justify-items-center gap-x-[44px] gap-y-[36px] sm:grid-cols-2 sm:justify-items-stretch xl:grid-cols-3 xl:justify-items-start">
              {TESTIMONIALS.map((t) => {
                return (
                <article
                  key={t.name}
                  className="box-border flex h-[375px] w-full max-w-[384px] flex-col overflow-hidden rounded-[36px] border border-[var(--Black,#000)] bg-[var(--White,#FFF)] pb-[40px] xl:w-[384px] xl:max-w-none"
                  style={{ fontFamily: pangeaFont }}
                >
                  <div className="flex min-h-0 flex-1 flex-col pl-[45px] pr-6 pt-[30px]">
                    <span
                      className=" block shrink-0 text-[48px] font-normal  not-italic leading-none text-black"
                      style={{ fontFamily: pangeaFont, color: "#000" }}
                      aria-hidden
                    >
                      {'"'}
                    </span>
                    <p
                      className="mb-[10px] min-h-0 w-[260px] max-w-full flex-1  text-left"
                      style={{
                        color: "var(--Black, #000)",
                        fontFamily: pangeaFont,
                        fontSize: "18px",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "normal",
                      }}
                    >
                      {t.quote}
                    </p>
                  </div>
                  <footer className="mt-auto flex shrink-0 items-center gap-3 px-6 pt-4 pl-[45px]">
                    <StudentAvatarPhoto photoSrc={t.photoSrc} name={t.name} />
                    <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
                      <p
                        className="m-0 truncate"
                        style={{
                          color: "var(--Black, #000)",
                          fontFamily: pangeaFont,
                          fontSize: "20px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "normal",
                        }}
                      >
                        {t.name}
                      </p>
                      <span
                        className="inline-flex h-[31px] w-fit shrink-0 items-center self-start rounded-[8px] border border-[var(--Black,#000)] bg-[var(--Blue,#64E1FF)] px-4"
                        style={{
                          color: "var(--Text-Primary, #141413)",
                          fontFamily: pangeaFont,
                          fontSize: "18px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "var(--Line-height-Heading-sm, 19.6px)",
                        }}
                      >
                        {t.tag}
                      </span>
                    </div>
                  </footer>
                </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
