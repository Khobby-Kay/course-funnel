import { NextResponse } from "next/server";
import { loadCourseBySlug } from "@/lib/courses/store";
import { lessonVideoStoragePath } from "@/lib/media/paths";
import { validateUpload } from "@/lib/media/store";
import { getSupabaseAdminOrNull } from "@/lib/supabase/admin";
import { COURSE_VIDEOS_BUCKET, isSupabaseConfigured } from "@/lib/supabase/config";

type Body = {
  courseSlug?: string;
  lessonId?: string;
  mime?: string;
  size?: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const courseSlug = String(body.courseSlug ?? "").trim();
    const lessonId = String(body.lessonId ?? "").trim();
    const mime = String(body.mime ?? "application/octet-stream");
    const size = Number(body.size ?? 0);

    if (!courseSlug || !lessonId || !size) {
      return NextResponse.json({ error: "Missing courseSlug, lessonId, or size" }, { status: 400 });
    }

    validateUpload(mime, size, "video");

    const course = await loadCourseBySlug(courseSlug);
    if (!course) {
      return NextResponse.json({ error: "Course not found. Save the course first." }, { status: 404 });
    }

    const lesson = course.lms.modules.flatMap((m) => m.lessons).find((l) => l.id === lessonId);
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found in this course." }, { status: 404 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Supabase is not configured for direct uploads." }, { status: 503 });
    }

    const supabase = getSupabaseAdminOrNull();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client failed to initialize." }, { status: 503 });
    }

    const storagePath = lessonVideoStoragePath(courseSlug, lessonId, mime);
    const { data, error } = await supabase.storage
      .from(COURSE_VIDEOS_BUCKET)
      .createSignedUploadUrl(storagePath, { upsert: true });

    if (error || !data?.token) {
      return NextResponse.json({ error: error?.message ?? "Could not create upload URL" }, { status: 502 });
    }

    return NextResponse.json({
      ok: true,
      storagePath,
      path: data.path,
      token: data.token,
      bucket: COURSE_VIDEOS_BUCKET,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not prepare upload";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
