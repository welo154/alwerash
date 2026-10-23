"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

const POPUP_CSS = `
@keyframes student-project-backdrop {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes student-project-pop {
  0% { opacity: 0; transform: scale(0.62) translateY(18px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
`;

export function StudentProjectThumb({
  src,
  name,
  className,
}: {
  src?: string | null;
  name: string;
  className: string;
}) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const label = src ? `Open ${name}'s project` : `Open ${name}'s project placeholder`;

  return (
    <>
      <button
        type="button"
        className={`${className} cursor-zoom-in appearance-none p-0 text-left transition-transform duration-200 hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black`}
        aria-label={label}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        {src ? (
          // Storage URLs are not in the image optimizer allow-list.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="h-full w-full object-cover" />
        ) : null}
      </button>
      {open ? (
        <ProjectPopup
          src={src}
          name={name}
          titleId={titleId}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}

function ProjectPopup({
  src,
  name,
  titleId,
  onClose,
}: {
  src?: string | null;
  name: string;
  titleId: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-6"
      style={{ animation: "student-project-backdrop 220ms ease-out both" }}
    >
      <style>{POPUP_CSS}</style>
      <button
        type="button"
        className="absolute inset-0 cursor-default border-0 bg-black/55 backdrop-blur-[6px]"
        aria-label="Close project"
        onClick={onClose}
      />
      <figure
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 m-0 flex max-h-[88vh] w-full max-w-[460px] flex-col"
        style={{
          animation: "student-project-pop 460ms cubic-bezier(0.16, 1.25, 0.3, 1) both",
        }}
      >
        <div className="overflow-hidden rounded-[36px] border border-black bg-[#E7E7E7] shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={`${name}'s submitted project`} className="max-h-[78vh] w-full object-contain" />
          ) : (
            <div className="flex aspect-[203/260] w-full items-center justify-center px-8 text-center text-sm text-black/50">
              No project photo yet
            </div>
          )}
        </div>
        <figcaption id={titleId} className="mt-3 text-center">
          <span className="inline-block rounded-full bg-white px-4 py-1 text-sm font-medium text-black">
            {name}
          </span>
        </figcaption>
        <button
          type="button"
          onClick={onClose}
          className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full border border-black bg-white text-lg leading-none text-black"
          aria-label="Close"
        >
          ×
        </button>
      </figure>
    </div>,
    document.body
  );
}
