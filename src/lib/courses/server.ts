import "server-only";

import { loadAllCourses, loadCourseBySlug } from "./store";
import type { CourseDefinition, CoursePageData } from "./types";
import { courseCheckoutPath, courseLandingPath } from "./paths";

export function toPageData(course: CourseDefinition): CoursePageData {
  const checkoutIncluded = [
    ...course.marketing.valueStack.map((item) => item.name),
    `${course.marketing.course.guaranteeDays}-day money-back guarantee`,
  ];

  return {
    slug: course.slug,
    badge: course.badge,
    brandName: course.brandName,
    landingPath: courseLandingPath(course.slug),
    checkoutPath: courseCheckoutPath(course.slug),
    checkoutIncluded,
    media: course.media,
    ...course.marketing,
  };
}

export async function getAllCourses(): Promise<CourseDefinition[]> {
  return await loadAllCourses();
}

export async function getPublishedCourses(): Promise<CourseDefinition[]> {
  const courses = await loadAllCourses();
  return courses.filter((c) => c.status === "published");
}

export async function getCourseBySlug(slug: string): Promise<CourseDefinition | undefined> {
  return await loadCourseBySlug(slug);
}

export async function getDefaultCourse(): Promise<CourseDefinition> {
  const published = await getPublishedCourses();
  if (published[0]) return published[0];
  const all = await loadAllCourses();
  if (all[0]) return all[0];
  throw new Error("No courses configured");
}

export async function getCoursePageData(slug: string): Promise<CoursePageData | undefined> {
  const course = await getCourseBySlug(slug);
  return course ? toPageData(course) : undefined;
}

export async function getDefaultCoursePageData(): Promise<CoursePageData> {
  return toPageData(await getDefaultCourse());
}

export function isCoursePublic(course: CourseDefinition): boolean {
  return course.status === "published";
}
