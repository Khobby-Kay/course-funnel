import { NextResponse } from "next/server";
import { loadCourseBySlug } from "@/lib/courses/store";
import { adminMessageHtml, isEmailConfigured, sendEmail } from "@/lib/email/send";
import { getEnrollment, listEnrollmentsByCourse } from "@/lib/students/store";

type Body = {
  subject?: string;
  message?: string;
  courseSlug?: string;
  reference?: string;
};

export async function POST(request: Request) {
  try {
    if (!isEmailConfigured()) {
      return NextResponse.json(
        {
          error:
            "Email not configured. Add RESEND_API_KEY and EMAIL_FROM in .env.local or Vercel env vars.",
        },
        { status: 503 }
      );
    }

    const body = (await request.json()) as Body;
    const subject = body.subject?.trim();
    const message = body.message?.trim();
    const courseSlug = body.courseSlug?.trim();
    const reference = body.reference?.trim();

    if (!subject || !message) {
      return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
    }

    let recipients = reference
      ? [await getEnrollment(reference)].filter(Boolean)
      : courseSlug
        ? await listEnrollmentsByCourse(courseSlug)
        : [];

    if (reference && recipients.length === 0) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    if (!reference && !courseSlug) {
      return NextResponse.json(
        { error: "Select a course or a specific student to email" },
        { status: 400 }
      );
    }

    if (recipients.length === 0) {
      return NextResponse.json({ error: "No students found for this course" }, { status: 404 });
    }

    const course = courseSlug ? await loadCourseBySlug(courseSlug) : null;
    const courseTitle = course?.marketing.course.title;

    let sent = 0;
    const errors: string[] = [];

    for (const student of recipients) {
      if (!student) continue;

      const result = await sendEmail({
        to: student.email,
        subject,
        html: adminMessageHtml({
          name: student.name,
          subject,
          body: message,
          courseTitle: courseTitle ?? student.courseSlug,
        }),
      });

      if (result.ok) sent += 1;
      else errors.push(`${student.email}: ${result.error}`);
    }

    return NextResponse.json({
      ok: true,
      sent,
      total: recipients.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Could not send email";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
