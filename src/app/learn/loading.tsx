export default function LearnLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 animate-pulse">
      <div className="h-9 w-48 rounded bg-slate-200" />
      <div className="mt-2 h-5 w-72 rounded bg-slate-100" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="aspect-video bg-slate-200" />
            <div className="p-4 space-y-2">
              <div className="h-3 w-20 rounded bg-slate-200" />
              <div className="h-5 w-3/4 rounded bg-slate-200" />
              <div className="h-4 w-full rounded bg-slate-100" />
              <div className="h-4 w-1/2 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
