import "server-only";

import type { PaymentProvider } from "./types";
import { findPaymentRecord, readPaymentRecords, writePaymentRecords } from "./json-store";

export type PendingPayment = {
  reference: string;
  courseSlug: string;
  provider: PaymentProvider | "demo";
  createdAt: number;
};

const CACHE_KEY = "pending-payments";
const FILE_NAME = "pending.json";

export function getPendingPayment(reference: string): PendingPayment | undefined {
  return findPaymentRecord<PendingPayment>(CACHE_KEY, FILE_NAME, reference);
}

export function recordPendingPayment(payment: PendingPayment): void {
  const entries = readPaymentRecords<PendingPayment>(CACHE_KEY, FILE_NAME).filter(
    (entry) => entry.reference !== payment.reference
  );
  entries.push(payment);
  writePaymentRecords(CACHE_KEY, FILE_NAME, entries);
}
