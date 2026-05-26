import { NextResponse } from "next/server";
import { loadCourseBySlug, saveCourse } from "@/lib/courses/store";
import { lessonVideoStoragePath } from "@/lib/media/paths";
import { isPublicMarketingField } from "@/lib/media/constants";
import {
  applyMarketingMediaUrl,
  marketingMediaStoragePath,
  marketingUploadKind,
} from "@/lib/media/marketing";
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
import {
  COURSE_MARKETING_BUCKET,
  COURSE_VIDEOS_BUCKET,
  isSupabaseConfigured,
} from "@/lib/supabase/config";
import { getMarketingPublicUrl } from "@/lib/supabase/public-url";

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
        const storagePath = lessonVideoStoragePath(courseSlug, lessonId, mime);
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

    if (!isPublicMarketingField(field)) {
      return NextResponse.json({ error: "Invalid upload field" }, { status: 400 });
    }

    const uploadKind = marketingUploadKind(field);
    validateUpload(mime, buffer.length, uploadKind);

    const supabase = getSupabaseAdminOrNull();
    let publicUrl: string;
    let storage: "supabase" | "local";

    if (supabase) {
      const storagePath = marketingMediaStoragePath(courseSlug, field, mime);
      const { error } = await supabase.storage
        .from(COURSE_MARKETING_BUCKET)
        .upload(storagePath, buffer, { contentType: mime, upsert: true });
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 502 });
      }
      publicUrl = getMarketingPublicUrl(storagePath);
      storage = "supabase";
    } else if (canWritePublicMedia()) {
      const saved = savePublicMedia(courseSlug, field, buffer, mime);
      publicUrl = saved.publicUrl;
      storage = "local";
    } else {
      return NextResponse.json(
        {
          error: isSupabaseConfigured()
            ? "Supabase client failed to initialize. Check SUPABASE_SERVICE_ROLE_KEY on Vercel."
            : supabaseRequiredForUploadsMessage(),
        },
        { status: 503 }
      );
    }

    const media = applyMarketingMediaUrl(course.media, field, publicUrl);
    await saveCourse({ ...course, media });

    return NextResponse.json({
      ok: true,
      field,
      url: publicUrl,
      media,
      storage,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
