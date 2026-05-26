"use client";

import { useRef, useState } from "react";
import type { MediaUploadField } from "@/lib/media/types";

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

  const upload = async (file: File) => {
    setError("");
    setUploading(true);

    try {
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

      const contentType = response.headers.get("content-type") ?? "";
      const isJson = contentType.includes("application/json");
      const data = isJson ? ((await response.json()) as { error?: string; url?: string; videoPath?: string; media?: unknown }) : null;
      const text = isJson ? "" : (await response.text());

      if (!response.ok) {
        if (response.status === 413) {
          throw new Error("Upload rejected: file is too large for this request. Try a smaller video.");
        }
        throw new Error(data?.error ?? (text || "Upload failed"));
      }

      onUploaded({
        url: data?.url,
        videoPath: data?.videoPath,
        media: data?.media,
      });
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
