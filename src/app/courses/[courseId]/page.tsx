import localFont from "next/font/local";
import { CourseContentAccordion } from "./CourseContentAccordion";
import { RelatedClassesSection } from "./RelatedClassesSection";

const pangeaVar = localFont({
  src: "../../../../public/fonts/FwTRIAL-PangeaVAR.woff2",
  display: "swap",
  weight: "100 900",
  style: "normal",
});

const GROUP_11_IMG = "https://www.figma.com/api/mcp/asset/762b70e8-a0f8-4813-9b3c-0c0eeebfd336";
const GROUP_24_IMG = "https://www.figma.com/api/mcp/asset/bb2e1568-00b6-4764-951f-c2634aac8282";
const GROUP_25_IMG = "https://www.figma.com/api/mcp/asset/e7a13ecd-06ce-4a37-93fd-84591f84b127";

export default async function CoursePage({
  params: _params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  void _params;
  return (
    <main className="mx-auto max-w-[1600px] pb-[80px] pl-[55px] pr-[60px] pt-[20px]">
      <div className="flex items-start gap-[62px]">
        <section className="w-[843px] shrink-0">
          <h1
            className="m-0"
            style={{
              width: "842px",
              color: "var(--Black, #000)",
              fontFamily: pangeaVar.style.fontFamily,
              fontSize: "36px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "normal",
            }}
          >
            ILLUSTRATION 101 - How to Master Digital and Analog Illustration Techniques
          </h1>

          <div
            className="mt-[39px] flex items-center justify-center rounded-[50px] border-2 border-black bg-[#E9E9E9]"
            style={{ width: "843px", height: "557px" }}
            aria-label="Course intro video placeholder"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 122 122" fill="none" aria-hidden>
              <path
                d="M61 121C94.1371 121 121 94.1371 121 61C121 27.8629 94.1371 1 61 1C27.8629 1 1 27.8629 1 61C1 94.1371 27.8629 121 61 121Z"
                stroke="var(--Black, #000)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M49 37L85 61L49 85V37Z"
                stroke="var(--Black, #000)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <CourseContentAccordion fontFamily={pangeaVar.style.fontFamily} />
        </section>

        <div className="w-[413px] shrink-0">
          <aside
            className="overflow-hidden rounded-none border bg-transparent"
            style={{ borderColor: "rgba(0, 0, 0, 0.6)" }}
            aria-label="Course details right section"
          >
            <div className="border-b border-black/60 px-[30px] pb-[27px] pt-[35px]">
              <div className="flex items-center gap-[16px]">
                <div className="relative h-[63px] w-[63px]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="63" height="63" viewBox="0 0 64 64" fill="none" className="h-[63px] w-[63px]" aria-hidden>
                    <path
                      d="M32 63.5C49.397 63.5 63.5 49.397 63.5 32C63.5 14.603 49.397 0.5 32 0.5C14.603 0.5 0.5 14.603 0.5 32C0.5 49.397 14.603 63.5 32 63.5Z"
                      fill="white"
                      stroke="black"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ fontFamily: pangeaVar.style.fontFamily, fontSize: "24px", fontWeight: 600 }}
                  >
                    AK
                  </span>
                </div>
                <div>
                  <p className="m-0" style={{ fontFamily: pangeaVar.style.fontFamily, fontSize: "24px", fontWeight: 600 }}>
                    AHMAD KHALED
                  </p>
                  <p className="m-0 opacity-60" style={{ fontFamily: pangeaVar.style.fontFamily, fontSize: "24px", fontWeight: 400 }}>
                    Illustrator
                  </p>
                </div>
              </div>
            </div>

            <div className="border-b border-black/60 px-[30px] pb-[30px] pt-[20px]">
              <h4 className="m-0" style={{ fontFamily: pangeaVar.style.fontFamily, fontSize: "24px", fontWeight: 500 }}>
                Class details
              </h4>

              <div className="mt-[20px] flex items-center justify-between">
                <span style={{ fontFamily: pangeaVar.style.fontFamily, fontSize: "24px" }}>Level</span>
                <span style={{ fontFamily: pangeaVar.style.fontFamily, fontSize: "24px", fontWeight: 500 }}>Beginner</span>
              </div>
              <div className="mt-[24px] flex items-center justify-between">
                <span style={{ fontFamily: pangeaVar.style.fontFamily, fontSize: "24px" }}>Rating</span>
                <span className="inline-flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="23" viewBox="0 0 29 26" fill="none" aria-hidden>
                    <path
                      d="M8.1048 11.8499L13.3886 1.5C14.4397 1.5 15.4476 1.86348 16.1908 2.51048C16.934 3.15747 17.3515 4.03499 17.3515 4.94998V9.54995H24.8282C25.2111 9.54617 25.5904 9.61493 25.9398 9.75145C26.2893 9.88797 26.6004 10.089 26.8517 10.3406C27.103 10.5922 27.2885 10.8883 27.3952 11.2085C27.502 11.5287 27.5276 11.8653 27.4701 12.1949L25.6472 22.5449C25.5516 23.0933 25.2316 23.5932 24.7461 23.9525C24.2606 24.3117 23.6424 24.5061 23.0052 24.4999H8.1048M8.1048 11.8499V24.4999M8.1048 11.8499H4.14192C3.44124 11.8499 2.76926 12.0923 2.2738 12.5236C1.77834 12.9549 1.5 13.5399 1.5 14.1499V22.1999C1.5 22.8099 1.77834 23.3949 2.2738 23.8262C2.76926 24.2575 3.44124 24.4999 4.14192 24.4999H8.1048"
                      stroke="var(--sds-color-icon-default-default, #1E1E1E)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="ml-[6px]" style={{ fontFamily: pangeaVar.style.fontFamily, fontSize: "24px", fontWeight: 500 }}>
                    98%
                  </span>
                </span>
              </div>
              <div className="mt-[24px] flex items-center justify-between">
                <span style={{ fontFamily: pangeaVar.style.fontFamily, fontSize: "24px" }}>Duration</span>
                <span className="inline-flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 28 28" fill="none" aria-hidden>
                    <path
                      d="M14 6.5V14L19 16.5M26.5 14C26.5 20.9036 20.9036 26.5 14 26.5C7.09644 26.5 1.5 20.9036 1.5 14C1.5 7.09644 7.09644 1.5 14 1.5C20.9036 1.5 26.5 7.09644 26.5 14Z"
                      stroke="var(--sds-color-icon-default-default, #1E1E1E)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="ml-[6px]" style={{ fontFamily: pangeaVar.style.fontFamily, fontSize: "24px", fontWeight: 500 }}>
                    35mins
                  </span>
                </span>
              </div>

              <div className="mt-[30px] flex items-center">
                <div className="relative h-[54.258px] w-[86px]">
                  <img src={GROUP_11_IMG} alt="" className="absolute left-0 top-0 h-[54.258px] w-[54.258px]" />
                  <img src={GROUP_24_IMG} alt="" className="absolute left-[16px] top-0 h-[54.258px] w-[54.258px]" />
                  <img src={GROUP_25_IMG} alt="" className="absolute left-[32px] top-0 h-[54.258px] w-[54.258px]" />
                </div>
                <p className="mb-0 ml-[20px] mt-0" style={{ fontFamily: pangeaVar.style.fontFamily, fontSize: "24px", fontWeight: 400 }}>
                  Join <span style={{ fontStyle: "italic" }}>+24</span> Learners
                </p>
              </div>
            </div>

            <div className="px-[30px] pb-[30px] pt-[20px]">
              <h4 className="m-0" style={{ fontFamily: pangeaVar.style.fontFamily, fontSize: "24px", fontWeight: 500 }}>
                Skills you’ll learn
              </h4>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-[8px] border border-black bg-white px-3 py-1.5 text-[20px] font-semibold">DIGITAL ILLUSTRATION</span>
                <span className="rounded-[8px] border border-black bg-white px-3 py-1.5 text-[20px] font-semibold">ANALOG ILLUSTRATION</span>
                <span className="rounded-[8px] border border-black bg-white px-3 py-1.5 text-[20px] font-semibold">BRUSHES</span>
                <span className="rounded-[8px] border border-black bg-white px-3 py-1.5 text-[20px] font-semibold">PROCREATE</span>
              </div>
              <p
                className="mb-0 mt-[20px]"
                style={{
                  color: "var(--Black, #000)",
                  fontFamily: pangeaVar.style.fontFamily,
                  fontSize: "24px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "normal",
                  opacity: 0.6,
                }}
              >
                Last Updated 3/2026
              </p>
            </div>
          </aside>

          <section className="mt-[30px]">
            <div className="flex items-center gap-[16px]">
              <h3
                className="m-0"
                style={{
                  color: "var(--Black, #000)",
                  fontFamily: pangeaVar.style.fontFamily,
                  fontSize: "24px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "normal",
                  opacity: 0.6,
                }}
              >
                About this class
              </h3>
            </div>
            <p
              className="m-0 mt-[19px] whitespace-pre-line"
              style={{
                color: "var(--Black, #000)",
                fontFamily: pangeaVar.style.fontFamily,
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
              }}
            >
              {`The Ultimate Digital Painting Course will show you how to create advanced art that will stand up as professional work. This course will enhance or give you skills in the world of Digital Painting - or your money back.

The course is your track to obtaining digital drawing & painting skills like you always knew you should have! Whether for your own projects or to paint for clients.

This course will take you from having little knowledge in digital painting and drawing to creating advanced art and having a deep understanding of drawing fundamentals.`}
            </p>
            <h3
              className="m-0 mt-[30px]"
              style={{
                color: "var(--Black, #000)",
                fontFamily: pangeaVar.style.fontFamily,
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
                opacity: 0.6,
              }}
            >
              Requirements
            </h3>
            <ul
              className="m-0 mt-[13px] list-disc pl-[28px]"
              style={{
                color: "var(--Black, #000)",
                fontFamily: pangeaVar.style.fontFamily,
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
              }}
            >
              <li>Drawing Tablet or iPad</li>
              <li>Digital Painting Software</li>
            </ul>
            <div className="mt-[57px] h-px w-[413px] bg-black opacity-60" aria-hidden />

            <h3
              className="m-0 mt-[30px]"
              style={{
                color: "var(--Black, #000)",
                fontFamily: pangeaVar.style.fontFamily,
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
                opacity: 0.6,
              }}
            >
              About your instructor
            </h3>

            <div className="mt-[43px] flex items-start">
              <div className="h-[174px] w-[174px] shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="174" height="174" viewBox="0 0 175 175" fill="none" aria-hidden>
                  <path
                    d="M87.5 174.5C135.549 174.5 174.5 135.549 174.5 87.5C174.5 39.4512 135.549 0.5 87.5 0.5C39.4512 0.5 0.5 39.4512 0.5 87.5C0.5 135.549 39.4512 174.5 87.5 174.5Z"
                    fill="#E9E9E9"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="ml-[30px] min-w-0">
                <p
                  className="m-0"
                  style={{
                    color: "var(--Black, #000)",
                    fontFamily: pangeaVar.style.fontFamily,
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "normal",
                  }}
                >
                  AHMAD KHALED
                </p>
                <p
                  className="m-0 opacity-60"
                  style={{
                    color: "var(--Black, #000)",
                    fontFamily: pangeaVar.style.fontFamily,
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",
                  }}
                >
                  Illustrator
                </p>

                <div className="mt-[16px] flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 23 22" fill="none" aria-hidden>
                    <path
                      d="M11.5 1L14.7445 7.58254L22 8.64458L16.75 13.7655L17.989 21L11.5 17.5825L5.011 21L6.25 13.7655L1 8.64458L8.2555 7.58254L11.5 1Z"
                      stroke="var(--Black, #000)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    className="ml-[18px]"
                    style={{
                      color: "var(--Black, #000)",
                      fontFamily: pangeaVar.style.fontFamily,
                      fontSize: "18px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "normal",
                    }}
                  >
                    4.8 Instructor Rating
                  </span>
                </div>

                <div className="mt-[13px] flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="18" viewBox="0 0 23 20" fill="none" aria-hidden>
                    <path
                      d="M16.2727 19V17C16.2727 15.9391 15.8705 14.9217 15.1544 14.1716C14.4384 13.4214 13.4672 13 12.4545 13H4.81818C3.80554 13 2.83437 13.4214 2.11832 14.1716C1.40227 14.9217 1 15.9391 1 17V19M22 19V17C21.9994 16.1137 21.7178 15.2528 21.1995 14.5523C20.6812 13.8519 19.9555 13.3516 19.1364 13.13M15.3182 1.13C16.1395 1.3503 16.8674 1.8507 17.3873 2.55231C17.9071 3.25392 18.1893 4.11683 18.1893 5.005C18.1893 5.89317 17.9071 6.75608 17.3873 7.45769C16.8674 8.1593 16.1395 8.6597 15.3182 8.88M12.4545 5C12.4545 7.20914 10.7451 9 8.63636 9C6.52764 9 4.81818 7.20914 4.81818 5C4.81818 2.79086 6.52764 1 8.63636 1C10.7451 1 12.4545 2.79086 12.4545 5Z"
                      stroke="var(--Black, #000)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    className="ml-[18px]"
                    style={{
                      color: "var(--Black, #000)",
                      fontFamily: pangeaVar.style.fontFamily,
                      fontSize: "18px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "normal",
                    }}
                  >
                    231 Students
                  </span>
                </div>

                <div className="mt-[13px] flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 23 22" fill="none" aria-hidden>
                    <path
                      d="M11.5 5.44444C11.5 4.2657 11.0575 3.13524 10.2698 2.30175C9.4822 1.46825 8.41391 1 7.3 1H1V17.6667H8.35C9.18543 17.6667 9.98665 18.0179 10.5774 18.643C11.1681 19.2681 11.5 20.1159 11.5 21M11.5 5.44444V21M11.5 5.44444C11.5 4.2657 11.9425 3.13524 12.7302 2.30175C13.5178 1.46825 14.5861 1 15.7 1H22V17.6667H14.65C13.8146 17.6667 13.0134 18.0179 12.4226 18.643C11.8319 19.2681 11.5 20.1159 11.5 21"
                      stroke="var(--Black, #000)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    className="ml-[18px]"
                    style={{
                      color: "var(--Black, #000)",
                      fontFamily: pangeaVar.style.fontFamily,
                      fontSize: "18px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "normal",
                    }}
                  >
                    4 courses
                  </span>
                </div>
              </div>
            </div>

            <p
              className="m-0 mt-[35px]"
              style={{
                color: "var(--Black, #000)",
                fontFamily: pangeaVar.style.fontFamily,
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
              }}
            >
              {`"I'm a working professional creative in the game industry. I work as a concept artist and freelance illustrator. I've worked in-house at an animation studio but currently, work from home. As an instructor, I strive to provide the best learning experience possible for my students by creating clear content and maintaining a personable demeanor."`}
            </p>
          </section>
        </div>
      </div>

      <div className="mt-[66px]">
        <div className="relative h-[833px] w-[1360px] overflow-hidden">
          <svg className="absolute inset-0" xmlns="http://www.w3.org/2000/svg" width="1360" height="833" viewBox="0 0 1360 833" fill="none" aria-hidden>
            <path
              d="M55 833C24.6244 833 2.15273e-06 808.376 4.80825e-06 778L6.80149e-05 54.9999C7.06704e-05 24.6242 24.6245 -0.000116742 55.0001 -0.000114087L1305 -4.80825e-06C1335.38 -2.15273e-06 1360 24.6243 1360 55L1360 778C1360 808.376 1335.38 833 1305 833L55 833Z"
              fill="#004B3C"
            />
          </svg>

          <div className="relative z-10 px-[30px] pt-[56px]">
            <div className="flex items-center justify-between">
              <p
                className="m-0 ml-[19px]"
                style={{
                  color: "var(--White, #FFF)",
                  fontFamily: pangeaVar.style.fontFamily,
                  fontSize: "36px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "normal",
                }}
              >
                STUDENTS <span style={{ fontStyle: "italic", fontWeight: 600 }}>RATING &amp; WORK</span>
              </p>

              <div className="flex items-center">
                <p
                  className="m-0"
                  style={{
                    color: "var(--White, #FFF)",
                    fontFamily: pangeaVar.style.fontFamily,
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "120%",
                  }}
                >
                  VIEW ALL COMMENTS
                </p>
                <svg className="ml-[18px]" xmlns="http://www.w3.org/2000/svg" width="35" height="36" viewBox="0 0 37 38" fill="none" aria-hidden>
                  <path
                    d="M18.5 26.2L25.5 19M25.5 19L18.5 11.8M25.5 19L11.5 19M36 19C36 28.9411 28.165 37 18.5 37C8.83502 37 1 28.9411 1 19C1 9.05887 8.83502 1 18.5 1C28.165 1 36 9.05887 36 19Z"
                    stroke="var(--White, #FFF)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <div className="mt-[49px] grid grid-cols-2 gap-x-[13px] gap-y-[21px]">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={`student-rating-card-${idx}`} className="h-[297.16px] w-[644px] rounded-[36px] border border-black bg-white p-[28px]">
                  <div className="flex h-full items-start justify-between gap-[26px]">
                    <div className="flex flex-1 flex-col justify-center">
                      <p
                        className="m-0"
                        style={{
                          width: "311px",
                          color: "var(--Black, #000)",
                          fontFamily: pangeaVar.style.fontFamily,
                          fontSize: "18px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "normal",
                        }}
                      >
                        This class helped me understand that I already have a style within me... and all I need to do is trust myself and my process.
                        The exercises and the way Ali explains them are awesome. Thank you for sharing.
                      </p>
                      <div className="mt-[18px] flex items-center gap-[10px]">
                        <div className="flex h-[63px] w-[63px] items-center justify-center rounded-full border border-black bg-white">
                          <span
                            style={{
                              color: "var(--Black, #000)",
                              fontFamily: pangeaVar.style.fontFamily,
                              fontSize: "32px",
                              fontStyle: "normal",
                              fontWeight: 600,
                              lineHeight: "normal",
                            }}
                          >
                            MS
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-[8px]">
                            <p
                              className="m-0"
                              style={{
                                color: "var(--Black, #000)",
                                fontFamily: pangeaVar.style.fontFamily,
                                fontSize: "20px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "normal",
                              }}
                            >
                              MOHAMED SABRY
                            </p>
                            <p
                              className="m-0"
                              style={{
                                color: "var(--Black, #000)",
                                fontFamily: pangeaVar.style.fontFamily,
                                fontSize: "18px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "normal",
                              }}
                            >
                              4.5
                            </p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden>
                              <path d="M8.5 0L11.1265 5.59516L17 6.4979L12.75 10.8507L13.753 17L8.5 14.0952L3.247 17L4.25 10.8507L0 6.4979L5.8735 5.59516L8.5 0Z" fill="var(--Black, #000)" />
                            </svg>
                          </div>
                          <p
                            className="m-0"
                            style={{
                              color: "var(--Black, #000)",
                              fontFamily: pangeaVar.style.fontFamily,
                              fontSize: "20px",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "normal",
                              opacity: 0.6,
                            }}
                          >
                            Graphic designer
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="h-[253px] w-[226px] shrink-0 rounded-[36px] border border-black bg-[#E7E7E7]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <RelatedClassesSection fontFamily={pangeaVar.style.fontFamily} />
    </main>
  );
}
