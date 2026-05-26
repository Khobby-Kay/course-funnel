import "server-only";

import type { PaymentProvider } from "./types";
import { findPaymentRecord, upsertPaymentRecord } from "./json-store";
import { loadConfirmedPaymentRemote, saveConfirmedPaymentRemote } from "./remote-store";

export type ConfirmedPayment = {
  reference: string;
  provider: PaymentProvider | "demo";
  courseSlug: string;
  confirmedAt: number;
};

const CACHE_KEY = "confirmed-payments";
const FILE_NAME = "confirmed.json";

export async function getConfirmedPayment(
  reference: string
): Promise<ConfirmedPayment | undefined> {
  const remote = await loadConfirmedPaymentRemote(reference);
  if (remote) return remote;
  return findPaymentRecord<ConfirmedPayment>(CACHE_KEY, FILE_NAME, reference);
}

export async function recordConfirmedPayment(payment: ConfirmedPayment): Promise<void> {
  upsertPaymentRecord(CACHE_KEY, FILE_NAME, payment);
  try {
    await saveConfirmedPaymentRemote(payment);
  } catch {
    // Local/memory store still updated
  }
}
