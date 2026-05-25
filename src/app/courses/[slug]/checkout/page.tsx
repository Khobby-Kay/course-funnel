import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CheckoutForm from "@/components/CheckoutForm";
import { getCourseBySlug, getCoursePageData } from "@/lib/courses/server";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Checkout" };

  return {
    title: `Checkout — ${course.marketing.course.title}`,
    robots: { index: false, follow: false },
  };
}

export default async function CourseCheckoutPage({ params }: PageProps) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  const data = await getCoursePageData(slug);

  if (!course || !data || course.status !== "published") notFound();

  return <CheckoutForm data={data} />;
}
