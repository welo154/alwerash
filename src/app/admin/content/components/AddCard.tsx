"use client";

interface AddCardProps {
  label: string;
  onClick: () => void;
}

export function AddCard({ label, onClick }: AddCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="card-hover flex min-h-[140px] w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200/80">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
