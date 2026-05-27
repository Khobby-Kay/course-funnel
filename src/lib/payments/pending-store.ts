import "server-only";

import type { PaymentProvider } from "./types";
import { findPaymentRecord, readPaymentRecords, writePaymentRecords } from "./json-store";
import { loadPendingPaymentRemote, savePendingPaymentRemote } from "./remote-store";
import { isServerlessDeploy } from "@/lib/runtime/filesystem";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type PendingPayment = {
  reference: string;
  courseSlug: string;
  provider: PaymentProvider | "demo";
  createdAt: number;
  name?: string;
  email?: string;
  phone?: string;
  region?: string;
  countryCode?: string;
};

const CACHE_KEY = "pending-payments";
const FILE_NAME = "pending.json";

export async function getPendingPayment(reference: string): Promise<PendingPayment | undefined> {
  const remote = await loadPendingPaymentRemote(reference);
  if (remote) return remote;
  return findPaymentRecord<PendingPayment>(CACHE_KEY, FILE_NAME, reference);
}

export async function listAllPendingPayments(): Promise<PendingPayment[]> {
  return readPaymentRecords<PendingPayment>(CACHE_KEY, FILE_NAME).sort(
    (a, b) => b.createdAt - a.createdAt
  );
}

export async function recordPendingPayment(payment: PendingPayment): Promise<void> {
  const entries = readPaymentRecords<PendingPayment>(CACHE_KEY, FILE_NAME).filter(
    (entry) => entry.reference !== payment.reference
  );
  entries.push(payment);
  writePaymentRecords(CACHE_KEY, FILE_NAME, entries);

  if (isSupabaseConfigured()) {
    try {
      await savePendingPaymentRemote(payment);
    } catch {
      // Memory/disk store still updated — do not block checkout
    }
    return;
  }

  if (isServerlessDeploy()) {
    return;
  }
}
