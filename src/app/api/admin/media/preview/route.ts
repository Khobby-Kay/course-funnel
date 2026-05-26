import { NextResponse } from "next/server";
import { loadCourseBySlug } from "@/lib/courses/store";
import { resolvePrivateVideoFile } from "@/lib/media/store";
import { createSignedVideoUrl } from "@/lib/supabase/videos";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseSlug = searchParams.get("courseSlug")?.trim();
    const lessonId = searchParams.get("lessonId")?.trim();

    if (!courseSlug || !lessonId) {
      return NextResponse.json({ error: "Missing courseSlug or lessonId" }, { status: 400 });
    }

    const course = await loadCourseBySlug(courseSlug);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const lesson = course.lms.modules.flatMap((m) => m.lessons).find((l) => l.id === lessonId);
    if (!lesson?.videoPath) {
      return NextResponse.json({ error: "No video for this lesson" }, { status: 404 });
    }

    const localFile = resolvePrivateVideoFile(courseSlug, lesson.videoPath);
    if (localFile) {
      return NextResponse.json({
        url: `/api/courses/${encodeURIComponent(courseSlug)}/lessons/${encodeURIComponent(lessonId)}/stream`,
        expiresAt: Date.now() + 60 * 60 * 1000,
      });
    }

    const signed = await createSignedVideoUrl(lesson.videoPath);
    if (!signed) {
      return NextResponse.json({ error: "Could not load preview" }, { status: 502 });
    }

    return NextResponse.json(signed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Preview failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
