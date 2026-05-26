"use client";

import type { CourseLms } from "@/lib/courses/types";
import AdminLessonVideoPreview from "@/components/admin/AdminLessonVideoPreview";
import AdminMediaUpload from "@/components/admin/AdminMediaUpload";

type AdminLmsEditorProps = {
  courseSlug: string;
  lms: CourseLms;
  onChange: (lms: CourseLms) => void;
};

function moduleVideoStats(mod: CourseLms["modules"][number]) {
  const total = mod.lessons.length;
  const uploaded = mod.lessons.filter((l) => l.videoPath).length;
  return { total, uploaded };
}

export default function AdminLmsEditor({ courseSlug, lms, onChange }: AdminLmsEditorProps) {
  const allLessons = lms.modules.flatMap((m) => m.lessons);
  const totalVideos = allLessons.filter((l) => l.videoPath).length;

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
        Upload a video for every lesson in every module. Each upload uses the same direct Supabase flow
        (up to 500 MB). Students get playback controls: play/pause, seek, speed, volume, and fullscreen.
        {!courseSlug && " Save the course first to enable uploads."}
      </p>

      <div className="rounded-xl bg-purple/5 border border-purple/20 px-4 py-3 text-sm">
        <span className="font-semibold text-purple">
          {totalVideos}/{allLessons.length}
        </span>{" "}
        lessons have video attached across {lms.modules.length} module{lms.modules.length === 1 ? "" : "s"}.
      </div>

      {lms.modules.map((mod) => {
        const { total, uploaded } = moduleVideoStats(mod);
        return (
          <section key={mod.id} className="space-y-3 rounded-xl border border-black/10 p-4 bg-gray-light/20">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold">
                Module {mod.number}: {mod.icon} {mod.title}
              </h3>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  uploaded === total
                    ? "bg-green-100 text-green-800"
                    : uploaded > 0
                      ? "bg-amber-100 text-amber-800"
                      : "bg-black/5 text-gray-muted"
                }`}
              >
                {uploaded}/{total} videos
              </span>
            </div>

            <ul className="space-y-3">
              {mod.lessons.map((lesson) => (
                <li
                  key={lesson.id}
                  className={`rounded-xl border p-4 ${
                    lesson.videoPath
                      ? "border-green-200 bg-green-50/40"
                      : "border-black/10 bg-gray-light/30"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold">
                      {lesson.number}. {lesson.title}
                    </p>
                    {lesson.videoPath ? (
                      <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                        ✓ Video ready
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-gray-muted bg-black/5 px-2 py-0.5 rounded-full">
                        No video yet
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-muted mb-3">
                    {lesson.duration} · {lesson.summary}
                  </p>

                  {lesson.videoPath && courseSlug && (
                    <>
                      <p className="text-xs text-green-700 mb-2 font-mono truncate">
                        {lesson.videoPath}
                      </p>
                      <AdminLessonVideoPreview
                        courseSlug={courseSlug}
                        lessonId={lesson.id}
                        title={lesson.title}
                      />
                    </>
                  )}

                  <AdminMediaUpload
                    courseSlug={courseSlug}
                    field="lessonVideo"
                    lessonId={lesson.id}
                    label={lesson.videoPath ? "Replace lesson video" : "Upload lesson video"}
                    hint="MP4 up to 500 MB · same upload flow for every module"
                    accept="video/mp4,video/webm,video/quicktime"
                    onUploaded={({ videoPath }) => {
                      if (videoPath) updateLessonVideo(lesson.id, videoPath);
                    }}
                  />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </fieldset>
  );
}
