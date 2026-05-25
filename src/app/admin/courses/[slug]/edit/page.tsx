import Link from "next/link";
import { notFound } from "next/navigation";
import AdminCourseForm from "@/components/admin/AdminCourseForm";
import { loadCourseBySlug } from "@/lib/courses/store";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AdminEditCoursePage({ params }: PageProps) {
  const { slug } = await params;
  const course = loadCourseBySlug(slug);
  if (!course) notFound();

  return (
    <main className="min-h-screen bg-gray-light">
      <header className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">Edit course</h1>
            <p className="text-white/50 text-sm font-mono">/courses/{course.slug}</p>
          </div>
          <Link href="/admin" className="text-sm text-gold hover:underline shrink-0">
            ← Back to admin
          </Link>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <AdminCourseForm mode="edit" initial={course} />
      </div>
    </main>
  );
}
