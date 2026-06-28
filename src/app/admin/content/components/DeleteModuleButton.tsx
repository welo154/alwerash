"use client";

import { useTransition } from "react";

type Props = {
  moduleId: string;
  moduleTitle: string;
  deleteModule: (formData: FormData) => Promise<void>;
};

export function DeleteModuleButton({
  moduleId,
  moduleTitle,
  deleteModule,
}: Props) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (
      !confirm(
        `Delete module "${moduleTitle}" and all lessons inside it? This cannot be undone.`
      )
    ) {
      return;
    }
    const formData = new FormData();
    formData.set("moduleId", moduleId);
    startTransition(() => deleteModule(formData));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
    >
      {isPending ? "Deleting…" : "Delete"}
    </button>
  );
}
