import "server-only";

import { COURSE_DATA_BUCKET } from "@/lib/courses/remote-store";
import { getSupabaseAdminOrNull } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { ConfirmedPayment } from "./confirmed-store";
import type { PendingPayment } from "./pending-store";

function confirmedPath(reference: string): string {
  return `payments/confirmed/${reference}.json`;
}

function pendingPath(reference: string): string {
  return `payments/pending/${reference}.json`;
}

export async function loadConfirmedPaymentRemote(
  reference: string
): Promise<ConfirmedPayment | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabaseAdminOrNull();
  if (!supabase) return null;

  const { data, error } = await supabase.storage
    .from(COURSE_DATA_BUCKET)
    .download(confirmedPath(reference));

  if (error || !data) return null;

  try {
    return JSON.parse(await data.text()) as ConfirmedPayment;
  } catch {
    return null;
  }
}

export async function saveConfirmedPaymentRemote(payment: ConfirmedPayment): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = getSupabaseAdminOrNull();
  if (!supabase) return;

  const { error } = await supabase.storage
    .from(COURSE_DATA_BUCKET)
    .upload(confirmedPath(payment.reference), JSON.stringify(payment), {
      contentType: "application/json",
      upsert: true,
    });

  if (error) throw new Error(error.message);
}

export async function loadPendingPaymentRemote(reference: string): Promise<PendingPayment | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabaseAdminOrNull();
  if (!supabase) return null;

  const { data, error } = await supabase.storage
    .from(COURSE_DATA_BUCKET)
    .download(pendingPath(reference));

  if (error || !data) return null;

  try {
    return JSON.parse(await data.text()) as PendingPayment;
  } catch {
    return null;
  }
}

export async function savePendingPaymentRemote(payment: PendingPayment): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = getSupabaseAdminOrNull();
  if (!supabase) return;

  const { error } = await supabase.storage
    .from(COURSE_DATA_BUCKET)
    .upload(pendingPath(payment.reference), JSON.stringify(payment), {
      contentType: "application/json",
      upsert: true,
    });

  if (error) throw new Error(error.message);
}
