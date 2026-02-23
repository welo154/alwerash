export default function CourseLoading() {
  return (
    <div className="p-6 flex items-center gap-2 text-zinc-500">
      <span className="inline-block w-4 h-4 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
      Loading course…
    </div>
  );
}
