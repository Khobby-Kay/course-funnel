"use client";

import type { CourseLms } from "@/lib/courses/types";
import AdminMediaUpload from "@/components/admin/AdminMediaUpload";

type AdminLmsEditorProps = {
  courseSlug: string;
  lms: CourseLms;
  onChange: (lms: CourseLms) => void;
};

export default function AdminLmsEditor({ courseSlug, lms, onChange }: AdminLmsEditorProps) {
  const updateLessonVideo = (lessonId: string, videoPath: string) => {
    onChange({
      ...lms,
      modules: lms.modules.map((mod) => ({
        ...mod,
        lessons: mod.lessons.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, videoPath } : lesson
        ),
      })),
    });
  };

  return (
    <fieldset className="space-y-6 rounded-2xl border border-black/10 bg-white p-6">
      <legend className="text-lg font-bold px-1">LMS lesson videos</legend>
      <p className="text-sm text-gray-muted">
        Upload protected lesson videos for enrolled students. Videos are stream-only (not downloadable).
        {!courseSlug && " Save the course first to enable uploads."}
      </p>

      {lms.modules.map((mod) => (
        <section key={mod.id} className="space-y-3">
          <h3 className="text-sm font-bold">
            Module {mod.number}: {mod.icon} {mod.title}
          </h3>
          <ul className="space-y-3">
            {mod.lessons.map((lesson) => (
              <li
                key={lesson.id}
                className="rounded-xl border border-black/10 p-4 bg-gray-light/30"
              >
                <p className="text-sm font-semibold mb-1">
                  {lesson.number}. {lesson.title}
                </p>
                <p className="text-xs text-gray-muted mb-3">{lesson.duration} · {lesson.summary}</p>
                {lesson.videoPath && (
                  <p className="text-xs text-green-700 mb-2 font-mono truncate">
                    ✓ Video attached: {lesson.videoPath}
                  </p>
                )}
                <AdminMediaUpload
                  courseSlug={courseSlug}
                  field="lessonVideo"
                  lessonId={lesson.id}
                  label={lesson.videoPath ? "Replace lesson video" : "Upload lesson video"}
                  hint="MP4 up to 500 MB · uploads go directly to Supabase Storage"
                  accept="video/mp4,video/webm,video/quicktime"
                  onUploaded={({ videoPath }) => {
                    if (videoPath) updateLessonVideo(lesson.id, videoPath);
                  }}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </fieldset>
  );
}
