import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { buildCourseFromForm, courseLandingPath, type CourseFormInput } from "@/lib/courses";
import { loadAllCourses, saveCourse, slugExists } from "@/lib/courses/store";
import { slugify } from "@/lib/courses/template";

function revalidateCourse(slug: string) {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(courseLandingPath(slug));
  revalidatePath(`${courseLandingPath(slug)}/checkout`);
}

export async function GET() {
  const courses = loadAllCourses();
  return NextResponse.json({ courses });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CourseFormInput;
    const slug = slugify(body.slug || body.title);

    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (slugExists(slug)) {
      return NextResponse.json({ error: "A course with this slug already exists" }, { status: 409 });
    }

    const course = buildCourseFromForm({ ...body, slug });
    saveCourse(course);
    revalidateCourse(course.slug);

    return NextResponse.json({ ok: true, course });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create course";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
