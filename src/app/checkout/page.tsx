import { redirect } from "next/navigation";
import { courseCheckoutPath } from "@/lib/courses";
import { getDefaultCourse } from "@/lib/courses/server";

export default async function LegacyCheckoutRedirect() {
  const course = await getDefaultCourse();
  redirect(courseCheckoutPath(course.slug));
}
