import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_COOKIE, hasAccessToCourse, hasValidAccess } from "@/lib/access";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const isLogin = pathname === "/admin/login" || pathname === "/api/admin/login";

    if (!isLogin) {
      const token = request.cookies.get(ADMIN_COOKIE)?.value;
      if (!(await verifyAdminToken(token))) {
        if (pathname.startsWith("/api/admin")) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        url.searchParams.set("from", pathname);
        return NextResponse.redirect(url);
      }
    }
    return NextResponse.next();
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
