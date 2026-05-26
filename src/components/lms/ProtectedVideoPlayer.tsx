"use client";

import { useEffect, useState } from "react";
import LessonVideoPlayer from "@/components/lms/LessonVideoPlayer";

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

  if (state.status === "loading" || state.status === "idle") {
    return (
      <div className="mb-6 sm:mb-8 w-full max-w-full aspect-video rounded-none sm:rounded-2xl bg-white/5 border-y sm:border border-white/10 flex items-center justify-center">
        <p className="text-white/50 text-sm">Loading video…</p>
      </div>
    );
  }

  if (state.status === "none") {
    return (
      <div className="mb-6 sm:mb-8 w-full max-w-full aspect-video rounded-none sm:rounded-2xl bg-white/5 border-y sm:border border-white/10 border-dashed flex flex-col items-center justify-center px-6 text-center gap-2">
        <span className="text-3xl opacity-40" aria-hidden>
          ▶
        </span>
        <p className="text-white/50 text-sm">Video for this lesson is coming soon.</p>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="mb-6 sm:mb-8 w-full max-w-full aspect-video rounded-none sm:rounded-2xl bg-red-500/10 border-y sm:border border-red-500/30 flex items-center justify-center px-6 text-center">
        <p className="text-red-300 text-sm">{state.message}</p>
      </div>
    );
  }

  return (
    <section className="mb-6 sm:mb-8 w-full max-w-full -mx-4 sm:mx-0">
      <LessonVideoPlayer src={state.url} title={title} poster={poster} theme="dark" />
      <p className="mt-2 px-4 sm:px-0 text-xs text-white/40">
        Tap video for play/pause · swipe seek bar · fullscreen on mobile supported
      </p>
    </section>
  );
}
