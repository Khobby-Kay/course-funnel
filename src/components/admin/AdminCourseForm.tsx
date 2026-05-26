"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AdminLmsEditor from "@/components/admin/AdminLmsEditor";
import AdminMediaSection from "@/components/admin/AdminMediaSection";
import type { CourseDefinition, CourseLms, CourseMedia } from "@/lib/courses/types";
import type { CourseFormInput } from "@/lib/courses/template";
import { courseToFormInput } from "@/lib/courses/template";

type AdminCourseFormProps = {
  mode: "create" | "edit";
  initial?: CourseDefinition;
};

const emptyForm: CourseFormInput = {
  title: "",
  slug: "",
  badge: "",
  brandName: "",
  status: "draft",
  catalog: { emoji: "", tagline: "", description: "", highlights: [""] },
  course: {
    headline: "",
    subheadline: "",
    price: 399,
    oldPrice: 799,
    totalValue: 2000,
    currency: "GHS",
    lessons: "10+",
    duration: "14 Days",
    rating: 4.8,
    students: "100+",
    discount: "LAUNCH OFFER",
    roiStatement: "",
    guaranteeDays: 30,
  },
};

export default function AdminCourseForm({ mode, initial }: AdminCourseFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<CourseFormInput>(
    initial ? courseToFormInput(initial) : emptyForm
  );
  const [lms, setLms] = useState<CourseLms>(
    initial?.lms ?? {
      modules: [],
      bonusResources: [],
    }
  );
  const [media, setMedia] = useState<CourseMedia>(initial?.media ?? {});
  const [highlightsText, setHighlightsText] = useState(
    initial ? initial.catalog.highlights.join("\n") : "Lifetime access\nTemplates included"
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const update = <K extends keyof CourseFormInput>(key: K, value: CourseFormInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateCourse = (key: keyof CourseFormInput["course"], value: string | number) => {
    setForm((prev) => ({
      ...prev,
      course: { ...prev.course, [key]: value },
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    const payload: CourseFormInput = {
      ...form,
      catalog: {
        ...form.catalog,
        highlights: highlightsText.split("\n").map((h) => h.trim()).filter(Boolean),
      },
    };

    try {
      const url =
        mode === "create"
          ? "/api/admin/courses"
          : `/api/admin/courses/${encodeURIComponent(initial!.slug)}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, lms, media }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed");

      if (mode === "create" && data.course?.slug) {
        window.location.href = `/admin/courses/${encodeURIComponent(data.course.slug)}/edit`;
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {error && (
        <p className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm" role="alert">
          {error}
        </p>
      )}

      <fieldset className="space-y-4 rounded-2xl border border-black/10 bg-white p-6">
        <legend className="text-lg font-bold px-1">Basics</legend>
        <label className="block">
          <span className="text-sm font-medium">Course title *</span>
          <input
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className="mt-1 w-full px-4 py-2.5 rounded-xl border border-black/10 focus:border-purple focus:outline-none"
          />
        </label>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium">URL slug</span>
            <input
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              placeholder="auto-from-title"
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-black/10 font-mono text-sm"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Status</span>
            <select
              value={form.status}
              onChange={(e) =>
                update("status", e.target.value as CourseFormInput["status"])
              }
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-black/10"
            >
              <option value="draft">Draft — hidden from site</option>
              <option value="published">Published — live on site</option>
              <option value="archived">Archived — taken down</option>
            </select>
          </label>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium">Badge (2–3 letters)</span>
            <input
              value={form.badge}
              onChange={(e) => update("badge", e.target.value.toUpperCase())}
              maxLength={3}
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-black/10"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Brand name (navbar)</span>
            <input
              value={form.brandName}
              onChange={(e) => update("brandName", e.target.value)}
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-black/10"
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-2xl border border-black/10 bg-white p-6">
        <legend className="text-lg font-bold px-1">Catalog card (homepage)</legend>
        <p className="text-sm text-gray-muted">
          Upload the course cover image in the Images section after saving (edit mode).
        </p>
        <label className="block">
          <span className="text-sm font-medium">Tagline</span>
          <input
            value={form.catalog.tagline}
            onChange={(e) =>
              update("catalog", { ...form.catalog, tagline: e.target.value })
            }
            className="mt-1 w-full px-4 py-2.5 rounded-xl border border-black/10"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Description</span>
          <textarea
            rows={3}
            value={form.catalog.description}
            onChange={(e) =>
              update("catalog", { ...form.catalog, description: e.target.value })
            }
            className="mt-1 w-full px-4 py-2.5 rounded-xl border border-black/10"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Highlights (one per line)</span>
          <textarea
            rows={4}
            value={highlightsText}
            onChange={(e) => setHighlightsText(e.target.value)}
            className="mt-1 w-full px-4 py-2.5 rounded-xl border border-black/10 font-mono text-sm"
          />
        </label>
      </fieldset>

      <fieldset className="space-y-4 rounded-2xl border border-black/10 bg-white p-6">
        <legend className="text-lg font-bold px-1">Sales page & pricing</legend>
        <label className="block">
          <span className="text-sm font-medium">Headline</span>
          <input
            value={form.course.headline}
            onChange={(e) => updateCourse("headline", e.target.value)}
            className="mt-1 w-full px-4 py-2.5 rounded-xl border border-black/10"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Subheadline</span>
          <textarea
            rows={2}
            value={form.course.subheadline}
            onChange={(e) => updateCourse("subheadline", e.target.value)}
            className="mt-1 w-full px-4 py-2.5 rounded-xl border border-black/10"
          />
        </label>
        <div className="grid sm:grid-cols-3 gap-4">
          <label className="block">
            <span className="text-sm font-medium">Price</span>
            <input
              type="number"
              min={0}
              value={form.course.price}
              onChange={(e) => updateCourse("price", Number(e.target.value))}
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-black/10"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Was price</span>
            <input
              type="number"
              min={0}
              value={form.course.oldPrice}
              onChange={(e) => updateCourse("oldPrice", Number(e.target.value))}
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-black/10"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Currency</span>
            <select
              value={form.course.currency || "GHS"}
              onChange={(e) => updateCourse("currency", e.target.value)}
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-black/10"
            >
              <option value="GHS">GHS — Ghana cedis (Mobile Money)</option>
            </select>
            <p className="text-xs text-gray-muted mt-1">
              Mobile Money requires GHS. Other currencies will be added with card payments.
            </p>
          </label>
        </div>
      </fieldset>

      {mode === "edit" && initial?.slug && (
        <>
          <AdminMediaSection
            courseSlug={initial.slug}
            media={media}
            onChange={setMedia}
          />

          <AdminLmsEditor courseSlug={initial.slug} lms={lms} onChange={setLms} />
        </>
      )}

      {mode === "create" && (
        <p className="text-sm text-gray-muted rounded-xl border border-black/10 bg-white p-4">
          After creating the course, you&apos;ll be taken to the edit page to upload images and lesson videos.
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-purple text-white font-semibold hover:bg-purple-light disabled:opacity-50"
        >
          {saving ? "Saving…" : mode === "create" ? "Create course" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="px-6 py-3 rounded-xl border border-black/10 font-medium hover:bg-gray-light"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
