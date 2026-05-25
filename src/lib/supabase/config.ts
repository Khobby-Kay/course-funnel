export const COURSE_VIDEOS_BUCKET = "course-videos";

/** Signed URL lifetime — short-lived so links cannot be shared long-term. */
export const VIDEO_SIGNED_URL_TTL_SECONDS = 60 * 60;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
