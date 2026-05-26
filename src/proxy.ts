import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_COOKIE, hasAccessToCourse, hasValidAccess } from "@/lib/access";
import { isAdminAuthenticated } from "@/lib/admin/session";
import { createSupabaseProxyClient } from "@/lib/supabase/proxy";
import { isSupabaseAuthConfigured } from "@/lib/supabase/config";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const isLogin = pathname === "/admin/login" || pathname === "/api/admin/login";

    let response = NextResponse.next({ request });

    if (isSupabaseAuthConfigured()) {
      const { supabase, response: supabaseResponse } = createSupabaseProxyClient(request);
      response = supabaseResponse;
      if (supabase) {
        await supabase.auth.getUser();
      }
    }

    if (!isLogin) {
      const adminCookie = request.cookies.get("admin_session")?.value;
      if (!(await isAdminAuthenticated(adminCookie))) {
        if (pathname.startsWith("/api/admin")) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        url.searchParams.set("from", pathname);
        return NextResponse.redirect(url);
      }
    }

    return response;
  }

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ACCESS_COOKIE)?.value;

  if (pathname === "/dashboard" || pathname === "/dashboard/") {
    if (!(await hasValidAccess(token))) {
      const url = request.nextUrl.clone();
      url.pathname = "/access";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const slug = pathname.split("/")[2];
  if (!slug) {
    return NextResponse.next();
  }

  if (!(await hasAccessToCourse(token, slug))) {
    const url = request.nextUrl.clone();
    url.pathname = "/access";
    url.searchParams.set("from", pathname);
    url.searchParams.set("course", slug);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/admin", "/admin/:path*", "/api/admin/:path*"],
};
