import { NextResponse } from "next/server";
import { loadCourseBySlug, saveCourse } from "@/lib/courses/store";

type Body = {
  courseSlug?: string;
  lessonId?: string;
  videoPath?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const courseSlug = String(body.courseSlug ?? "").trim();
    const lessonId = String(body.lessonId ?? "").trim();
    const videoPath = String(body.videoPath ?? "").trim();

    if (!courseSlug || !lessonId || !videoPath) {
      return NextResponse.json({ error: "Missing courseSlug, lessonId, or videoPath" }, { status: 400 });
    }

    if (videoPath.includes("..") || videoPath.startsWith("/")) {
      return NextResponse.json({ error: "Invalid video path" }, { status: 400 });
    }

    const course = await loadCourseBySlug(courseSlug);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const lessonExists = course.lms.modules.some((mod) =>
      mod.lessons.some((lesson) => lesson.id === lessonId)
    );
    if (!lessonExists) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
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
      field: "lessonVideo",
      lessonId,
      videoPath,
      storage: "supabase",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save video";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
