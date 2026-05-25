"use client";

import type { CourseMedia } from "@/lib/courses/types";
import AdminMediaUpload from "@/components/admin/AdminMediaUpload";

type AdminMediaSectionProps = {
  courseSlug: string;
  media: CourseMedia;
  onChange: (media: CourseMedia) => void;
};

const SCREENSHOT_LABELS = ["Module walkthrough", "Template pack", "Client scripts"];

export default function AdminMediaSection({ courseSlug, media, onChange }: AdminMediaSectionProps) {
  const screenshots = media.screenshots ?? [];

  return (
    <fieldset className="space-y-4 rounded-2xl border border-black/10 bg-white p-6">
      <legend className="text-lg font-bold px-1">Images &amp; preview video</legend>
      <p className="text-sm text-gray-muted">
        Uploads appear on the course sales page. Lesson videos are uploaded in the LMS section below.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        <AdminMediaUpload
          courseSlug={courseSlug}
          field="instructorPhoto"
          label="Instructor photo"
          hint="Shown in the instructor section"
          accept="image/jpeg,image/png,image/webp,image/gif"
          currentUrl={media.instructorPhoto}
          onUploaded={({ media: next }) => {
            if (next && typeof next === "object") onChange(next as CourseMedia);
          }}
        />

        <AdminMediaUpload
          courseSlug={courseSlug}
          field="previewVideoPoster"
          label="Preview video poster"
          hint="Thumbnail before the sales-page video plays"
          accept="image/jpeg,image/png,image/webp,image/gif"
          currentUrl={media.previewVideoPoster}
          onUploaded={({ media: next }) => {
            if (next && typeof next === "object") onChange(next as CourseMedia);
          }}
        />
      </div>

      <AdminMediaUpload
        courseSlug={courseSlug}
        field="previewVideo"
        label="Sales page preview video"
        hint="Public teaser video on the course landing page (MP4 recommended)"
        accept="video/mp4,video/webm,video/quicktime"
        currentUrl={media.previewVideoUrl}
        onUploaded={({ media: next }) => {
          if (next && typeof next === "object") onChange(next as CourseMedia);
        }}
      />

      <div className="space-y-3">
        <p className="text-sm font-semibold">Course screenshots (3)</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {SCREENSHOT_LABELS.map((label, index) => (
            <AdminMediaUpload
              key={label}
              courseSlug={courseSlug}
              field={`screenshot-${index}` as "screenshot-0"}
              label={label}
              accept="image/jpeg,image/png,image/webp,image/gif"
              currentUrl={screenshots[index]}
              onUploaded={({ media: next }) => {
                if (next && typeof next === "object") onChange(next as CourseMedia);
              }}
            />
          ))}
        </div>
      </div>
    </fieldset>
  );
}
