export type { CourseDefinition, CoursePageData, CourseMeta, CourseStatus } from "./types";
export { slugify, buildCourseFromForm, courseToFormInput } from "./template";
export type { CourseFormInput } from "./template";
export {
  FALLBACK_COURSE_SLUG,
  courseLandingPath,
  courseCheckoutPath,
  courseDashboardPath,
} from "./paths";
