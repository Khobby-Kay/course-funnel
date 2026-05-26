import { COURSE_MARKETING_BUCKET } from "./config";

export function getSupabasePublicObjectUrl(
  bucket: string,
  storagePath: string
): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured");
  }
  const normalized = storagePath.replace(/^\/+/, "");
  return `${base}/storage/v1/object/public/${bucket}/${normalized}`;
}

export function getMarketingPublicUrl(storagePath: string): string {
  return getSupabasePublicObjectUrl(COURSE_MARKETING_BUCKET, storagePath);
}
