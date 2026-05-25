import "server-only";

import fs from "fs";
import path from "path";
import type { PaymentProvider } from "./types";

export type ConfirmedPayment = {
  reference: string;
  provider: PaymentProvider | "demo";
  courseSlug: string;
  confirmedAt: number;
};

const DATA_DIR = path.join(process.cwd(), "data", "payments");
const STORE_FILE = path.join(DATA_DIR, "confirmed.json");

function ensureStore(): ConfirmedPayment[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_FILE)) {
    fs.writeFileSync(STORE_FILE, "[]", "utf8");
    return [];
  }
  try {
    const raw = JSON.parse(fs.readFileSync(STORE_FILE, "utf8")) as ConfirmedPayment[];
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function writeStore(entries: ConfirmedPayment[]): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(STORE_FILE, JSON.stringify(entries, null, 2), "utf8");
}

export function getConfirmedPayment(reference: string): ConfirmedPayment | undefined {
  return ensureStore().find((entry) => entry.reference === reference);
}

export function recordConfirmedPayment(payment: ConfirmedPayment): void {
  const entries = ensureStore();
  const index = entries.findIndex((entry) => entry.reference === payment.reference);
  if (index >= 0) entries[index] = payment;
  else entries.push(payment);
  writeStore(entries);
}
