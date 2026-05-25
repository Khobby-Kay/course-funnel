import Link from "next/link";
import AdminCourseForm from "@/components/admin/AdminCourseForm";

export const dynamic = "force-dynamic";

export default function AdminNewCoursePage() {
  return (
    <main className="min-h-screen bg-gray-light">
      <header className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <h1 className="text-xl font-bold">Add new course</h1>
          <Link href="/admin" className="text-sm text-gold hover:underline">
            ← Back to admin
          </Link>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <AdminCourseForm mode="create" />
      </div>
    </main>
  );
}
