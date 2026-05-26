import "server-only";

import type { PaymentProvider } from "./types";
import { findPaymentRecord, upsertPaymentRecord } from "./json-store";

export type ConfirmedPayment = {
  reference: string;
  provider: PaymentProvider | "demo";
  courseSlug: string;
  confirmedAt: number;
};

const CACHE_KEY = "confirmed-payments";
const FILE_NAME = "confirmed.json";

export function getConfirmedPayment(reference: string): ConfirmedPayment | undefined {
  return findPaymentRecord<ConfirmedPayment>(CACHE_KEY, FILE_NAME, reference);
}

export function recordConfirmedPayment(payment: ConfirmedPayment): void {
  upsertPaymentRecord(CACHE_KEY, FILE_NAME, payment);
}
