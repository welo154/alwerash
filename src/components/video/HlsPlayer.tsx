"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export type HlsPlayerProps = {
  src: string;
  poster?: string;
  className?: string;
  showQualitySelector?: boolean;
};

type LevelInfo = { height: number; width: number; index: number };

function parseLevels(arr: Array<{ height?: number; width?: number }>): LevelInfo[] {
  return (arr ?? []).map((level, index) => ({
    height: level.height ?? 0,
    width: level.width ?? 0,
    index,
  }));
}

export function HlsPlayer({
  src,
  poster,
  className = "w-full rounded-2xl bg-black",
  showQualitySelector = true,
}: HlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [levels, setLevels] = useState<LevelInfo[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(-1);
  const [useHlsJs, setUseHlsJs] = useState(false);

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
        if (!data.levels?.length) {
          requestAnimationFrame(() => updateLevels());
        }
      });
      hls.on(Hls.Events.LEVEL_LOADED, () => {
        updateLevels();
      });
      hls.on(Hls.Events.LEVEL_SWITCHED, (_e, data) => {
        setCurrentLevel(data.level);
      });

      return () => {
        hls.destroy();
        hlsRef.current = null;
      };
    }
  }, [src]);

  const handleQualityChange = (levelIndex: number) => {
    const hls = hlsRef.current;
    if (!hls) return;
    hls.currentLevel = levelIndex;
    setCurrentLevel(levelIndex);
  };

  return (
    <div className="relative w-full">
      {/* Only the video has aspect ratio; quality bar stays outside so it's never clipped */}
      <div className="aspect-video overflow-hidden rounded-lg bg-black">
        <video
          ref={videoRef}
          controls
          className={`h-full w-full object-contain ${className}`}
          playsInline
          poster={poster}
          preload="metadata"
        />
      </div>
      {/* Quality bar: always show when requested (Chrome/Firefox = dropdown; Safari = "Auto (browser)") */}
      {showQualitySelector && (
        <div className="mt-2 flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2" data-quality-bar>
          <label htmlFor="hls-quality-select" className="text-sm font-medium text-slate-700">
            Quality:
          </label>
          {useHlsJs ? (
            <>
              <select
                id="hls-quality-select"
                className="min-w-[100px] rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={currentLevel}
                onChange={(e) => handleQualityChange(Number(e.target.value))}
                aria-label="Video quality"
              >
                <option value={-1}>Auto</option>
                {levels.map(({ height, width, index }) => (
                  <option key={index} value={index}>
                    {height > 0 ? `${height}p` : width > 0 ? `${width}×?` : `Level ${index + 1}`}
                  </option>
                ))}
              </select>
              {levels.length === 0 && (
                <span className="text-xs text-slate-500">(loading…)</span>
              )}
            </>
          ) : (
            <span className="text-sm text-slate-600">Auto (browser)</span>
          )}
        </div>
      )}
    </div>
  );
}
