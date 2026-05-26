import "server-only";

import { getSupabaseAdminOrNull } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { CourseDefinition } from "./types";

export const COURSE_DATA_BUCKET = "course-data";
const PREFIX = "courses";

function storagePath(slug: string): string {
  return `${PREFIX}/${slug}.json`;
}

export async function loadCourseFromRemote(slug: string): Promise<CourseDefinition | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabaseAdminOrNull();
  if (!supabase) return null;

  const { data, error } = await supabase.storage
    .from(COURSE_DATA_BUCKET)
    .download(storagePath(slug));

  if (error || !data) return null;

  try {
    return JSON.parse(await data.text()) as CourseDefinition;
  } catch {
    return null;
  }
}

export async function saveCourseToRemote(course: CourseDefinition): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = getSupabaseAdminOrNull();
  if (!supabase) {
    throw new Error("Supabase is not configured for course storage.");
  }

  const { error } = await supabase.storage
    .from(COURSE_DATA_BUCKET)
    .upload(storagePath(course.slug), JSON.stringify(course, null, 2), {
      contentType: "application/json",
      upsert: true,
    });

  if (error) throw new Error(error.message);
}

export async function deleteCourseFromRemote(slug: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = getSupabaseAdminOrNull();
  if (!supabase) return;

  await supabase.storage.from(COURSE_DATA_BUCKET).remove([storagePath(slug)]);
}

export async function listRemoteCourseSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabaseAdminOrNull();
  if (!supabase) return [];

  const { data, error } = await supabase.storage.from(COURSE_DATA_BUCKET).list(PREFIX, {
    limit: 500,
  });

  if (error || !data) return [];

  return data
    .filter((item) => item.name?.endsWith(".json"))
    .map((item) => item.name!.replace(/\.json$/, ""));
}
