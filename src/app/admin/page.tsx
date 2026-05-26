import Link from "next/link";
import AdminCourseActions from "@/components/admin/AdminCourseActions";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import { loadAllCourses } from "@/lib/courses/store";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const courses = await loadAllCourses();

  return (
    <main className="min-h-screen bg-gray-light">
      <header className="bg-black text-white border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">Course Admin</h1>
            <p className="text-white/50 text-sm">Upload, publish, and take down programs</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-sm px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10"
            >
              View site
            </Link>
            <Link
              href="/admin/students"
              className="text-sm px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10"
            >
              Students
            </Link>
            <Link
              href="/admin/courses/new"
              className="text-sm px-4 py-2 rounded-lg bg-gold text-black font-semibold hover:bg-gold-hover"
            >
              + Add course
            </Link>
            <AdminLogoutButton />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <section className="rounded-2xl bg-white border border-black/5 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-black/5">
            <h2 className="text-lg font-bold">All courses ({courses.length})</h2>
            <p className="text-sm text-gray-muted mt-1">
              <strong>Published</strong> = visible on homepage &amp; checkout.{" "}
              <strong>Archived</strong> = taken down. <strong>Draft</strong> = work in progress.
            </p>
          </div>

          {courses.length === 0 ? (
            <p className="p-8 text-center text-gray-muted">
              No courses yet.{" "}
              <Link href="/admin/courses/new" className="text-purple font-semibold hover:underline">
                Create your first course
              </Link>
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-gray-muted border-b border-black/5">
                    <th className="py-3 px-6 font-semibold">Course</th>
                    <th className="py-3 pr-4 font-semibold">Slug</th>
                    <th className="py-3 pr-4 font-semibold">Status</th>
                    <th className="py-3 pr-4 font-semibold">Price</th>
                    <th className="py-3 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="px-6">
                  {courses.map((course) => (
                    <AdminCourseActions key={course.slug} course={course} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
