export default function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex items-center gap-2 text-zinc-500">
        <span className="inline-block h-4 w-4 rounded-full border-2 border-zinc-300 border-t-zinc-600 animate-spin" />
        Loading…
      </div>
    </div>
  );
}
