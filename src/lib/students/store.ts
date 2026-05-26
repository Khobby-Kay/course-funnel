import "server-only";

import fs from "fs";
import path from "path";
import { isServerlessDeploy } from "@/lib/runtime/filesystem";
import {
  listEnrollmentReferencesRemote,
  loadEnrollmentRemote,
  saveEnrollmentRemote,
} from "./remote-store";
import type { StudentEnrollment } from "./types";

const LOCAL_DIR = path.join(process.cwd(), "data", "students");

function getWritableDir(): string {
  if (isServerlessDeploy()) {
    return path.join("/tmp", "course-funnel", "students");
  }
  return LOCAL_DIR;
}

function localPath(reference: string): string {
  return path.join(getWritableDir(), `${reference}.json`);
}

function ensureDir(): void {
  const dir = getWritableDir();
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readLocal(reference: string): StudentEnrollment | null {
  const file = localPath(reference);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as StudentEnrollment;
  } catch {
    return null;
  }
}

function writeLocal(enrollment: StudentEnrollment): void {
  ensureDir();
  fs.writeFileSync(localPath(enrollment.reference), JSON.stringify(enrollment, null, 2), "utf8");
}

function listLocalReferences(): string[] {
  const dir = getWritableDir();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));
}

export async function getEnrollment(reference: string): Promise<StudentEnrollment | undefined> {
  const remote = await loadEnrollmentRemote(reference);
  if (remote) return remote;
  return readLocal(reference) ?? undefined;
}

export async function saveEnrollment(enrollment: StudentEnrollment): Promise<void> {
  if (!isServerlessDeploy()) {
    writeLocal(enrollment);
  }
  try {
    await saveEnrollmentRemote(enrollment);
  } catch {
    if (isServerlessDeploy()) throw new Error("Could not save enrollment");
  }
}

export async function listAllEnrollments(): Promise<StudentEnrollment[]> {
  const refs = new Set([...listLocalReferences(), ...(await listEnrollmentReferencesRemote())]);
  const enrollments: StudentEnrollment[] = [];

  for (const ref of refs) {
    const remote = await loadEnrollmentRemote(ref);
    const local = readLocal(ref);
    const record = remote ?? local;
    if (record) enrollments.push(record);
  }

  return enrollments.sort((a, b) => b.enrolledAt - a.enrolledAt);
}

export async function listEnrollmentsByCourse(courseSlug: string): Promise<StudentEnrollment[]> {
  const all = await listAllEnrollments();
  return all.filter((e) => e.courseSlug === courseSlug);
}
