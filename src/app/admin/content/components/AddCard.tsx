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
      className="flex h-[340px] max-w-[300px] w-full flex-col items-center justify-center gap-3 rounded-[24px] border-2 border-dashed border-gray-300 bg-gray-200/60 text-slate-500 transition-transform duration-200 hover:-translate-y-1 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)]/50 hover:shadow-lg hover:text-black focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-300/80">
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </span>
      <span className="text-base font-medium">{label}</span>
    </button>
  );
}
