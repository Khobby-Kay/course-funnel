import { NextResponse } from "next/server";
import { loadCourseBySlug, saveCourse } from "@/lib/courses/store";
import type { CourseMedia } from "@/lib/courses/types";
import {
  savePrivateLessonVideo,
  savePublicMedia,
  validateUpload,
} from "@/lib/media/store";
import type { MediaUploadField } from "@/lib/media/types";
import {
  canWritePublicMedia,
  canWriteUnderData,
  isServerlessDeploy,
  supabaseRequiredForUploadsMessage,
} from "@/lib/runtime/filesystem";
import { getSupabaseAdminOrNull } from "@/lib/supabase/admin";
import { COURSE_VIDEOS_BUCKET, isSupabaseConfigured } from "@/lib/supabase/config";

const PUBLIC_FIELDS = new Set<MediaUploadField>([
  "instructorPhoto",
  "previewVideo",
  "previewVideoPoster",
  "screenshot-0",
  "screenshot-1",
  "screenshot-2",
]);

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    const courseSlug = String(form.get("courseSlug") ?? "").trim();
    const field = String(form.get("field") ?? "").trim() as MediaUploadField;
    const lessonId = String(form.get("lessonId") ?? "").trim();

    if (!(file instanceof File) || !courseSlug || !field) {
      return NextResponse.json({ error: "Missing file, course, or field" }, { status: 400 });
    }

    const course = await loadCourseBySlug(courseSlug);
    if (!course) {
      return NextResponse.json({ error: "Course not found. Save the course first." }, { status: 404 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mime = file.type || "application/octet-stream";

    if (field === "lessonVideo") {
      if (!lessonId) {
        return NextResponse.json({ error: "lessonId is required for lesson videos" }, { status: 400 });
      }
      validateUpload(mime, buffer.length, "video");

      const supabase = getSupabaseAdminOrNull();
      let videoPath: string;

      if (!supabase && (isServerlessDeploy() || !canWriteUnderData("course-media"))) {
        return NextResponse.json(
          {
            error: isSupabaseConfigured()
              ? "Supabase client failed to initialize. Check SUPABASE_SERVICE_ROLE_KEY on Vercel."
              : supabaseRequiredForUploadsMessage(),
          },
          { status: 503 }
        );
      }

      if (supabase) {
        const storagePath = `${courseSlug}/lessons/${lessonId}${mime.includes("webm") ? ".webm" : ".mp4"}`;
        const { error } = await supabase.storage
          .from(COURSE_VIDEOS_BUCKET)
          .upload(storagePath, buffer, { contentType: mime, upsert: true });
        if (error) {
          return NextResponse.json({ error: error.message }, { status: 502 });
        }
        videoPath = storagePath;
      } else {
        videoPath = savePrivateLessonVideo(courseSlug, lessonId, buffer, mime);
      }

      const modules = course.lms.modules.map((mod) => ({
        ...mod,
        lessons: mod.lessons.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, videoPath } : lesson
        ),
      }));

      await saveCourse({ ...course, lms: { ...course.lms, modules } });

      return NextResponse.json({
        ok: true,
        field,
        lessonId,
        videoPath,
        storage: supabase ? "supabase" : "local",
      });
    }

    if (!PUBLIC_FIELDS.has(field)) {
      return NextResponse.json({ error: "Invalid upload field" }, { status: 400 });
    }

    if (!canWritePublicMedia()) {
      return NextResponse.json(
        {
          error:
            "Marketing images cannot be saved on the live site (read-only disk). " +
            "Upload images while running locally, or commit files under public/course-media/.",
        },
        { status: 503 }
      );
    }

    const isVideo = field === "previewVideo";
    validateUpload(mime, buffer.length, isVideo ? "video" : "image");
    const saved = savePublicMedia(courseSlug, field, buffer, mime);

    const media: CourseMedia = { ...(course.media ?? {}) };

    if (field === "instructorPhoto") media.instructorPhoto = saved.publicUrl;
    else if (field === "previewVideo") media.previewVideoUrl = saved.publicUrl;
    else if (field === "previewVideoPoster") media.previewVideoPoster = saved.publicUrl;
    else if (field.startsWith("screenshot-")) {
      const index = Number(field.split("-")[1]);
      const shots = [...(media.screenshots ?? ["", "", ""])];
      while (shots.length < 3) shots.push("");
      shots[index] = saved.publicUrl;
      media.screenshots = shots;
    }

    await saveCourse({ ...course, media });

    return NextResponse.json({
      ok: true,
      field,
      url: saved.publicUrl,
      media,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
