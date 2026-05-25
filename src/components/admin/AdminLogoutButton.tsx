"use client";

import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
        router.push("/admin/login");
        router.refresh();
      }}
      className="text-sm px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10"
    >
      Sign out
    </button>
  );
}
