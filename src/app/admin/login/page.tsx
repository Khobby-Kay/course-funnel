"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function AdminLoginForm({ from }: { from: string }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        const hint =
          response.status === 401
            ? " Wrong password, or the dev server still has an old ADMIN_PASSWORD — stop npm run dev and start it again after editing .env.local."
            : "";
        throw new Error((data.error ?? "Login failed") + hint);
      }

      window.location.assign(from);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-light flex items-center justify-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white border border-black/10 shadow-xl p-8"
      >
        <h1 className="text-2xl font-bold text-black mb-1">Admin sign in</h1>
        <p className="text-gray-muted text-sm mb-6">
          Manage courses, media, and publishing
        </p>

        {error && (
          <p className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm" role="alert">
            {error}
          </p>
        )}

        <label className="block mb-6">
          <span className="text-sm font-medium text-black">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="mt-2 w-full px-4 py-3 rounded-xl border border-black/15 bg-white text-black focus:border-purple focus:ring-2 focus:ring-purple/20 focus:outline-none"
            autoComplete="current-password"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-purple text-white font-semibold hover:bg-purple-light disabled:opacity-50 transition-colors"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <p className="text-xs text-gray-muted mt-6 text-center leading-relaxed">
          Password is <code className="font-mono text-black/80 bg-black/5 px-1 rounded">ADMIN_PASSWORD</code> in{" "}
          <code className="font-mono text-black/80 bg-black/5 px-1 rounded">.env.local</code>.
          After changing it, restart <code className="font-mono">npm run dev</code>.
        </p>
      </form>
    </main>
  );
}

function AdminLoginWithSearchParams() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";
  return <AdminLoginForm from={from} />;
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<AdminLoginForm from="/admin" />}>
      <AdminLoginWithSearchParams />
    </Suspense>
  );
}
