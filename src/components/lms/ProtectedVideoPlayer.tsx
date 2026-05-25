"use client";

import { useEffect, useState } from "react";

type ProtectedVideoPlayerProps = {
  courseSlug: string;
  lessonId: string;
  title: string;
  poster?: string;
};

type VideoState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; url: string; expiresAt: number }
  | { status: "error"; message: string }
  | { status: "none" };

export default function ProtectedVideoPlayer({
  courseSlug,
  lessonId,
  title,
  poster,
}: ProtectedVideoPlayerProps) {
  const [state, setState] = useState<VideoState>({ status: "idle" });

  useEffect(() => {
    let cancelled = false;

    const loadVideo = async () => {
      setState({ status: "loading" });

      try {
        const response = await fetch(
          `/api/courses/${encodeURIComponent(courseSlug)}/lessons/${encodeURIComponent(lessonId)}/video`,
          { credentials: "include" }
        );

        if (response.status === 404) {
          if (!cancelled) setState({ status: "none" });
          return;
        }

        const data = (await response.json()) as { url?: string; expiresAt?: number; error?: string };

        if (!response.ok || !data.url || !data.expiresAt) {
          if (!cancelled) {
            setState({
              status: "error",
              message: data.error ?? "Could not load video",
            });
          }
          return;
        }

        if (!cancelled) {
          setState({ status: "ready", url: data.url, expiresAt: data.expiresAt });
        }
      } catch {
        if (!cancelled) {
          setState({ status: "error", message: "Could not load video" });
        }
      }
    };

    loadVideo();
    return () => {
      cancelled = true;
    };
  }, [courseSlug, lessonId]);

  if (state.status === "none" || state.status === "idle") return null;

  if (state.status === "loading") {
    return (
      <div className="mb-8 aspect-video rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
        <p className="text-white/50 text-sm">Loading video…</p>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="mb-8 aspect-video rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center px-6 text-center">
        <p className="text-red-300 text-sm">{state.message}</p>
      </div>
    );
  }

  return (
    <section className="mb-8">
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
        <video
          key={state.url}
          src={state.url}
          title={title}
          poster={poster}
          controls
          controlsList="nodownload noplaybackrate"
          disablePictureInPicture
          playsInline
          preload="metadata"
          className="w-full h-full object-contain bg-black"
          onContextMenu={(event) => event.preventDefault()}
        />
      </div>
      <p className="mt-2 text-xs text-white/40">
        Stream-only · link expires periodically · enrolled access required
      </p>
    </section>
  );
}
