export function StatsSection() {
  const stats = [
    { label: "Active learners", value: "10K+" },
    { label: "Courses", value: "50+" },
    { label: "Tracks", value: "8" },
    { label: "Completion rate", value: "92%" },
  ];

  return (
    <section className="border-b border-slate-200 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 sm:justify-between">
          {stats.map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-blue-600 sm:text-3xl">
                {value}
              </div>
              <div className="mt-1 text-sm text-slate-600">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
