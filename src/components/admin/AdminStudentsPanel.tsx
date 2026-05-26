"use client";

import { useCallback, useEffect, useState } from "react";

type EnrollmentRow = {
  reference: string;
  email: string;
  name: string;
  phone: string;
  courseSlug: string;
  courseTitle: string;
  provider: string;
  enrolledAt: number;
  confirmationEmailSentAt?: number;
};

type CourseOption = { slug: string; title: string };

type Props = {
  courses: CourseOption[];
};

function formatDate(ms: number): string {
  return new Date(ms).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminStudentsPanel({ courses }: Props) {
  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterCourse, setFilterCourse] = useState("");
  const [selectedReference, setSelectedReference] = useState("");

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/students");
      const data = (await res.json()) as { enrollments?: EnrollmentRow[]; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not load students");
      setEnrollments(data.enrollments ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load students");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const filtered = filterCourse
    ? enrollments.filter((e) => e.courseSlug === filterCourse)
    : enrollments;

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    setSendResult(null);

    if (!subject.trim() || !message.trim()) {
      setSendResult("Subject and message are required.");
      return;
    }

    if (!selectedReference && !filterCourse) {
      setSendResult("Select a course filter or a specific student to email.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/admin/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject.trim(),
          message: message.trim(),
          courseSlug: selectedReference ? undefined : filterCourse || undefined,
          reference: selectedReference || undefined,
        }),
      });

      const data = (await res.json()) as {
        sent?: number;
        total?: number;
        errors?: string[];
        error?: string;
      };

      if (!res.ok) throw new Error(data.error ?? "Send failed");

      const errNote =
        data.errors && data.errors.length > 0 ? ` Some failed: ${data.errors.join("; ")}` : "";
      setSendResult(`Sent to ${data.sent ?? 0} of ${data.total ?? 0} student(s).${errNote}`);
      setSubject("");
      setMessage("");
    } catch (err) {
      setSendResult(err instanceof Error ? err.message : "Send failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-white border border-black/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-black/5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold">Enrolled students ({enrollments.length})</h2>
            <p className="text-sm text-gray-muted mt-1">
              Students who completed checkout. Confirmation emails send automatically after payment.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <select
              value={filterCourse}
              onChange={(e) => {
                setFilterCourse(e.target.value);
                setSelectedReference("");
              }}
              className="text-sm border border-black/10 rounded-lg px-3 py-2 bg-white"
            >
              <option value="">All courses</option>
              {courses.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.title}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={loadStudents}
              className="text-sm px-4 py-2 rounded-lg border border-black/10 hover:bg-gray-light"
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <p className="p-8 text-center text-gray-muted">Loading students…</p>
        ) : error ? (
          <p className="p-8 text-center text-red-600">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-gray-muted">
            No enrollments yet. They appear here after a successful payment.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-gray-muted border-b border-black/5">
                  <th className="py-3 px-6 font-semibold">Name</th>
                  <th className="py-3 pr-4 font-semibold">Email</th>
                  <th className="py-3 pr-4 font-semibold">Course</th>
                  <th className="py-3 pr-4 font-semibold">Enrolled</th>
                  <th className="py-3 px-6 font-semibold">Email</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr
                    key={row.reference}
                    className={`border-b border-black/5 hover:bg-gray-light/50 cursor-pointer ${
                      selectedReference === row.reference ? "bg-purple/5" : ""
                    }`}
                    onClick={() =>
                      setSelectedReference((prev) =>
                        prev === row.reference ? "" : row.reference
                      )
                    }
                  >
                    <td className="py-3 px-6 font-medium">{row.name}</td>
                    <td className="py-3 pr-4">
                      <a
                        href={`mailto:${row.email}`}
                        className="text-purple hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {row.email}
                      </a>
                    </td>
                    <td className="py-3 pr-4">{row.courseTitle}</td>
                    <td className="py-3 pr-4 text-gray-muted whitespace-nowrap">
                      {formatDate(row.enrolledAt)}
                    </td>
                    <td className="py-3 px-6">
                      {row.confirmationEmailSentAt ? (
                        <span className="text-green-700 text-xs font-semibold">Sent</span>
                      ) : (
                        <span className="text-amber-700 text-xs">Not sent</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-2xl bg-white border border-black/5 shadow-sm p-6">
        <h2 className="text-lg font-bold mb-1">Email students</h2>
        <p className="text-sm text-gray-muted mb-6">
          {selectedReference
            ? "Sending to the selected student only."
            : filterCourse
              ? `Sending to all students in this course (${filtered.length}).`
              : "Filter by course or click a row to email one student."}
        </p>

        <form onSubmit={handleSend} className="space-y-4 max-w-2xl">
          <div>
            <label htmlFor="email-subject" className="block text-sm font-semibold mb-1">
              Subject
            </label>
            <input
              id="email-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. New module added to your course"
              className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="email-message" className="block text-sm font-semibold mb-1">
              Message
            </label>
            <textarea
              id="email-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              placeholder="Write your message. Line breaks are preserved."
              className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm resize-y"
            />
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <button
              type="submit"
              disabled={sending}
              className="text-sm px-5 py-2.5 rounded-lg bg-gold text-black font-semibold hover:bg-gold-hover disabled:opacity-50"
            >
              {sending ? "Sending…" : "Send email"}
            </button>
            {selectedReference && (
              <button
                type="button"
                onClick={() => setSelectedReference("")}
                className="text-sm text-gray-muted hover:text-black"
              >
                Clear selection
              </button>
            )}
          </div>
          {sendResult && (
            <p
              className={`text-sm ${sendResult.startsWith("Sent") ? "text-green-700" : "text-red-600"}`}
            >
              {sendResult}
            </p>
          )}
        </form>

        <p className="text-xs text-gray-muted mt-6 border-t border-black/5 pt-4">
          Requires <code className="font-mono bg-black/5 px-1 rounded">RESEND_API_KEY</code> and{" "}
          <code className="font-mono bg-black/5 px-1 rounded">EMAIL_FROM</code> in env vars. Use a
          verified domain in Resend for production.
        </p>
      </section>
    </div>
  );
}
