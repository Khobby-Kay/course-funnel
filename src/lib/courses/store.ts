import "server-only";

import fs from "fs";
import path from "path";
import { isServerlessDeploy } from "@/lib/runtime/filesystem";
import { SEED_COURSES } from "./seed";
import type { CourseDefinition } from "./types";

const BUNDLED_COURSES_DIR = path.join(process.cwd(), "data", "courses");

function getWritableCoursesDir(): string {
  if (isServerlessDeploy()) {
    return path.join("/tmp", "course-funnel", "courses");
  }
  return BUNDLED_COURSES_DIR;
}

function coursePath(slug: string): string {
  return path.join(getWritableCoursesDir(), `${slug}.json`);
}

function ensureDataDir(): void {
  const dir = getWritableCoursesDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function listJsonSlugs(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));
}

function seedIfEmpty(): void {
  ensureDataDir();
  const writableSlugs = listJsonSlugs(getWritableCoursesDir());
  const bundledSlugs = listJsonSlugs(BUNDLED_COURSES_DIR);
  if (writableSlugs.length > 0 || bundledSlugs.length > 0) return;

  for (const course of SEED_COURSES) {
    fs.writeFileSync(coursePath(course.slug), JSON.stringify(course, null, 2), "utf8");
  }
}

function readCourseFile(slug: string): CourseDefinition | null {
  const paths = [path.join(getWritableCoursesDir(), `${slug}.json`)];
  if (getWritableCoursesDir() !== BUNDLED_COURSES_DIR) {
    paths.push(path.join(BUNDLED_COURSES_DIR, `${slug}.json`));
  }

  for (const file of paths) {
    if (!fs.existsSync(file)) continue;
    try {
      return JSON.parse(fs.readFileSync(file, "utf8")) as CourseDefinition;
    } catch {
      return null;
    }
  }
  return null;
}

export function loadAllCourses(): CourseDefinition[] {
  seedIfEmpty();
  const slugs = new Set([...listJsonSlugs(BUNDLED_COURSES_DIR), ...listJsonSlugs(getWritableCoursesDir())]);
  const courses: CourseDefinition[] = [];

  for (const slug of slugs) {
    const course = readCourseFile(slug);
    if (course) courses.push(course);
  }

  return courses.sort((a, b) => a.marketing.course.title.localeCompare(b.marketing.course.title));
}

export function loadCourseBySlug(slug: string): CourseDefinition | undefined {
  seedIfEmpty();
  return readCourseFile(slug) ?? undefined;
}

export function saveCourse(course: CourseDefinition): void {
  ensureDataDir();
  fs.writeFileSync(coursePath(course.slug), JSON.stringify(course, null, 2), "utf8");
}

export function deleteCourseFile(slug: string): boolean {
  ensureDataDir();
  const file = coursePath(slug);
  if (!fs.existsSync(file)) return false;
  fs.unlinkSync(file);
  return true;
}

export function slugExists(slug: string, exceptSlug?: string): boolean {
  seedIfEmpty();
  if (exceptSlug && slug === exceptSlug) return false;
  return (
    fs.existsSync(path.join(getWritableCoursesDir(), `${slug}.json`)) ||
    fs.existsSync(path.join(BUNDLED_COURSES_DIR, `${slug}.json`))
  );
}
