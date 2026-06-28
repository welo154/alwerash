"use client";

import { completeLesson } from "./actions";

type ArticleLessonViewProps = {
  courseId: string;
  lessonId: string;
  body: string;
};

function renderArticleBody(body: string) {
  const paragraphs = body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  if (paragraphs.length === 0) {
    return <p className="text-slate-500">This article has no content yet.</p>;
  }
  return paragraphs.map((paragraph, index) => (
    <p key={index} className="whitespace-pre-wrap text-slate-800 leading-relaxed">
      {paragraph}
    </p>
  ));
}

export function ArticleLessonView({ courseId, lessonId, body }: ArticleLessonViewProps) {
  return (
    <div className="mt-6 opacity-0 animate-fade-in-up animation-delay-150">
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="prose prose-slate max-w-none space-y-4">{renderArticleBody(body)}</div>
      </article>
      <form action={completeLesson.bind(null, lessonId, courseId)} className="mt-6">
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Mark lesson complete
        </button>
      </form>
    </div>
  );
}
