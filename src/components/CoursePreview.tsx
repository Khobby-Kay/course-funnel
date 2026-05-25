import { assets, hasAsset } from "@/lib/site-config";
import MediaImage from "@/components/MediaImage";
import type { CoursePageData } from "@/lib/courses/types";

const CHECKLIST = [
  "Watch on phone, tablet, or laptop",
  "Copy-paste templates in every module",
  "Real examples from African markets",
  "Tasks you complete — not passive watching",
] as const;

const SCREENSHOT_LABELS = ["Module walkthrough", "Template pack", "Client scripts"] as const;

function resolvePreviewVideo(data: CoursePageData): string | undefined {
  return data.media?.previewVideoUrl || assets.courseVideoUrl || undefined;
}

function resolvePoster(data: CoursePageData): string | undefined {
  return data.media?.previewVideoPoster || assets.courseVideoPoster || undefined;
}

function resolveScreenshots(data: CoursePageData): (string | undefined)[] {
  const uploaded = data.media?.screenshots ?? [];
  return SCREENSHOT_LABELS.map((_, index) => uploaded[index] || assets.previewScreenshots[index]);
}

function CourseVideo({ data }: { data: CoursePageData }) {
  const url = resolvePreviewVideo(data);
  const poster = resolvePoster(data);

  if (!hasAsset(url)) {
    if (hasAsset(poster)) {
      return (
        <MediaImage
          src={poster}
          alt="Course preview"
          fill
          className="object-cover"
          priority
        />
      );
    }
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-purple/60 to-black flex items-center justify-center">
        <div
          className="w-20 h-20 rounded-full bg-gold flex items-center justify-center shadow-lg shadow-gold/30"
          aria-hidden
        >
          <span className="text-black text-2xl ml-1">▶</span>
        </div>
      </div>
    );
  }

  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    let videoId = "";
    if (url.includes("youtu.be")) {
      videoId = url.split("/").pop()?.split("?")[0] ?? "";
    } else {
      const match = url.match(/[?&]v=([^&]+)/);
      videoId = match?.[1] ?? "";
    }

    if (!videoId) {
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-purple/60 to-black flex items-center justify-center">
          <span className="text-white/60 text-sm">Invalid YouTube URL</span>
        </div>
      );
    }

    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="Course preview"
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <video
      src={url}
      poster={hasAsset(poster) ? poster : undefined}
      controls
      className="absolute inset-0 w-full h-full object-cover"
      playsInline
    />
  );
}

type CoursePreviewProps = { data: CoursePageData };

export default function CoursePreview({ data }: CoursePreviewProps) {
  const screenshotSlots = SCREENSHOT_LABELS.map((label, index) => ({
    label,
    src: resolveScreenshots(data)[index],
  }));

  const previewVideo = resolvePreviewVideo(data);

  return (
    <section id="preview" className="py-20 lg:py-28 bg-gray-light scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-black shadow-2xl border border-black/10">
              <CourseVideo data={data} />
              <p className="absolute bottom-4 left-4 text-white/80 text-sm font-medium z-10 drop-shadow-md">
                {hasAsset(previewVideo) ? "Course preview" : hasAsset(resolvePoster(data)) ? "Course preview" : "Preview coming soon"}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              {screenshotSlots.map(({ label, src }) => (
                <div
                  key={label}
                  className="relative rounded-xl aspect-video overflow-hidden bg-white border border-black/5"
                >
                  <MediaImage
                    src={src}
                    alt={label}
                    fill
                    className="object-cover"
                    placeholder={
                      <span className="text-xs text-gray-muted font-medium px-2 text-center">
                        {label}
                      </span>
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-purple font-bold uppercase tracking-wider text-sm mb-2">Inside the course</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Not Another &ldquo;Watch &amp; Forget&rdquo; Course
            </h2>
            <p className="text-gray-muted mb-8 leading-relaxed">
              Every lesson ends with an action step. Every module gives you something you can use
              immediately — scripts, templates, and frameworks built for the African market.
            </p>
            <ul className="space-y-4 list-none">
              {CHECKLIST.map((item) => (
                <li key={item} className="flex items-center gap-4">
                  <span
                    className="w-8 h-8 rounded-lg bg-purple/10 text-purple flex items-center justify-center font-bold text-sm shrink-0"
                    aria-hidden
                  >
                    ✔
                  </span>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
