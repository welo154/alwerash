export default function LearnCourseLoading() {
  return (
    <div className="min-h-screen bg-slate-50 animate-pulse">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <div className="h-4 w-64 rounded bg-slate-200" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="h-9 w-56 rounded bg-slate-200" />
        <div className="mt-2 h-4 w-32 rounded bg-slate-100" />
        <div className="mt-6 space-y-6">
          <div>
            <div className="h-6 w-48 rounded bg-slate-200" />
            <ul className="mt-3 space-y-2">
              {[1, 2, 3].map((i) => (
                <li key={i} className="h-14 rounded-lg bg-slate-100" />
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 h-10 w-32 rounded bg-slate-200" />
      </div>
    </div>
  );
}
