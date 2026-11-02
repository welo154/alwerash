/**
 * Runs before first paint (inline in <head>). Turns motion on unless the
 * visitor prefers reduced motion, and turns it back off if MotionProvider has
 * not booted within 4s, so content is never left hidden.
 */
export const MOTION_BOOT_SCRIPT = `(function(){try{var d=document.documentElement;if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;d.dataset.motion="on";setTimeout(function(){if(!window.__alwerashMotion)delete d.dataset.motion},4000)}catch(e){}})();`;
