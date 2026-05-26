/** Shared Moolre paid-status logic for webhook + verify API. */
export type MoolreStatusPayload = {
  status?: number | string;
  data?: {
    txstatus?: number | string;
    amount?: number | string;
    currency?: string;
    externalref?: string;
    metadata?: Record<string, unknown>;
  };
  metadata?: Record<string, unknown>;
};

/** Moolre txstatus: 1 = paid, 0 = pending, 2 = failed */
export const MOOLRE_TXSTATUS_PAID = 1;

export function isMoolrePaid(payload: MoolreStatusPayload): boolean {
  const status = Number(payload.status);
  if (status !== 1) return false;

  const txstatus = payload.data?.txstatus;
  if (txstatus === undefined || txstatus === null || txstatus === "") {
    return false;
  }

  return Number(txstatus) === MOOLRE_TXSTATUS_PAID;
}

export function parseMoolreAmount(payload: MoolreStatusPayload): number | undefined {
  const raw = payload.data?.amount;
  if (raw === undefined || raw === null || raw === "") return undefined;
  const value = Number(raw);
  return Number.isFinite(value) ? value : undefined;
}

export function parseMoolreCourseSlug(payload: MoolreStatusPayload): string | undefined {
  const meta = payload.data?.metadata ?? payload.metadata;
  if (!meta || typeof meta !== "object") return undefined;

  const slug = meta.course_slug ?? meta.courseSlug;
  return typeof slug === "string" ? slug.trim() : undefined;
}
