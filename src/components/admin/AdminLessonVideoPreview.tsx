"use client";

import { useEffect, useState } from "react";
import LessonVideoPlayer from "@/components/lms/LessonVideoPlayer";

type AdminLessonVideoPreviewProps = {
  courseSlug: string;
  lessonId: string;
  title: string;
};

export default function AdminLessonVideoPreview({
  courseSlug,
  lessonId,
  title,
}: AdminLessonVideoPreviewProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setError("");
      setUrl(null);

      try {
        const response = await fetch(
          `/api/admin/media/preview?courseSlug=${encodeURIComponent(courseSlug)}&lessonId=${encodeURIComponent(lessonId)}`,
          { credentials: "include" }
        );

        const data = (await response.json()) as { url?: string; error?: string };
        if (!response.ok || !data.url) {
          if (!cancelled) setError(data.error ?? "Preview unavailable");
          return;
        }

        if (!cancelled) setUrl(data.url);
      } catch {
        if (!cancelled) setError("Preview unavailable");
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [courseSlug, lessonId]);

  if (error) {
    return <p className="text-xs text-amber-700 mb-2">{error}</p>;
  }

  if (!url) {
    return <p className="text-xs text-gray-muted mb-2">Loading preview…</p>;
  }

  return (
    <div className="mb-3 w-full max-w-full sm:max-w-md">
      <LessonVideoPlayer src={url} title={title} theme="light" />
    </div>
  );
}
