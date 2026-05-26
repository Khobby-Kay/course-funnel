import { NextResponse } from "next/server";
import { loadAllCourses } from "@/lib/courses/store";
import { getCountryByCode } from "@/lib/geo/countries";
import { listAllPendingPayments } from "@/lib/payments/pending-store";
import { listAllEnrollments } from "@/lib/students/store";

export async function GET() {
  const [enrollments, pending, courses] = await Promise.all([
    listAllEnrollments(),
    listAllPendingPayments(),
    loadAllCourses(),
  ]);

  const courseTitles = Object.fromEntries(
    courses.map((c) => [c.slug, c.marketing.course.title])
  );

  const enrolledRefs = new Set(enrollments.map((e) => e.reference));

  const applications = pending
    .filter((p) => p.email && p.name)
    .map((p) => ({
      reference: p.reference,
      name: p.name ?? "",
      email: p.email ?? "",
      phone: p.phone ?? "",
      region: p.region ?? "",
      countryCode: p.countryCode ?? "GH",
      countryName: getCountryByCode(p.countryCode ?? "GH")?.name ?? "Ghana",
      courseSlug: p.courseSlug,
      courseTitle: courseTitles[p.courseSlug] ?? p.courseSlug,
      provider: p.provider,
      startedAt: p.createdAt,
      status: enrolledRefs.has(p.reference)
        ? ("enrolled" as const)
        : ("payment_pending" as const),
    }));

  return NextResponse.json({
    enrollments: enrollments.map((e) => ({
      ...e,
      countryName: getCountryByCode(e.countryCode)?.name ?? e.countryCode,
      courseTitle: courseTitles[e.courseSlug] ?? e.courseSlug,
      status: "enrolled" as const,
    })),
    applications,
    totalEnrolled: enrollments.length,
    totalApplications: applications.length,
  });
}
