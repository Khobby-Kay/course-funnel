export type CourseMedia = {
  instructorPhoto?: string;
  previewVideoUrl?: string;
  previewVideoPoster?: string;
  screenshots?: string[];
};

export type MediaUploadField =
  | "coverImage"
  | "instructorPhoto"
  | "previewVideo"
  | "previewVideoPoster"
  | "screenshot-0"
  | "screenshot-1"
  | "screenshot-2"
  | "lessonVideo";

export const IMAGE_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
export const VIDEO_MIME = new Set(["video/mp4", "video/webm", "video/quicktime"]);

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 500 * 1024 * 1024;
