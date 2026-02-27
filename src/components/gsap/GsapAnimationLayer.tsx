"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const REDUCED_MOTION_MEDIA = "(prefers-reduced-motion: reduce)";

/**
 * GSAP animation layer. Targets existing DOM via data attributes only.
 * Animates only transform and opacity — no layout, no structure change.
 * Uses gsap.context for cleanup; useLayoutEffect to avoid flash.
 */
export function GsapAnimationLayer() {
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia(REDUCED_MOTION_MEDIA).matches) return;

    const ctxRef = gsap.context((self) => {
      const easeStrong = "power3.out";

      // —— Hero: authority entrance + sequenced text/CTA (transform + opacity only) ——
      const hero = document.querySelector("[data-gsap-hero]");
      if (hero) {
        gsap.from(hero, {
          opacity: 0,
          y: 72,
          scale: 0.96,
          duration: 1,
          ease: easeStrong,
          overwrite: "auto",
        });
        const h1 = hero.querySelector("h1");
        const sub = hero.querySelector("p");
        const ctaWrap = hero.querySelector("div:last-child");
        if (h1) {
          gsap.from(h1, {
            opacity: 0,
            y: 48,
            duration: 0.75,
            ease: easeStrong,
            delay: 0.2,
            overwrite: "auto",
          });
        }
        if (sub) {
          gsap.from(sub, {
            opacity: 0,
            y: 40,
            duration: 0.65,
            ease: easeStrong,
            delay: 0.5,
            overwrite: "auto",
          });
        }
        if (ctaWrap) {
          gsap.from(ctaWrap, {
            opacity: 0,
            y: 40,
            duration: 0.6,
            ease: easeStrong,
            delay: 0.85,
            overwrite: "auto",
          });
        }
      }

      // —— Section reveal: deeper entrance (transform + opacity) ——
      const revealSections = document.querySelectorAll("[data-gsap-reveal]");
      revealSections.forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 64,
          scale: 0.97,
          duration: 0.8,
          ease: easeStrong,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            end: "bottom 12%",
            toggleActions: "play none none none",
          },
          overwrite: "auto",
        });
      });

      // —— Staggered groups: larger travel, clear sequencing ——
      const staggerGroups = document.querySelectorAll("[data-gsap-stagger-group]");
      staggerGroups.forEach((group) => {
        const children = group.children;
        if (children.length === 0) return;
        gsap.from(children, {
          opacity: 0,
          y: 56,
          scale: 0.97,
          duration: 0.65,
          stagger: 0.12,
          ease: easeStrong,
          scrollTrigger: {
            trigger: group,
            start: "top 82%",
            toggleActions: "play none none none",
          },
          overwrite: "auto",
        });
      });

      // —— Hover: felt lift and scale (transform only) ——
      const hoverTargets = document.querySelectorAll("[data-gsap-hover]");
      hoverTargets.forEach((el) => {
        const elAsEl = el as HTMLElement;
        const onEnter = () => {
          gsap.to(elAsEl, {
            y: -8,
            scale: 1,
            duration: 0.3,
            ease: easeStrong,
            overwrite: "auto",
          });
        };
        const onLeave = () => {
          gsap.to(elAsEl, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: easeStrong,
            overwrite: "auto",
          });
        };
        elAsEl.addEventListener("mouseenter", onEnter);
        elAsEl.addEventListener("mouseleave", onLeave);
        self.add(() => {
          elAsEl.removeEventListener("mouseenter", onEnter);
          elAsEl.removeEventListener("mouseleave", onLeave);
        });
      });

      // —— Buttons: subtle scale on hover/active (transform only) ——
      const btns = document.querySelectorAll("[data-gsap-btn]");
      btns.forEach((el) => {
        const elAsEl = el as HTMLElement;
        const onEnter = () => {
          gsap.to(elAsEl, {
            scale: 1.03,
            duration: 0.2,
            ease: easeStrong,
            overwrite: "auto",
          });
        };
        const onLeave = () => {
          gsap.to(elAsEl, {
            scale: 1,
            duration: 0.25,
            ease: easeStrong,
            overwrite: "auto",
          });
        };
        const onDown = () => {
          gsap.to(elAsEl, {
            scale: 0.98,
            duration: 0.1,
            ease: easeStrong,
            overwrite: "auto",
          });
        };
        const onUp = () => {
          gsap.to(elAsEl, {
            scale: 1.03,
            duration: 0.15,
            ease: easeStrong,
            overwrite: "auto",
          });
        };
        elAsEl.addEventListener("mouseenter", onEnter);
        elAsEl.addEventListener("mouseleave", onLeave);
        elAsEl.addEventListener("mousedown", onDown);
        elAsEl.addEventListener("mouseup", onUp);
        self.add(() => {
          elAsEl.removeEventListener("mouseenter", onEnter);
          elAsEl.removeEventListener("mouseleave", onLeave);
          elAsEl.removeEventListener("mousedown", onDown);
          elAsEl.removeEventListener("mouseup", onUp);
        });
      });
    });

    return () => ctxRef.revert();
  }, []);

  return null;
}
