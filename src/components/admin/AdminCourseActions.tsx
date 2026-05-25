"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CourseDefinition } from "@/lib/courses/types";
import { courseLandingPath } from "@/lib/courses";

const STATUS_STYLES: Record<CourseDefinition["status"], string> = {
  published: "bg-green-100 text-green-800 border-green-200",
  draft: "bg-amber-100 text-amber-800 border-amber-200",
  archived: "bg-gray-200 text-gray-600 border-gray-300",
};

export default function AdminCourseActions({ course }: { course: CourseDefinition }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const setStatus = async (status: CourseDefinition["status"]) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/courses/${encodeURIComponent(course.slug)}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Update failed");
      }
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not update course");
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async () => {
    if (
      !confirm(
        `Permanently delete "${course.marketing.course.title}"? This cannot be undone.`
      )
    ) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/courses/${encodeURIComponent(course.slug)}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Delete failed");
      }
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not delete course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr className="border-b border-black/5 hover:bg-gray-light/50">
      <td className="py-4 pl-6 pr-4">
        <span className="text-2xl mr-2" aria-hidden>
          {course.catalog.emoji}
        </span>
        <span className="font-semibold">{course.marketing.course.title}</span>
      </td>
      <td className="py-4 pr-4 font-mono text-sm text-gray-muted">/courses/{course.slug}</td>
      <td className="py-4 pr-4">
        <span
          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[course.status]}`}
        >
          {course.status}
        </span>
      </td>
      <td className="py-4 pr-4 text-sm">
        {course.marketing.course.currency} {course.marketing.course.price}
      </td>
      <td className="py-4 px-6">
        <div className="flex flex-wrap gap-2 justify-end">
          {course.status === "published" && (
            <Link
              href={courseLandingPath(course.slug)}
              target="_blank"
              className="text-xs px-3 py-1.5 rounded-lg border border-black/10 hover:bg-white"
            >
              View live
            </Link>
          )}
          <Link
            href={`/admin/courses/${course.slug}/edit`}
            className="text-xs px-3 py-1.5 rounded-lg bg-purple/10 text-purple font-medium hover:bg-purple/20"
          >
            Edit
          </Link>
          {course.status !== "published" && (
            <button
              type="button"
              disabled={loading}
              onClick={() => setStatus("published")}
              className="text-xs px-3 py-1.5 rounded-lg bg-green-600 text-white font-medium disabled:opacity-50"
            >
              Publish
            </button>
          )}
          {course.status === "published" && (
            <button
              type="button"
              disabled={loading}
              onClick={() => setStatus("archived")}
              className="text-xs px-3 py-1.5 rounded-lg bg-amber-600 text-white font-medium disabled:opacity-50"
            >
              Take down
            </button>
          )}
          {course.status === "archived" && (
            <button
              type="button"
              disabled={loading}
              onClick={() => setStatus("draft")}
              className="text-xs px-3 py-1.5 rounded-lg border border-black/10 font-medium disabled:opacity-50"
            >
              To draft
            </button>
          )}
          <button
            type="button"
            disabled={loading}
            onClick={deleteCourse}
            className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
