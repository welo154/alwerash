"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export type HlsPlayerProps = {
  src: string;
  poster?: string;
  className?: string;
  showQualitySelector?: boolean;
  /** Resume playback at this position (seconds). */
  initialTime?: number;
  /** Called on timeupdate (e.g. for progress tracking). Debounce in the consumer. */
  onProgress?: (currentTime: number, duration: number) => void;
};

type LevelInfo = { height: number; width: number; index: number };

function parseLevels(arr: Array<{ height?: number; width?: number }>): LevelInfo[] {
  const levels = (arr ?? []).map((level, index) => ({
    height: level.height ?? 0,
    width: level.width ?? 0,
    index,
  }));
  return levels.sort((a, b) => b.height - a.height);
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export function HlsPlayer({
  src,
  poster,
  className = "w-full rounded-2xl bg-black",
  showQualitySelector = true,
  initialTime,
  onProgress,
}: HlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [levels, setLevels] = useState<LevelInfo[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(-1);
  const [useHlsJs, setUseHlsJs] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<"speed" | "quality" | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      return;
    }

    if (Hls.isSupported()) {
      setUseHlsJs(true);
      const hls = new Hls({ enableWorker: true });
      hlsRef.current = hls;

      const updateLevels = (fromData?: Array<{ height?: number; width?: number }>) => {
        const next = fromData ? parseLevels(fromData) : parseLevels((hls as unknown as { levels?: Array<{ height?: number; width?: number }> }).levels ?? []);
        if (next.length > 0) {
          setLevels(next);
          setCurrentLevel(hls.currentLevel);
        }
      };

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_e, data: { levels?: Array<{ height?: number; width?: number }> }) => {
        updateLevels(data.levels);
        if (!data.levels?.length) requestAnimationFrame(() => updateLevels());
      });
      hls.on(Hls.Events.LEVEL_LOADED, () => updateLevels());
      hls.on(Hls.Events.LEVEL_SWITCHED, (_e, data) => setCurrentLevel(data.level));

      return () => {
        hls.destroy();
        hlsRef.current = null;
      };
    }
  }, [src]);

  // Seek to initialTime when metadata is ready (resume playback)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || initialTime == null || initialTime <= 0) return;

    const seekToInitial = () => {
      if (Number.isFinite(initialTime) && initialTime > 0) {
        video.currentTime = initialTime;
        setCurrentTime(initialTime);
      }
    };

    if (video.readyState >= 1) {
      seekToInitial();
    } else {
      video.addEventListener("loadedmetadata", seekToInitial, { once: true });
      return () => video.removeEventListener("loadedmetadata", seekToInitial);
    }
  }, [src, initialTime]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = playbackRate;
  }, [playbackRate]);

  const handlePlaybackRateChange = useCallback((rate: number) => {
    setPlaybackRate(rate);
    const v = videoRef.current;
    if (v) v.playbackRate = rate;
  }, []);

  const handleQualityChange = useCallback((levelIndex: number) => {
    const hls = hlsRef.current;
    if (!hls) return;
    const level = Number(levelIndex);
    hls.currentLevel = level;
    hls.nextLevel = level;
    setCurrentLevel(level);
  }, []);

  // Sync video state (time, duration, play, volume) and optional onProgress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      const t = video.currentTime;
      const d = video.duration;
      setCurrentTime(t);
      if (typeof onProgress === "function" && Number.isFinite(t) && Number.isFinite(d)) {
        onProgress(t, d);
      }
    };
    const onDurationChange = () => setDuration(video.duration);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onVolumeChange = () => setVolume(video.volume);

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("durationchange", onDurationChange);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("volumechange", onVolumeChange);
    setDuration(video.duration);
    setCurrentTime(video.currentTime);
    setVolume(video.volume);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("durationchange", onDurationChange);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("volumechange", onVolumeChange);
    };
  }, [src, onProgress]);

  // Click outside to close settings menu
  useEffect(() => {
    if (!showSettingsMenu) return;
    const onDocClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSettingsMenu(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [showSettingsMenu]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play();
    else video.pause();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const t = Number(e.target.value);
    video.currentTime = t;
    setCurrentTime(t);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const v = Number(e.target.value);
    video.volume = v;
    setVolume(v);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className={`aspect-video overflow-hidden rounded-lg bg-black ${className}`}>
        <video
          ref={videoRef}
          className="h-full w-full object-contain"
          playsInline
          poster={poster}
          preload="metadata"
          onClick={togglePlay}
        />

        {/* Custom control bar at bottom of video frame */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-col bg-linear-to-t from-black/80 to-transparent pt-8 pb-1 px-2">
          {/* Progress bar */}
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/30 accent-white"
          />
          <div className="flex items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                className="rounded p-1 text-white hover:bg-white/20"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <span className="text-xs text-white/90 tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={handleVolumeChange}
                className="h-1 w-16 cursor-pointer appearance-none rounded-full bg-white/30 accent-white"
                aria-label="Volume"
              />
            </div>
            <div className="flex items-center gap-0">
              {/* Three-dots menu: Speed & Quality */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowSettingsMenu((v) => !v);
                    if (!showSettingsMenu) setOpenAccordion(null);
                  }}
                  className="rounded p-2 text-white hover:bg-white/20"
                  aria-label="Settings"
                  aria-expanded={showSettingsMenu}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </button>
                {showSettingsMenu && (
                  <div
                    className="absolute bottom-full right-0 mb-1 w-56 rounded-lg border border-slate-200 bg-white shadow-xl z-50 overflow-hidden"
                    role="menu"
                  >
                    {/* Accordion: Playback speed */}
                    <div className="border-b border-slate-100">
                      <button
                        type="button"
                        onClick={() => setOpenAccordion((v) => (v === "speed" ? null : "speed"))}
                        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-800 hover:bg-slate-50"
                        aria-expanded={openAccordion === "speed"}
                      >
                        Playback speed
                        <span className={`shrink-0 text-slate-400 transition-transform ${openAccordion === "speed" ? "rotate-180" : ""}`}>
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </button>
                      <div
                        className={`grid transition-[grid-template-rows] duration-200 ease-out ${openAccordion === "speed" ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                      >
                        <div className="min-h-0 overflow-hidden">
                          <div className="pb-2">
                            {PLAYBACK_RATES.map((rate) => (
                              <button
                                key={rate}
                                type="button"
                                role="menuitem"
                                onClick={() => handlePlaybackRateChange(rate)}
                                className={`flex w-full px-4 py-2 text-left text-sm ${playbackRate === rate ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-700 hover:bg-slate-50"}`}
                              >
                                {rate === 1 ? "1× Normal" : `${rate}×`}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Accordion: Quality */}
                    {showQualitySelector && (
                      <div>
                        <button
                          type="button"
                          onClick={() => setOpenAccordion((v) => (v === "quality" ? null : "quality"))}
                          className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-800 hover:bg-slate-50"
                          aria-expanded={openAccordion === "quality"}
                        >
                          Quality
                          <span className={`shrink-0 text-slate-400 transition-transform ${openAccordion === "quality" ? "rotate-180" : ""}`}>
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </span>
                        </button>
                        <div
                          className={`grid transition-[grid-template-rows] duration-200 ease-out ${openAccordion === "quality" ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                        >
                          <div className="min-h-0 overflow-hidden">
                            <div className="pb-2">
                              {useHlsJs ? (
                                <>
                                  <button
                                    type="button"
                                    role="menuitem"
                                    onClick={() => handleQualityChange(-1)}
                                    className={`flex w-full px-4 py-2 text-left text-sm ${currentLevel === -1 ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-700 hover:bg-slate-50"}`}
                                  >
                                    Auto (recommended)
                                  </button>
                                  {levels.map(({ height, width, index }) => (
                                    <button
                                      key={index}
                                      type="button"
                                      role="menuitem"
                                      onClick={() => handleQualityChange(index)}
                                      className={`flex w-full px-4 py-2 text-left text-sm ${currentLevel === index ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-700 hover:bg-slate-50"}`}
                                    >
                                      {height > 0 ? `${height}p` : width > 0 ? `${width}×?` : `Level ${index + 1}`}
                                    </button>
                                  ))}
                                  {levels.length === 0 && (
                                    <div className="px-4 py-2 text-sm text-slate-500">Loading…</div>
                                  )}
                                </>
                              ) : (
                                <div className="px-4 py-2 text-sm text-slate-500">Auto (browser)</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={toggleFullscreen}
                className="rounded p-2 text-white hover:bg-white/20"
                aria-label="Full screen"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Fallback: show quality/speed bars below video when controls are not hovered (optional) - removed so all control is from three-dots */}
    </div>
  );
}
