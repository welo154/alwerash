"use client";

export function WatermarkOverlay({ text }: { text: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="wm absolute left-6 top-6 rounded bg-black/35 px-3 py-2 text-xs text-white/85 ring-1 ring-white/10">
        {text}
      </div>

      <style jsx>{`
        .wm {
          animation: drift 10s linear infinite;
          white-space: nowrap;
          max-width: 90%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        @keyframes drift {
          0% { transform: translate(0, 0); opacity: 0.7; }
          25% { transform: translate(60vw, 10vh); opacity: 0.55; }
          50% { transform: translate(20vw, 50vh); opacity: 0.7; }
          75% { transform: translate(70vw, 70vh); opacity: 0.55; }
          100% { transform: translate(0, 0); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
