import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ACCESS_COOKIE, hasAccessToCourse } from "@/lib/access";
import { getCourseBySlug } from "@/lib/courses/server";
import { resolvePrivateVideoFile } from "@/lib/media/store";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSignedVideoUrl } from "@/lib/supabase/videos";

type RouteContext = { params: Promise<{ slug: string; lessonId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { slug, lessonId } = await context.params;

  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE)?.value;
  if (!(await hasAccessToCourse(token, slug))) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const course = await getCourseBySlug(slug);
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const lesson = course.lms.modules.flatMap((m) => m.lessons).find((l) => l.id === lessonId);
  if (!lesson?.videoPath) {
    return NextResponse.json({ error: "This lesson has no video" }, { status: 404 });
  }

  const localFile = resolvePrivateVideoFile(slug, lesson.videoPath);
  if (localFile) {
    const expiresAt = Date.now() + 60 * 60 * 1000;
    return NextResponse.json({
      url: `/api/courses/${encodeURIComponent(slug)}/lessons/${encodeURIComponent(lessonId)}/stream`,
      expiresAt,
    });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }

  const signed = await createSignedVideoUrl(lesson.videoPath);
  if (!signed) {
    return NextResponse.json({ error: "Could not load video" }, { status: 502 });
  }

  return NextResponse.json(signed);
}
