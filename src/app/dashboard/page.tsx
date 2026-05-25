import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import { ACCESS_COOKIE, getEntitlements, verifyAccessToken } from "@/lib/access";
import { courseDashboardPath } from "@/lib/courses";
import { getCourseBySlug } from "@/lib/courses/server";

export const metadata: Metadata = {
  title: "My Courses",
  robots: { index: false, follow: false },
};

export default async function DashboardHubPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE)?.value;
  const payload = token ? await verifyAccessToken(token) : null;

  if (!payload) {
    redirect("/access?from=/dashboard");
  }

  const entitlements = getEntitlements(payload);
  const items = await Promise.all(
    entitlements.map(async (entry) => {
      const course = await getCourseBySlug(entry.courseSlug);
      if (!course) return null;
      return { entry, course };
    })
  );

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">My Courses</h1>
        <p className="text-white/60 mb-10">Courses you&apos;ve enrolled in — pick one to continue learning.</p>

        <ul className="space-y-4">
          {items.map((item) => {
            if (!item) return null;
            const { entry, course } = item;
            const meta = course.marketing.course;
            return (
              <li key={entry.courseSlug}>
                <article className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                  <div>
                    <p className="text-gold text-sm font-semibold mb-1">{course.catalog.tagline}</p>
                    <h2 className="text-xl font-bold">{meta.title}</h2>
                    <p className="text-white/50 text-sm mt-1">
                      Enrolled · Ref {entry.reference.slice(0, 12)}…
                    </p>
                  </div>
                  <Button href={courseDashboardPath(entry.courseSlug)} size="md">
                    Open Course →
                  </Button>
                </article>
              </li>
            );
          })}
        </ul>

        <p className="text-center mt-10 text-white/40 text-sm">
          <Link href="/" className="text-gold hover:underline">
            Browse more courses
          </Link>
        </p>
      </div>
    </main>
  );
}
