"use client";

import { useState, useTransition } from "react";

type ArticleEditorProps = {
  lessonId: string;
  lessonTitle: string;
  initialBody: string;
  saveArticle: (formData: FormData) => Promise<void>;
};

export function ArticleEditor({
  lessonId,
  lessonTitle,
  initialBody,
  saveArticle,
}: ArticleEditorProps) {
  const [body, setBody] = useState(initialBody);
  const [savedBody, setSavedBody] = useState(initialBody);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isDirty = body !== savedBody;
  const hasContent = savedBody.trim().length > 0;

  function handleSave() {
    setMessage(null);
    const formData = new FormData();
    formData.set("lessonId", lessonId);
    formData.set("body", body);
    startTransition(async () => {
      try {
        await saveArticle(formData);
        setSavedBody(body);
        setMessage("Article saved.");
      } catch (e) {
        setMessage(e instanceof Error ? e.message : "Failed to save article.");
      }
    });
  }

  return (
    <div className="mt-4 border-t border-slate-100 pt-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-medium text-slate-800">Article content</h4>
          <p className="text-xs text-slate-500">
            Text shown to learners when they open “{lessonTitle}”.
          </p>
        </div>
        {hasContent ? (
          <span className="text-xs font-medium text-emerald-600">Article ready</span>
        ) : (
          <span className="text-xs font-medium text-amber-600">No content yet</span>
        )}
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={12}
        placeholder="Write the lesson article here. Use blank lines between paragraphs."
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm leading-relaxed text-slate-800 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending || !isDirty}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save article"}
        </button>
        {message ? <span className="text-sm text-slate-600">{message}</span> : null}
      </div>
    </div>
  );
}
