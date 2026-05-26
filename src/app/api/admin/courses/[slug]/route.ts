import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { buildCourseFromForm, courseLandingPath, type CourseFormInput } from "@/lib/courses";
import type { CourseDefinition } from "@/lib/courses/types";
import { deleteCourseFile, loadCourseBySlug, saveCourse, slugExists } from "@/lib/courses/store";
import { slugify } from "@/lib/courses/template";

type RouteContext = { params: Promise<{ slug: string }> };

function revalidateCourse(slug: string) {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(courseLandingPath(slug));
  revalidatePath(`${courseLandingPath(slug)}/checkout`);
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const course = await loadCourseBySlug(slug);
  if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ course });
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { slug: currentSlug } = await context.params;
    const existing = await loadCourseBySlug(currentSlug);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = (await request.json()) as CourseFormInput & {
      lmsJson?: string;
      lms?: CourseDefinition["lms"];
      media?: CourseDefinition["media"];
    };
    const newSlug = slugify(body.slug || body.title);

    if (newSlug !== currentSlug && (await slugExists(newSlug, currentSlug))) {
      return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
    }

    let course = buildCourseFromForm({ ...body, slug: newSlug }, existing);

    if (body.lms) {
      course = { ...course, lms: body.lms };
    } else if (body.lmsJson?.trim()) {
      try {
        const parsed = JSON.parse(body.lmsJson) as CourseDefinition["lms"];
        course = { ...course, lms: parsed };
      } catch {
        return NextResponse.json({ error: "Invalid LMS JSON" }, { status: 400 });
      }
    }

    if (body.media) {
      course = { ...course, media: body.media };
    }

    if (newSlug !== currentSlug) {
      await deleteCourseFile(currentSlug);
      revalidateCourse(currentSlug);
    }

    await saveCourse(course);
    revalidateCourse(course.slug);

    return NextResponse.json({ ok: true, course });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update course";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const course = await loadCourseBySlug(slug);
    if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = (await request.json()) as { status?: CourseDefinition["status"] };
    if (!body.status || !["published", "draft", "archived"].includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = { ...course, status: body.status };
    await saveCourse(updated);
    revalidateCourse(slug);

    return NextResponse.json({ ok: true, course: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const deleted = await deleteCourseFile(slug);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });

  revalidateCourse(slug);
  return NextResponse.json({ ok: true });
}
