"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Site-wide motion, driven by data attributes so pages stay server components:
 *
 *   <section data-reveal>…</section>              fades and rises into view once
 *   <div data-reveal-stagger>{cards}</div>        children reveal one after another
 *   className="motion-lift"                       card lifts on hover (CSS only)
 *
 * Plus a short fade of <main> on client-side navigation.
 *
 * The hidden starting state only applies while <html data-motion="on">, which
 * an inline script in the root layout sets before first paint, and only when the
 * visitor has not asked for reduced motion. If this component never boots, that
 * script removes the attribute after a few seconds, so content can never stay
 * hidden. Animates opacity and transform only, and clears both afterwards so
 * revealed sections create no containing block for fixed-position children.
 */

const REVEAL_SELECTOR = "[data-reveal], [data-reveal-stagger]";
const STAGGER_STEP_MS = 70;
const MAX_STAGGER_STEPS = 8;
const REVEAL_DURATION_MS = 700;

declare global {
  interface Window {
    __alwerashMotion?: boolean;
  }
}

function motionEnabled(): boolean {
  return document.documentElement.dataset.motion === "on";
}

function markRevealed(el: HTMLElement) {
  if (el.hasAttribute("data-revealed")) return;
  let steps = 0;
  if (el.hasAttribute("data-reveal-stagger")) {
    Array.from(el.children).forEach((child, index) => {
      const step = Math.min(index, MAX_STAGGER_STEPS);
      steps = Math.max(steps, step);
      (child as HTMLElement).style.setProperty("--reveal-i", String(step));
    });
  }
  el.setAttribute("data-revealed", "");
  // Drop the reveal transition once it has played, so the element's own hover
  // transitions apply again without the stagger delay.
  window.setTimeout(
    () => el.setAttribute("data-reveal-done", ""),
    REVEAL_DURATION_MS + steps * STAGGER_STEP_MS + 100
  );
}

export function MotionProvider() {
  const pathname = usePathname();
  const firstPath = useRef(true);

  // Scroll reveals, including content added after navigation or by client code.
  useEffect(() => {
    window.__alwerashMotion = true;
    if (!motionEnabled() || typeof IntersectionObserver === "undefined") {
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach(markRevealed);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          markRevealed(entry.target as HTMLElement);
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    const observe = (root: ParentNode) => {
      if (root instanceof HTMLElement && root.matches(REVEAL_SELECTOR) && !root.hasAttribute("data-revealed")) {
        io.observe(root);
      }
      root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((el) => {
        if (!el.hasAttribute("data-revealed")) io.observe(el);
      });
    };

    observe(document);
    const mo = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) observe(node);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  // Gentle fade of the page content on client-side navigation (not first load).
  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    if (!motionEnabled() || pathname?.startsWith("/admin")) return;
    const main = document.querySelector("main");
    main?.animate?.([{ opacity: 0 }, { opacity: 1 }], {
      duration: 320,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    });
  }, [pathname]);

  return null;
}
