import Button from "@/components/ui/Button";
import {
  courseCheckoutPath,
  courseLandingPath,
  FALLBACK_COURSE_SLUG,
} from "@/lib/courses";
import { getCourseBySlug } from "@/lib/courses/server";

export default async function AccessDeniedPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; course?: string }>;
}) {
  const params = await searchParams;
  const fromCourse = params.from?.startsWith("/dashboard");
  const courseSlug = params.course ?? FALLBACK_COURSE_SLUG;
  const course = (await getCourseBySlug(courseSlug)) ?? (await getCourseBySlug(FALLBACK_COURSE_SLUG));
  if (!course) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center px-4 text-white">
        <p>Course not found.</p>
      </main>
    );
  }
  const meta = course.marketing.course;

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <article className="max-w-md text-center text-white">
        <span className="text-5xl mb-6 block" aria-hidden>
          🔒
        </span>
        <h1 className="text-3xl font-bold mb-4">Course Access Required</h1>
        <p className="text-white/70 mb-2 leading-relaxed">
          {fromCourse
            ? `Enroll in ${meta.title} to unlock this area. Payment is required before you can access lessons.`
            : "You need a verified payment to access the course dashboard."}
        </p>
        <p className="text-gold font-semibold mb-8">
          {meta.currency} {meta.price} · Lifetime access · {meta.guaranteeDays}-day guarantee
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href={courseCheckoutPath(course.slug)} size="lg">
            Enroll in {meta.title} →
          </Button>
          <Button href={courseLandingPath(course.slug)} variant="secondary" size="lg">
            View Course Page
          </Button>
        </div>
        <p className="mt-6">
          <Button href="/" variant="secondary" size="sm">
            All Courses
          </Button>
        </p>
      </article>
    </main>
  );
}
