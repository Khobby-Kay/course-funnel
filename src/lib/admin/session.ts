import "server-only";

import { verifyAdminToken } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseAuthConfigured } from "@/lib/supabase/config";

function getAllowedAdminEmail(): string | null {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return email || null;
}

export async function isAdminAuthenticated(
  adminCookie: string | undefined
): Promise<boolean> {
  if (await verifyAdminToken(adminCookie)) {
    return true;
  }

  if (!isSupabaseAuthConfigured()) {
    return false;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user?.email) {
      return false;
    }

    const allowed = getAllowedAdminEmail();
    if (allowed && user.email.toLowerCase() !== allowed) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
