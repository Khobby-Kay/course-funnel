"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;

type LessonVideoPlayerProps = {
  src: string;
  title: string;
  poster?: string;
  theme?: "dark" | "light";
};

type VideoWithWebkit = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
  webkitDisplayingFullscreen?: boolean;
};

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function LessonVideoPlayer({
  src,
  title,
  poster,
  theme = "dark",
}: LessonVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDark = theme === "dark";

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setShowControls(false);
    }, 3500);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onLoadedMetadata = () => setDuration(video.duration);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
    };
  }, [src]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
    resetHideTimer();
  };

  const seek = (value: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = value;
    setCurrentTime(value);
    resetHideTimer();
  };

  const skip = (delta: number) => {
    const video = videoRef.current;
    if (!video) return;
    seek(Math.min(Math.max(0, video.currentTime + delta), duration || video.duration));
  };

  const changeVolume = (value: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = value;
    video.muted = value === 0;
    setVolume(value);
    setMuted(value === 0);
    resetHideTimer();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    resetHideTimer();
  };

  const changeSpeed = (value: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = value;
    setSpeed(value);
    resetHideTimer();
  };

  const toggleFullscreen = async () => {
    const video = videoRef.current as VideoWithWebkit | null;
    const container = containerRef.current;
    if (!video || !container) return;

    if (video.webkitEnterFullscreen && !document.fullscreenElement) {
      video.webkitEnterFullscreen();
      resetHideTimer();
      return;
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await container.requestFullscreen();
    }
    resetHideTimer();
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const panelBg = isDark
    ? "bg-gradient-to-t from-black/95 via-black/70 to-transparent"
    : "bg-gradient-to-t from-black/85 via-black/55 to-transparent";
  const btnClass =
    "min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-white transition-colors touch-manipulation " +
    (isDark ? "active:bg-white/20 sm:hover:bg-white/10" : "active:bg-white/25 sm:hover:bg-white/20");

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-full aspect-video rounded-none sm:rounded-2xl overflow-hidden bg-black border-y sm:border ${
        isDark ? "border-white/10 sm:shadow-2xl" : "border-black/10 sm:shadow-lg"
      } group touch-manipulation`}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => playing && setShowControls(false)}
      onTouchStart={resetHideTimer}
      onTouchEnd={resetHideTimer}
    >
      <video
        ref={videoRef}
        key={src}
        src={src}
        title={title}
        poster={poster}
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-contain bg-black"
        onClick={togglePlay}
        onContextMenu={(e) => e.preventDefault()}
      />

      <button
        type="button"
        onClick={togglePlay}
        className={`absolute inset-0 flex items-center justify-center transition-opacity ${
          playing && !showControls ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-label={playing ? "Pause" : "Play"}
      >
        {!playing && (
          <span className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/50 border border-white/30 flex items-center justify-center text-white text-xl sm:text-2xl backdrop-blur-sm">
            ▶
          </span>
        )}
      </button>

      <div
        className={`absolute inset-x-0 bottom-0 ${panelBg} px-2 sm:px-3 pt-6 sm:pt-8 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:pb-3 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <input
          type="range"
          min={0}
          max={duration || 100}
          step={0.1}
          value={currentTime}
          onChange={(e) => seek(Number(e.target.value))}
          className="w-full h-2 sm:h-1.5 mb-2 sm:mb-3 appearance-none cursor-pointer rounded-full bg-white/20 touch-manipulation"
          style={{
            background: `linear-gradient(to right, ${isDark ? "#D4AF37" : "#7C3AED"} ${progress}%, rgba(255,255,255,0.2) ${progress}%)`,
          }}
          aria-label="Seek"
        />

        <div className="flex items-center gap-0.5 sm:gap-2 min-w-0">
          <button type="button" onClick={togglePlay} className={btnClass} aria-label={playing ? "Pause" : "Play"}>
            <span className="text-base sm:text-lg">{playing ? "⏸" : "▶"}</span>
          </button>

          <button
            type="button"
            onClick={() => skip(-10)}
            className={`${btnClass} hidden sm:flex text-xs font-medium px-1 sm:px-2`}
            aria-label="Back 10 seconds"
          >
            −10s
          </button>
          <button
            type="button"
            onClick={() => skip(10)}
            className={`${btnClass} hidden sm:flex text-xs font-medium px-1 sm:px-2`}
            aria-label="Forward 10 seconds"
          >
            +10s
          </button>

          <span className="text-[11px] sm:text-xs text-white/80 tabular-nums shrink-0 px-1">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div className="flex items-center gap-0.5 sm:gap-1 ml-auto shrink-0">
            <button
              type="button"
              onClick={toggleMute}
              className={`${btnClass} hidden sm:flex`}
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted || volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={(e) => changeVolume(Number(e.target.value))}
              className="hidden md:block w-16 lg:w-20 h-1 appearance-none cursor-pointer accent-gold touch-manipulation"
              aria-label="Volume"
            />

            <select
              value={speed}
              onChange={(e) => changeSpeed(Number(e.target.value))}
              className="text-[11px] sm:text-xs bg-white/10 border border-white/20 rounded-lg px-1.5 sm:px-2 py-2 sm:py-1.5 text-white cursor-pointer min-h-[44px] sm:min-h-0 touch-manipulation max-w-[52px] sm:max-w-none"
              aria-label="Playback speed"
            >
              {SPEEDS.map((s) => (
                <option key={s} value={s} className="text-black">
                  {s}x
                </option>
              ))}
            </select>

            <button type="button" onClick={toggleFullscreen} className={btnClass} aria-label="Fullscreen">
              <span className="text-base">{fullscreen ? "⤢" : "⛶"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
