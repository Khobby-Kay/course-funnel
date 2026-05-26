import "server-only";

import fs from "fs";
import path from "path";
import { canWriteUnderData } from "@/lib/runtime/filesystem";
import type { MediaUploadField } from "./types";
import { IMAGE_MIME, VIDEO_MIME } from "./types";

const PUBLIC_MEDIA_ROOT = path.join(process.cwd(), "public", "course-media");
const PRIVATE_MEDIA_ROOT = path.join(process.cwd(), "data", "course-media");

function sanitizeSlug(slug: string): string {
  return slug.replace(/[^a-z0-9-]/gi, "").slice(0, 80);
}

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function extFromMime(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    case "video/webm":
      return ".webm";
    case "video/quicktime":
      return ".mov";
    default:
      return ".mp4";
  }
}

export function publicUrlForPath(relativePath: string): string {
  return `/course-media/${relativePath.replace(/^\/+/, "")}`;
}

export function savePublicMedia(
  courseSlug: string,
  field: MediaUploadField,
  buffer: Buffer,
  mime: string
): { publicUrl: string; storagePath: string } {
  const slug = sanitizeSlug(courseSlug);
  const ext = extFromMime(mime);

  if (field === "previewVideo") {
    const videoDir = path.join(PUBLIC_MEDIA_ROOT, slug, "previews");
    ensureDir(videoDir);
    const filename = `preview${ext}`;
    fs.writeFileSync(path.join(videoDir, filename), buffer);
    const storagePath = `${slug}/previews/${filename}`;
    return { publicUrl: publicUrlForPath(storagePath), storagePath };
  }

  const base = path.join(PUBLIC_MEDIA_ROOT, slug, "images");
  let filename: string;
  if (field === "coverImage") filename = `cover${ext}`;
  else if (field === "instructorPhoto") filename = `instructor${ext}`;
  else if (field === "previewVideoPoster") filename = `preview-poster${ext}`;
  else if (field.startsWith("screenshot-")) filename = `screenshot-${field.split("-")[1]}${ext}`;
  else throw new Error("Invalid public media field");

  ensureDir(base);
  fs.writeFileSync(path.join(base, filename), buffer);
  const storagePath = `${slug}/images/${filename}`;
  return { publicUrl: publicUrlForPath(storagePath), storagePath };
}

export function savePrivateLessonVideo(
  courseSlug: string,
  lessonId: string,
  buffer: Buffer,
  mime: string
): string {
  if (!canWriteUnderData("course-media")) {
    throw new Error("Cannot save lesson videos on disk here. Configure Supabase Storage.");
  }
  const slug = sanitizeSlug(courseSlug);
  const safeLessonId = lessonId.replace(/[^a-z0-9-_]/gi, "").slice(0, 80);
  const dir = path.join(PRIVATE_MEDIA_ROOT, slug, "lessons");
  ensureDir(dir);
  const filename = `${safeLessonId}${extFromMime(mime)}`;
  fs.writeFileSync(path.join(dir, filename), buffer);
  return `lessons/${filename}`;
}

export function resolvePrivateVideoFile(courseSlug: string, videoPath: string): string | null {
  const slug = sanitizeSlug(courseSlug);
  const normalized = videoPath.replace(/^\/+/, "");
  const fullPath = path.join(PRIVATE_MEDIA_ROOT, slug, normalized);
  if (!fs.existsSync(fullPath)) return null;
  return fullPath;
}

export function validateUpload(mime: string, size: number, kind: "image" | "video"): void {
  if (kind === "image") {
    if (!IMAGE_MIME.has(mime)) throw new Error("Unsupported image type. Use JPG, PNG, WebP, or GIF.");
    if (size > 10 * 1024 * 1024) throw new Error("Image must be under 10 MB.");
  } else {
    if (!VIDEO_MIME.has(mime)) throw new Error("Unsupported video type. Use MP4, WebM, or MOV.");
    if (size > 500 * 1024 * 1024) throw new Error("Video must be under 500 MB.");
  }
}

export { PRIVATE_MEDIA_ROOT, PUBLIC_MEDIA_ROOT };
