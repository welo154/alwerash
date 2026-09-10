"use client";

import { useEffect, useRef } from "react";

const SCROLL_SPEED = 0.55;

export function AuthGreenPanel({
  className,
  innerClassName,
  style,
  children,
  autoScroll = true,
}: {
  className?: string;
  innerClassName?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  autoScroll?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const offsetRef = useRef(0);
  const directionRef = useRef(1);

  function pause() {
    pausedRef.current = true;
    if (ref.current) offsetRef.current = ref.current.scrollTop;
  }

  function resume() {
    pausedRef.current = false;
    if (ref.current) offsetRef.current = ref.current.scrollTop;
  }

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      pausedRef.current = true;
      const max = el.scrollHeight - el.clientHeight;
      if (max <= 0) return;

      let delta = event.deltaY;
      if (event.deltaMode === 1) delta *= 16;
      if (event.deltaMode === 2) delta *= el.clientHeight;

      event.preventDefault();
      event.stopPropagation();
      el.scrollTop = Math.min(max, Math.max(0, el.scrollTop + delta));
      offsetRef.current = el.scrollTop;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    if (!autoScroll) return;

    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let raf = 0;

    const tick = () => {
      if (pausedRef.current) {
        offsetRef.current = el.scrollTop;
        raf = requestAnimationFrame(tick);
        return;
      }

      const max = el.scrollHeight - el.clientHeight;
      if (max > 1) {
        offsetRef.current += SCROLL_SPEED * directionRef.current;
        if (offsetRef.current >= max) {
          offsetRef.current = max;
          directionRef.current = -1;
        } else if (offsetRef.current <= 0) {
          offsetRef.current = 0;
          directionRef.current = 1;
        }
        el.scrollTop = offsetRef.current;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoScroll]);

  return (
    <div className={className} style={style}>
      <div
        ref={ref}
        className="auth-green-panel-scroll h-full min-h-0 overflow-x-hidden overflow-y-auto overscroll-contain"
        onMouseEnter={pause}
        onMouseLeave={resume}
        onPointerDown={pause}
        onTouchStart={pause}
        onFocusCapture={pause}
      >
        {innerClassName ? <div className={innerClassName}>{children}</div> : children}
      </div>
    </div>
  );
}
