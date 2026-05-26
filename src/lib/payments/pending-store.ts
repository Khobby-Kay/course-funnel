import "server-only";

import fs from "fs";
import path from "path";
import type { PaymentProvider } from "./types";

export type PendingPayment = {
  reference: string;
  courseSlug: string;
  provider: PaymentProvider | "demo";
  createdAt: number;
};

const DATA_DIR = path.join(process.cwd(), "data", "payments");
const STORE_FILE = path.join(DATA_DIR, "pending.json");

function ensureStore(): PendingPayment[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_FILE)) {
    fs.writeFileSync(STORE_FILE, "[]", "utf8");
    return [];
  }
  try {
    const raw = JSON.parse(fs.readFileSync(STORE_FILE, "utf8")) as PendingPayment[];
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function writeStore(entries: PendingPayment[]): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(STORE_FILE, JSON.stringify(entries, null, 2), "utf8");
}

export function getPendingPayment(reference: string): PendingPayment | undefined {
  return ensureStore().find((entry) => entry.reference === reference);
}

export function recordPendingPayment(payment: PendingPayment): void {
  const entries = ensureStore().filter((entry) => entry.reference !== payment.reference);
  entries.push(payment);
  writeStore(entries);
}
