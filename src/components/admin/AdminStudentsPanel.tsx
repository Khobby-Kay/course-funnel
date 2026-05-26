"use client";

import { useCallback, useEffect, useState } from "react";
import { getCountryByCode } from "@/lib/geo/countries";

type StudentRow = {
  reference: string;
  email: string;
  name: string;
  phone: string;
  region: string;
  countryCode: string;
  countryName?: string;
  courseSlug: string;
  courseTitle: string;
  provider: string;
  enrolledAt?: number;
  startedAt?: number;
  confirmationEmailSentAt?: number;
  status: "enrolled" | "payment_pending";
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
  const [rows, setRows] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCourse, setFilterCourse] = useState("");
  const [filterStatus, setFilterStatus] = useState<"" | "enrolled" | "payment_pending">("");
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
      const data = (await res.json()) as {
        enrollments?: StudentRow[];
        applications?: StudentRow[];
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Could not load students");

      const enrolled = (data.enrollments ?? []).map((e) => ({ ...e, status: "enrolled" as const }));
      const pending = (data.applications ?? []).filter(
        (a) => a.status === "payment_pending"
      );
      const merged = [...enrolled, ...pending].sort(
        (a, b) => (b.enrolledAt ?? b.startedAt ?? 0) - (a.enrolledAt ?? a.startedAt ?? 0)
      );
      setRows(merged);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load students");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const filtered = rows.filter((row) => {
    if (filterCourse && row.courseSlug !== filterCourse) return false;
    if (filterStatus && row.status !== filterStatus) return false;
    return true;
  });

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    setSendResult(null);

    if (!subject.trim() || !message.trim()) {
      setSendResult("Subject and message are required.");
      return;
    }

    if (!selectedReference && !filterCourse) {
      setSendResult("Filter by course or select a student to email enrolled learners only.");
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

  const exportCsv = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Region",
      "Country",
      "Course",
      "Status",
      "Provider",
      "Reference",
      "Date",
    ];
    const lines = filtered.map((r) => [
      r.name,
      r.email,
      r.phone,
      r.region,
      r.countryName ?? getCountryByCode(r.countryCode)?.name ?? r.countryCode,
      r.courseTitle,
      r.status,
      r.provider,
      r.reference,
      formatDate(r.enrolledAt ?? r.startedAt ?? 0),
    ]);
    const csv = [headers, ...lines]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-white border border-black/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-black/5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold">Students & applicants ({filtered.length})</h2>
            <p className="text-sm text-gray-muted mt-1">
              Everyone who started checkout — enrolled after payment, or pending if MoMo was not completed.
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
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as "" | "enrolled" | "payment_pending")
              }
              className="text-sm border border-black/10 rounded-lg px-3 py-2 bg-white"
            >
              <option value="">All statuses</option>
              <option value="enrolled">Enrolled (paid)</option>
              <option value="payment_pending">Payment pending</option>
            </select>
            <button
              type="button"
              onClick={loadStudents}
              className="text-sm px-4 py-2 rounded-lg border border-black/10 hover:bg-gray-light"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={exportCsv}
              disabled={filtered.length === 0}
              className="text-sm px-4 py-2 rounded-lg border border-black/10 hover:bg-gray-light disabled:opacity-50"
            >
              Export CSV
            </button>
          </div>
        </div>

        {loading ? (
          <p className="p-8 text-center text-gray-muted">Loading…</p>
        ) : error ? (
          <p className="p-8 text-center text-red-600">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-gray-muted">
            No applications yet. They appear when someone completes the checkout form.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[960px]">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-gray-muted border-b border-black/5">
                  <th className="py-3 px-4 font-semibold">Name</th>
                  <th className="py-3 pr-4 font-semibold">Email</th>
                  <th className="py-3 pr-4 font-semibold">Phone</th>
                  <th className="py-3 pr-4 font-semibold">Region</th>
                  <th className="py-3 pr-4 font-semibold">Country</th>
                  <th className="py-3 pr-4 font-semibold">Course</th>
                  <th className="py-3 pr-4 font-semibold">Status</th>
                  <th className="py-3 pr-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Receipt email</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr
                    key={row.reference}
                    className={`border-b border-black/5 hover:bg-gray-light/50 ${
                      row.status === "enrolled" ? "cursor-pointer" : ""
                    } ${selectedReference === row.reference ? "bg-purple/5" : ""}`}
                    onClick={() => {
                      if (row.status !== "enrolled") return;
                      setSelectedReference((prev) =>
                        prev === row.reference ? "" : row.reference
                      );
                    }}
                  >
                    <td className="py-3 px-4 font-medium">{row.name}</td>
                    <td className="py-3 pr-4">
                      <a
                        href={`mailto:${row.email}`}
                        className="text-purple hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {row.email}
                      </a>
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap">{row.phone || "—"}</td>
                    <td className="py-3 pr-4">{row.region || "—"}</td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      {row.countryName ?? getCountryByCode(row.countryCode)?.name ?? row.countryCode}
                    </td>
                    <td className="py-3 pr-4">{row.courseTitle}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          row.status === "enrolled"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {row.status === "enrolled" ? "Enrolled" : "Payment pending"}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-gray-muted whitespace-nowrap">
                      {formatDate(row.enrolledAt ?? row.startedAt ?? 0)}
                    </td>
                    <td className="py-3 px-4">
                      {row.status === "enrolled" ? (
                        row.confirmationEmailSentAt ? (
                          <span className="text-green-700 text-xs font-semibold">Sent</span>
                        ) : (
                          <span className="text-amber-700 text-xs">Not sent</span>
                        )
                      ) : (
                        <span className="text-gray-muted text-xs">—</span>
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
        <h2 className="text-lg font-bold mb-1">Email enrolled students</h2>
        <p className="text-sm text-gray-muted mb-6">
          {selectedReference
            ? "Sending to the selected student."
            : filterCourse
              ? `Sending to enrolled students in this course.`
              : "Filter by course or click an enrolled row to email one person."}
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
      </section>
    </div>
  );
}
