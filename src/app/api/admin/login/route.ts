import { NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_MAX_AGE, createAdminToken, verifyAdminPassword } from "@/lib/admin/auth";

type Body = { password?: string };

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const password = body.password?.trim();

    if (!password || !verifyAdminPassword(password)) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = await createAdminToken();
    const response = NextResponse.json({ ok: true });

    response.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ADMIN_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Login failed. Set ADMIN_PASSWORD in .env.local (local) or Vercel env vars.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
