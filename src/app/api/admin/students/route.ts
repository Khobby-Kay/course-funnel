import { NextResponse } from "next/server";
import { loadAllCourses } from "@/lib/courses/store";
import { listAllEnrollments } from "@/lib/students/store";

export async function GET() {
  const [enrollments, courses] = await Promise.all([listAllEnrollments(), loadAllCourses()]);

  const courseTitles = Object.fromEntries(
    courses.map((c) => [c.slug, c.marketing.course.title])
  );

  return NextResponse.json({
    enrollments: enrollments.map((e) => ({
      ...e,
      courseTitle: courseTitles[e.courseSlug] ?? e.courseSlug,
    })),
    total: enrollments.length,
  });
}
