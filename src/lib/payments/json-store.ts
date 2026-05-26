import "server-only";

import fs from "fs";
import path from "path";

/** Vercel/serverless: read-only project dir — use memory + optional /tmp never needed if memory works. */
function canUseProjectDataDir(): boolean {
  if (process.env.VERCEL === "1") return false;
  const dir = path.join(process.cwd(), "data", "payments");
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.accessSync(dir, fs.constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

function filePath(filename: string): string | null {
  if (!canUseProjectDataDir()) return null;
  return path.join(process.cwd(), "data", "payments", filename);
}

type PaymentMemoryRoot = {
  __courseFunnelPaymentStores?: Record<string, Map<string, unknown>>;
};

function getMemoryMap<T extends { reference: string }>(cacheKey: string): Map<string, T> {
  const root = globalThis as PaymentMemoryRoot;
  if (!root.__courseFunnelPaymentStores) {
    root.__courseFunnelPaymentStores = {};
  }
  if (!root.__courseFunnelPaymentStores[cacheKey]) {
    root.__courseFunnelPaymentStores[cacheKey] = new Map();
  }
  return root.__courseFunnelPaymentStores[cacheKey] as Map<string, T>;
}

function hydrateFromDisk<T extends { reference: string }>(
  memory: Map<string, T>,
  filename: string
): void {
  const pathOnDisk = filePath(filename);
  if (!pathOnDisk || !fs.existsSync(pathOnDisk)) return;

  try {
    const raw = JSON.parse(fs.readFileSync(pathOnDisk, "utf8")) as T[];
    if (!Array.isArray(raw)) return;
    for (const entry of raw) {
      if (entry?.reference) memory.set(entry.reference, entry);
    }
  } catch {
    // ignore corrupt file
  }
}

function persistToDisk<T extends { reference: string }>(
  memory: Map<string, T>,
  filename: string
): void {
  const pathOnDisk = filePath(filename);
  if (!pathOnDisk) return;

  try {
    const entries = Array.from(memory.values());
    fs.writeFileSync(pathOnDisk, JSON.stringify(entries, null, 2), "utf8");
  } catch {
    // serverless or read-only FS — memory-only is fine
  }
}

export function readPaymentRecords<T extends { reference: string }>(
  cacheKey: string,
  filename: string
): T[] {
  const memory = getMemoryMap<T>(cacheKey);
  if (memory.size === 0) {
    hydrateFromDisk(memory, filename);
  }
  return Array.from(memory.values());
}

export function writePaymentRecords<T extends { reference: string }>(
  cacheKey: string,
  filename: string,
  entries: T[]
): void {
  const memory = getMemoryMap<T>(cacheKey);
  memory.clear();
  for (const entry of entries) {
    memory.set(entry.reference, entry);
  }
  persistToDisk(memory, filename);
}

export function upsertPaymentRecord<T extends { reference: string }>(
  cacheKey: string,
  filename: string,
  record: T
): void {
  const entries = readPaymentRecords<T>(cacheKey, filename);
  const index = entries.findIndex((e) => e.reference === record.reference);
  if (index >= 0) entries[index] = record;
  else entries.push(record);
  writePaymentRecords(cacheKey, filename, entries);
}

export function findPaymentRecord<T extends { reference: string }>(
  cacheKey: string,
  filename: string,
  reference: string
): T | undefined {
  const memory = getMemoryMap<T>(cacheKey);
  if (memory.size === 0) {
    hydrateFromDisk(memory, filename);
  }
  return memory.get(reference);
}
