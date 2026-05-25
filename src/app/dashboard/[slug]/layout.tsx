import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { ACCESS_COOKIE, hasAccessToCourse } from "@/lib/access";
import { getCourseBySlug } from "@/lib/courses/server";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  return {
    title: course ? `Learning — ${course.marketing.course.title}` : "Course Dashboard",
    robots: { index: false, follow: false },
  };
}

export default async function CourseDashboardLayout({ children, params }: LayoutProps) {
  const { slug } = await params;
  if (!(await getCourseBySlug(slug))) notFound();

  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE)?.value;

  if (!(await hasAccessToCourse(token, slug))) {
    redirect(`/access?from=/dashboard/${slug}&course=${slug}`);
  }

  return children;
}
