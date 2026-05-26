import "server-only";

import { COURSE_DATA_BUCKET } from "@/lib/courses/remote-store";
import { getSupabaseAdminOrNull } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { StudentEnrollment } from "./types";

const PREFIX = "students";

function storagePath(reference: string): string {
  return `${PREFIX}/${reference}.json`;
}

export async function loadEnrollmentRemote(reference: string): Promise<StudentEnrollment | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabaseAdminOrNull();
  if (!supabase) return null;

  const { data, error } = await supabase.storage
    .from(COURSE_DATA_BUCKET)
    .download(storagePath(reference));

  if (error || !data) return null;

  try {
    return JSON.parse(await data.text()) as StudentEnrollment;
  } catch {
    return null;
  }
}

export async function saveEnrollmentRemote(enrollment: StudentEnrollment): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = getSupabaseAdminOrNull();
  if (!supabase) return;

  const { error } = await supabase.storage
    .from(COURSE_DATA_BUCKET)
    .upload(storagePath(enrollment.reference), JSON.stringify(enrollment, null, 2), {
      contentType: "application/json",
      upsert: true,
    });

  if (error) throw new Error(error.message);
}

export async function listEnrollmentReferencesRemote(): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabaseAdminOrNull();
  if (!supabase) return [];

  const { data, error } = await supabase.storage.from(COURSE_DATA_BUCKET).list(PREFIX, {
    limit: 1000,
  });

  if (error || !data) return [];

  return data
    .filter((item) => item.name?.endsWith(".json"))
    .map((item) => item.name!.replace(/\.json$/, ""));
}
