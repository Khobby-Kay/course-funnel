import "server-only";

import fs from "fs";
import path from "path";
import { isServerlessDeploy } from "@/lib/runtime/filesystem";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  deleteCourseFromRemote,
  listRemoteCourseSlugs,
  loadCourseFromRemote,
  saveCourseToRemote,
} from "./remote-store";
import { SEED_COURSES } from "./seed";
import type { CourseDefinition } from "./types";

const BUNDLED_COURSES_DIR = path.join(process.cwd(), "data", "courses");

function getLocalCoursesDir(): string {
  return BUNDLED_COURSES_DIR;
}

function localCoursePath(slug: string): string {
  return path.join(getLocalCoursesDir(), `${slug}.json`);
}

function ensureLocalDataDir(): void {
  const dir = getLocalCoursesDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function listLocalJsonSlugs(): string[] {
  const dir = getLocalCoursesDir();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));
}

function seedIfEmpty(): void {
  if (isServerlessDeploy()) return;
  ensureLocalDataDir();
  if (listLocalJsonSlugs().length > 0) return;

  for (const course of SEED_COURSES) {
    fs.writeFileSync(localCoursePath(course.slug), JSON.stringify(course, null, 2), "utf8");
  }
}

function readLocalCourseFile(slug: string): CourseDefinition | null {
  const file = localCoursePath(slug);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as CourseDefinition;
  } catch {
    return null;
  }
}

export async function loadCourseBySlug(slug: string): Promise<CourseDefinition | undefined> {
  seedIfEmpty();
  const remote = await loadCourseFromRemote(slug);
  if (remote) return remote;
  return readLocalCourseFile(slug) ?? undefined;
}

export async function loadAllCourses(): Promise<CourseDefinition[]> {
  seedIfEmpty();
  const slugs = new Set([
    ...listLocalJsonSlugs(),
    ...(await listRemoteCourseSlugs()),
  ]);

  const courses: CourseDefinition[] = [];
  for (const slug of slugs) {
    const course = await loadCourseBySlug(slug);
    if (course) courses.push(course);
  }

  return courses.sort((a, b) => a.marketing.course.title.localeCompare(b.marketing.course.title));
}

export async function saveCourse(course: CourseDefinition): Promise<void> {
  if (isSupabaseConfigured()) {
    await saveCourseToRemote(course);
  }

  if (!isServerlessDeploy()) {
    ensureLocalDataDir();
    fs.writeFileSync(localCoursePath(course.slug), JSON.stringify(course, null, 2), "utf8");
  }
}

export async function deleteCourseFile(slug: string): Promise<boolean> {
  let deleted = false;

  if (isSupabaseConfigured()) {
    await deleteCourseFromRemote(slug);
    deleted = true;
  }

  if (!isServerlessDeploy()) {
    const file = localCoursePath(slug);
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      deleted = true;
    }
  }

  return deleted;
}

export async function slugExists(slug: string, exceptSlug?: string): Promise<boolean> {
  if (exceptSlug && slug === exceptSlug) return false;
  seedIfEmpty();

  const remote = await listRemoteCourseSlugs();
  if (remote.includes(slug)) return true;

  return fs.existsSync(localCoursePath(slug));
}
