import { NextResponse } from "next/server";
import { loadCourseBySlug, saveCourse } from "@/lib/courses/store";
import { isPublicMarketingField } from "@/lib/media/constants";
import { applyMarketingMediaUrl } from "@/lib/media/marketing";
import type { MediaUploadField } from "@/lib/media/types";
import { getMarketingPublicUrl } from "@/lib/supabase/public-url";

type Body = {
  courseSlug?: string;
  lessonId?: string;
  videoPath?: string;
  field?: MediaUploadField;
  storagePath?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const courseSlug = String(body.courseSlug ?? "").trim();
    const lessonId = String(body.lessonId ?? "").trim();
    const videoPath = String(body.videoPath ?? "").trim();
    const field = String(body.field ?? "").trim() as MediaUploadField;
    const storagePath = String(body.storagePath ?? "").trim();

    if (!courseSlug) {
      return NextResponse.json({ error: "Missing courseSlug" }, { status: 400 });
    }

    const isLessonVideo = Boolean(lessonId && videoPath);
    const isMarketing = isPublicMarketingField(field) && Boolean(storagePath);

    if (!isLessonVideo && !isMarketing) {
      return NextResponse.json(
        { error: "Provide lessonId + videoPath or field + storagePath." },
        { status: 400 }
      );
    }

    const pathToValidate = isLessonVideo ? videoPath : storagePath;
    if (pathToValidate.includes("..") || pathToValidate.startsWith("/")) {
      return NextResponse.json({ error: "Invalid storage path" }, { status: 400 });
    }

    const course = await loadCourseBySlug(courseSlug);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (isLessonVideo) {
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
    }

    const publicUrl = getMarketingPublicUrl(storagePath);
    const media = applyMarketingMediaUrl(course.media, field, publicUrl);
    await saveCourse({ ...course, media });

    return NextResponse.json({
      ok: true,
      field,
      url: publicUrl,
      media,
      storage: "supabase",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save upload";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
