import type { MediaUploadField } from "./types";

export const PUBLIC_MARKETING_FIELDS = new Set<MediaUploadField>([
  "coverImage",
  "instructorPhoto",
  "previewVideo",
  "previewVideoPoster",
  "screenshot-0",
  "screenshot-1",
  "screenshot-2",
]);

export function isPublicMarketingField(field: string): field is MediaUploadField {
  return PUBLIC_MARKETING_FIELDS.has(field as MediaUploadField);
}
