export function lessonVideoStoragePath(
  courseSlug: string,
  lessonId: string,
  mime: string
): string {
  const ext = mime.includes("webm") ? ".webm" : mime.includes("quicktime") ? ".mov" : ".mp4";
  return `${courseSlug}/lessons/${lessonId}${ext}`;
}
