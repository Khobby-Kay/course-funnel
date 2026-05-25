import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import CourseDashboard from "@/components/lms/CourseDashboard";
import { ACCESS_COOKIE, verifyAccessToken } from "@/lib/access";
import { getCourseBySlug } from "@/lib/courses/server";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CourseDashboardPage({ params }: PageProps) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE)?.value;
  const payload = token ? await verifyAccessToken(token) : null;
  const entitlement = payload?.entitlements.find((e) => e.courseSlug === slug);

  if (!entitlement) {
    redirect(`/access?from=/dashboard/${slug}&course=${slug}`);
  }

  return <CourseDashboard course={course} reference={entitlement.reference} />;
}
