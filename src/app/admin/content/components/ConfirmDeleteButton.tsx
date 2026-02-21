"use client";

import { useFormStatus } from "react-dom";

type Props = {
  label: string;
  confirmMessage: string;
};

export function ConfirmDeleteButton({ label, confirmMessage }: Props) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded border border-red-600 px-4 py-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
      onClick={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      {pending ? "Deleting…" : label}
    </button>
  );
}
