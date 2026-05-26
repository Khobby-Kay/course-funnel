import Link from "next/link";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import AdminStudentsPanel from "@/components/admin/AdminStudentsPanel";
import { loadAllCourses } from "@/lib/courses/store";

export const dynamic = "force-dynamic";

export default async function AdminStudentsPage() {
  const courses = await loadAllCourses();
  const courseOptions = courses.map((c) => ({
    slug: c.slug,
    title: c.marketing.course.title,
  }));

  return (
    <main className="min-h-screen bg-gray-light">
      <header className="bg-black text-white border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">Students &amp; Email</h1>
            <p className="text-white/50 text-sm">View enrollments and message your students</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin"
              className="text-sm px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10"
            >
              ← Courses
            </Link>
            <AdminLogoutButton />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <AdminStudentsPanel courses={courseOptions} />
      </div>
    </main>
  );
}
