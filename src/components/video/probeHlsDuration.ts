"use client";

import Hls from "hls.js";

/**
 * Resolve HLS stream duration (seconds) without playing.
 * Uses native HLS where available, otherwise hls.js LEVEL_LOADED totalduration.
 */
export function probeHlsDuration(src: string): Promise<number | null> {
  if (typeof window === "undefined" || !src) return Promise.resolve(null);

  return new Promise((resolve) => {
    let settled = false;
    let hls: Hls | null = null;
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("aria-hidden", "true");
    video.style.cssText =
      "position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;left:-9999px;top:0";
    document.body.appendChild(video);

    const finish = (duration: number | null) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("durationchange", onMeta);
      if (hls) {
        hls.destroy();
        hls = null;
      }
      video.removeAttribute("src");
      try {
        video.load();
      } catch {
        // ignore
      }
      video.remove();
      resolve(
        typeof duration === "number" && Number.isFinite(duration) && duration > 0
          ? duration
          : null
      );
    };

    const onMeta = () => {
      const d = video.duration;
      if (Number.isFinite(d) && d > 0) finish(d);
    };

    const timeoutId = window.setTimeout(() => finish(null), 12000);

    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("durationchange", onMeta);

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      return;
    }

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        maxBufferLength: 1,
        maxMaxBufferLength: 1,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.LEVEL_LOADED, (_event, data) => {
        const total = data.details?.totalduration;
        if (typeof total === "number" && total > 0) finish(total);
      });
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) finish(null);
      });
      return;
    }

    finish(null);
  });
}
