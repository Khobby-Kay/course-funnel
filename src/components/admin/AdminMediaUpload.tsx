"use client";

import { useRef, useState } from "react";
import { isPublicMarketingField } from "@/lib/media/constants";
import type { MediaUploadField } from "@/lib/media/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { COURSE_VIDEOS_BUCKET } from "@/lib/supabase/config";

type AdminMediaUploadProps = {
  courseSlug: string;
  field: MediaUploadField;
  label: string;
  hint?: string;
  accept: string;
  currentUrl?: string;
  lessonId?: string;
  onUploaded: (result: { url?: string; videoPath?: string; media?: unknown }) => void;
};

type UploadJson = {
  error?: string;
  url?: string;
  videoPath?: string;
  media?: unknown;
  path?: string;
  token?: string;
  storagePath?: string;
  bucket?: string;
};

function canDirectSupabaseUpload(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  );
}

async function readUploadResponse(response: Response): Promise<{ data: UploadJson | null; text: string }> {
  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  if (isJson) {
    return { data: (await response.json()) as UploadJson, text: "" };
  }
  return { data: null, text: await response.text() };
}

function uploadError(response: Response, data: UploadJson | null, text: string): Error {
  if (response.status === 413) {
    return new Error(
      "Upload rejected: file is too large for this server route. Use direct Supabase upload (refresh and try again)."
    );
  }
  return new Error(data?.error ?? (text || "Upload failed"));
}

export default function AdminMediaUpload({
  courseSlug,
  field,
  label,
  hint,
  accept,
  currentUrl,
  lessonId,
  onUploaded,
}: AdminMediaUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const uploadDirectToSupabase = async (
    file: File,
    prepareBody: Record<string, string | number>
  ) => {
    const mime = file.type || "application/octet-stream";

    const prepareResponse = await fetch("/api/admin/media/upload-url", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseSlug,
        mime,
        size: file.size,
        ...prepareBody,
      }),
    });

    const { data: prepare, text: prepareText } = await readUploadResponse(prepareResponse);
    if (!prepareResponse.ok) throw uploadError(prepareResponse, prepare, prepareText);
    if (!prepare?.path || !prepare.token || !prepare.storagePath) {
      throw new Error("Upload URL response was incomplete");
    }

    const supabase = createSupabaseBrowserClient();
    const { error: uploadErrorResult } = await supabase.storage
      .from(prepare.bucket ?? COURSE_VIDEOS_BUCKET)
      .uploadToSignedUrl(prepare.path, prepare.token, file, {
        contentType: mime,
        upsert: true,
      });

    if (uploadErrorResult) {
      throw new Error(uploadErrorResult.message);
    }

    return prepare;
  };

  const uploadLessonVideoDirect = async (file: File) => {
    if (!lessonId) throw new Error("lessonId is required for lesson videos");

    const prepare = await uploadDirectToSupabase(file, { lessonId });

    const completeResponse = await fetch("/api/admin/media/complete", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseSlug,
        lessonId,
        videoPath: prepare.storagePath,
      }),
    });

    const { data: complete, text: completeText } = await readUploadResponse(completeResponse);
    if (!completeResponse.ok) throw uploadError(completeResponse, complete, completeText);

    onUploaded({ videoPath: complete?.videoPath ?? prepare.storagePath });
  };

  const uploadMarketingDirect = async (file: File) => {
    const prepare = await uploadDirectToSupabase(file, { field });

    const completeResponse = await fetch("/api/admin/media/complete", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseSlug,
        field,
        storagePath: prepare.storagePath,
      }),
    });

    const { data: complete, text: completeText } = await readUploadResponse(completeResponse);
    if (!completeResponse.ok) throw uploadError(completeResponse, complete, completeText);

    onUploaded({
      url: complete?.url,
      media: complete?.media,
    });
  };

  const uploadViaApi = async (file: File) => {
    const body = new FormData();
    body.append("file", file);
    body.append("courseSlug", courseSlug);
    body.append("field", field);
    if (lessonId) body.append("lessonId", lessonId);

    const response = await fetch("/api/admin/media/upload", {
      method: "POST",
      credentials: "include",
      body,
    });

    const { data, text } = await readUploadResponse(response);
    if (!response.ok) throw uploadError(response, data, text);

    onUploaded({
      url: data?.url,
      videoPath: data?.videoPath,
      media: data?.media,
    });
  };

  const upload = async (file: File) => {
    setError("");
    setUploading(true);

    try {
      if (canDirectSupabaseUpload()) {
        if (field === "lessonVideo") {
          await uploadLessonVideoDirect(file);
        } else if (isPublicMarketingField(field)) {
          await uploadMarketingDirect(file);
        } else {
          await uploadViaApi(file);
        }
      } else {
        await uploadViaApi(file);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const isVideo = accept.includes("video");
  const preview = currentUrl;

  return (
    <div className="rounded-xl border border-black/10 p-4 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">{label}</p>
          {hint && <p className="text-xs text-gray-muted mt-0.5">{hint}</p>}
        </div>
        <button
          type="button"
          disabled={uploading || !courseSlug}
          onClick={() => inputRef.current?.click()}
          className="text-xs px-3 py-1.5 rounded-lg bg-purple text-white font-medium disabled:opacity-50"
        >
          {uploading ? "Uploading…" : preview ? "Replace" : "Upload"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
        }}
      />

      {error && <p className="text-xs text-red-600">{error}</p>}

      {preview && (
        <div className="relative rounded-lg overflow-hidden bg-gray-light border border-black/5 aspect-video max-w-xs">
          {isVideo ? (
            <video src={preview} controls className="w-full h-full object-cover" playsInline />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="w-full h-full object-cover" />
          )}
        </div>
      )}

      {!preview && !uploading && (
        <p className="text-xs text-gray-muted">No file uploaded yet.</p>
      )}
    </div>
  );
}
