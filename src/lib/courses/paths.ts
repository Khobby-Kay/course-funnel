export const FALLBACK_COURSE_SLUG = "digital-marketing-mastery";

export function courseLandingPath(slug: string): string {
  return `/courses/${slug}`;
}

export function courseCheckoutPath(slug: string): string {
  return `/courses/${slug}/checkout`;
}

export function courseDashboardPath(slug: string): string {
  return `/dashboard/${slug}`;
}
