import { cookies } from "next/headers";
import fs from "fs";
import { NextResponse } from "next/server";
import { ACCESS_COOKIE, hasAccessToCourse } from "@/lib/access";
import { getCourseBySlug } from "@/lib/courses/server";
import { resolvePrivateVideoFile } from "@/lib/media/store";

type RouteContext = { params: Promise<{ slug: string; lessonId: string }> };

function getContentType(filePath: string): string {
  if (filePath.endsWith(".webm")) return "video/webm";
  if (filePath.endsWith(".mov")) return "video/quicktime";
  return "video/mp4";
}

export async function GET(request: Request, context: RouteContext) {
  const { slug, lessonId } = await context.params;

  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE)?.value;
  if (!(await hasAccessToCourse(token, slug))) {
    return new NextResponse("Access denied", { status: 403 });
  }

  const course = await getCourseBySlug(slug);
  if (!course) return new NextResponse("Not found", { status: 404 });

  const lesson = course.lms.modules.flatMap((m) => m.lessons).find((l) => l.id === lessonId);
  if (!lesson?.videoPath) return new NextResponse("No video", { status: 404 });

  const filePath = resolvePrivateVideoFile(slug, lesson.videoPath);
  if (!filePath) return new NextResponse("Video file missing", { status: 404 });

  const stat = fs.statSync(filePath);
  const contentType = getContentType(filePath);
  const range = request.headers.get("range");

  if (range) {
    const match = range.match(/bytes=(\d+)-(\d*)/);
    if (match) {
      const start = Number(match[1]);
      const end = match[2] ? Number(match[2]) : stat.size - 1;
      const chunkSize = end - start + 1;
      const stream = fs.createReadStream(filePath, { start, end });
      return new NextResponse(stream as unknown as BodyInit, {
        status: 206,
        headers: {
          "Content-Type": contentType,
          "Content-Length": String(chunkSize),
          "Content-Range": `bytes ${start}-${end}/${stat.size}`,
          "Accept-Ranges": "bytes",
          "Cache-Control": "private, no-store",
        },
      });
    }
  }

  const stream = fs.createReadStream(filePath);
  return new NextResponse(stream as unknown as BodyInit, {
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(stat.size),
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, no-store",
    },
  });
}
