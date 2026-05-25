import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CourseLanding from "@/components/CourseLanding";
import { getCourseBySlug, getCoursePageData } from "@/lib/courses/server";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Course Not Found" };

  const meta = course.marketing.course;
  return {
    title: `${meta.title} | ${meta.headline.slice(0, 60)}…`,
    description: meta.subheadline,
  };
}

export default async function CoursePage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getCoursePageData(slug);
  const course = await getCourseBySlug(slug);

  if (!data || !course || course.status !== "published") notFound();

  return <CourseLanding data={data} />;
}
