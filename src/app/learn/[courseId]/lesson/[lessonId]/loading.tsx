export default function LearnLessonLoading() {
  return (
    <div className="min-h-screen bg-slate-50 animate-pulse">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6">
          <div className="h-4 w-80 rounded bg-slate-200" />
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <div className="h-9 w-72 rounded bg-slate-200" />
        <div className="mt-6 aspect-video rounded-lg bg-slate-200" />
        <div className="mt-8 h-10 w-36 rounded bg-slate-200" />
      </div>
    </div>
  );
}
