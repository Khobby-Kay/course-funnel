import "server-only";

import fs from "fs";
import path from "path";
import { SEED_COURSES } from "./seed";
import type { CourseDefinition } from "./types";

const DATA_DIR = path.join(process.cwd(), "data", "courses");

function coursePath(slug: string): string {
  return path.join(DATA_DIR, `${slug}.json`);
}

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function seedIfEmpty(): void {
  ensureDataDir();
  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
  if (files.length > 0) return;

  for (const course of SEED_COURSES) {
    fs.writeFileSync(coursePath(course.slug), JSON.stringify(course, null, 2), "utf8");
  }
}

function readCourseFile(slug: string): CourseDefinition | null {
  const file = coursePath(slug);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as CourseDefinition;
  } catch {
    return null;
  }
}

export function loadAllCourses(): CourseDefinition[] {
  seedIfEmpty();
  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
  const courses: CourseDefinition[] = [];

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(DATA_DIR, file), "utf8");
      courses.push(JSON.parse(raw) as CourseDefinition);
    } catch {
      // skip corrupt files
    }
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
  return fs.existsSync(coursePath(slug));
}
