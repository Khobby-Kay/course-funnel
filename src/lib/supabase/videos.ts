import "server-only";

import { COURSE_VIDEOS_BUCKET, VIDEO_SIGNED_URL_TTL_SECONDS } from "./config";
import { getSupabaseAdminOrNull } from "./admin";

export type SignedVideoUrl = {
  url: string;
  expiresAt: number;
};

export async function createSignedVideoUrl(storagePath: string): Promise<SignedVideoUrl | null> {
  const supabase = getSupabaseAdminOrNull();
  if (!supabase) return null;

  const normalized = storagePath.replace(/^\/+/, "");
  const { data, error } = await supabase.storage
    .from(COURSE_VIDEOS_BUCKET)
    .createSignedUrl(normalized, VIDEO_SIGNED_URL_TTL_SECONDS);

  if (error || !data?.signedUrl) return null;

  return {
    url: data.signedUrl,
    expiresAt: Date.now() + VIDEO_SIGNED_URL_TTL_SECONDS * 1000,
  };
}
