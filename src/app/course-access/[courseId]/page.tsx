import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { privateCoursePath } from "@/lib/course-access";
import { getCourseForLearning } from "@/server/content/learn.service";
import { AppError } from "@/server/lib/errors";
import { requireSubscription } from "@/server/subscription/require-subscription";
import { getCourseProgress } from "@/server/learning/progress.service";
import { prisma } from "@/server/db/prisma";
import {
  FullCourseLearningExperience,
  type FullAccessLesson,
  type FullAccessModule,
} from "./FullCourseLearningExperience";

const pangeaVar = localFont({
  src: "../../../../public/fonts/FwTRIAL-PangeaVAR.woff2",
  display: "swap",
  weight: "100 900",
  style: "normal",
});

const SAMPLE_TEXT_BODY = `The Ultimate Digital Painting Course will show you how to create advanced art that will stand up as professional work. This course will enhance or give you skills in the world of Digital Painting - or your money back.

The course is your track to obtaining digital drawing & painting skills like you always knew you should have! Whether for your own projects or to paint for clients.`;

async function loadArticleBodiesByLessonId(
  lessonIds: string[]
): Promise<Map<string, string | null>> {
  if (lessonIds.length === 0) return new Map();
  const articles = await prisma.lessonArticle.findMany({
    where: { lessonId: { in: lessonIds } },
    select: { lessonId: true, body: true },
  });
  return new Map(articles.map((row) => [row.lessonId, row.body?.trim() || null]));
}

/** Ensure first module has an INTRO at the start and an ARTICLE at the end for styling QA. */
function withTestTextLessons(
  modules: FullAccessModule[],
  courseSummary: string | null
): FullAccessModule[] {
  if (modules.length === 0) return modules;
  const first = modules[0]!;
  const hasIntro = first.lessons.some((l) => l.type.toUpperCase() === "INTRO");
  const hasArticle = first.lessons.some((l) => l.type.toUpperCase() === "ARTICLE");
  if (hasIntro && hasArticle) return modules;

  const body = courseSummary?.trim() || SAMPLE_TEXT_BODY;
  const lessons: FullAccessLesson[] = [...first.lessons];

  if (!hasIntro) {
    lessons.unshift({
      id: `demo-intro-${first.id}`,
      title: "Introduction",
      type: "INTRO",
      moduleId: first.id,
      moduleTitle: first.title,
      streamUrl: null,
      posterUrl: null,
      articleBody: body,
      description: null,
    });
  }

  if (!hasArticle) {
    lessons.push({
      id: `demo-article-${first.id}`,
      title: "Course materials",
      type: "ARTICLE",
      moduleId: first.id,
      moduleTitle: first.title,
      streamUrl: null,
      posterUrl: null,
      articleBody: body,
      description: null,
    });
  }

  return [{ ...first, lessons }, ...modules.slice(1)];
}

export default async function PrivateCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const destination = privateCoursePath(courseId);

  const session = await requireSubscription({ next: destination });
  const userId = session.user!.id!;

  let course;
  try {
    course = await getCourseForLearning(courseId);
  } catch (error) {
    if (error instanceof AppError && error.code === "NOT_FOUND") notFound();
    throw error;
  }

  const [articleBodies, courseProgress] = await Promise.all([
    loadArticleBodiesByLessonId(
      course.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id))
    ),
    getCourseProgress(userId, courseId),
  ]);

  const modulesBase: FullAccessModule[] = course.modules.map((module) => ({
    id: module.id,
    title: module.title,
    lessons: module.lessons.map((lesson) => {
      const playbackId = lesson.video?.muxPlaybackId ?? null;
      return {
        id: lesson.id,
        title: lesson.title,
        type: lesson.type,
        moduleId: module.id,
        moduleTitle: module.title,
        streamUrl: playbackId ? `https://stream.mux.com/${playbackId}.m3u8` : null,
        posterUrl: playbackId
          ? `https://image.mux.com/${playbackId}/thumbnail.jpg?width=1280&height=720&fit_mode=smartcrop`
          : null,
        articleBody: articleBodies.get(lesson.id) ?? null,
        description: course.summary?.trim() || null,
      };
    }),
  }));

  const modules = withTestTextLessons(modulesBase, course.summary);

  return (
    <main className="min-h-screen bg-white">
      <FullCourseLearningExperience
        courseId={course.id}
        courseTitle={course.title}
        coverImage={course.coverImage}
        modules={modules}
        fontFamily={pangeaVar.style.fontFamily}
        progressPercent={courseProgress?.progressPercent ?? 0}
        instructorName={course.instructorName}
        instructorProfession={course.instructorProfession}
        completedLessonIds={courseProgress?.completedLessonIds ?? []}
      />
    </main>
  );
}
