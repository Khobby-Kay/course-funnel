import type { CourseMedia } from "@/lib/courses/types";
import type { MediaUploadField } from "./types";

function sanitizeSlug(slug: string): string {
  return slug.replace(/[^a-z0-9-]/gi, "").slice(0, 80);
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

export function marketingMediaStoragePath(
  courseSlug: string,
  field: MediaUploadField,
  mime: string
): string {
  const slug = sanitizeSlug(courseSlug);
  const ext = extFromMime(mime);

  if (field === "previewVideo") {
    return `${slug}/previews/preview${ext}`;
  }

  if (field === "coverImage") return `${slug}/images/cover${ext}`;
  if (field === "instructorPhoto") return `${slug}/images/instructor${ext}`;
  if (field === "previewVideoPoster") return `${slug}/images/preview-poster${ext}`;
  if (field.startsWith("screenshot-")) {
    return `${slug}/images/screenshot-${field.split("-")[1]}${ext}`;
  }

  throw new Error("Invalid marketing media field");
}

export function marketingUploadKind(field: MediaUploadField): "image" | "video" {
  return field === "previewVideo" ? "video" : "image";
}

export function applyMarketingMediaUrl(
  media: CourseMedia | undefined,
  field: MediaUploadField,
  publicUrl: string
): CourseMedia {
  const next: CourseMedia = { ...(media ?? {}) };

  if (field === "coverImage") next.coverImage = publicUrl;
  else if (field === "instructorPhoto") next.instructorPhoto = publicUrl;
  else if (field === "previewVideo") next.previewVideoUrl = publicUrl;
  else if (field === "previewVideoPoster") next.previewVideoPoster = publicUrl;
  else if (field.startsWith("screenshot-")) {
    const index = Number(field.split("-")[1]);
    const shots = [...(next.screenshots ?? ["", "", ""])];
    while (shots.length < 3) shots.push("");
    shots[index] = publicUrl;
    next.screenshots = shots;
  }

  return next;
}
