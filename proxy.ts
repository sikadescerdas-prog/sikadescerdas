// proxy.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyTokenEdge } from "@/core/auth/jwt-edge";

const COOKIE_NAME = "sikades_token";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  const isAuthPage =
    pathname === "/login" || pathname === "/register";

  const isDashboard = pathname.startsWith("/dashboard");

  // =====================
  // LOGIN / REGISTER
  // =====================
  if (isAuthPage) {
    if (token) {
      const user = await verifyTokenEdge(token);

      if (user) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    return NextResponse.next();
  }

  // =====================
  // DASHBOARD
  // =====================
  if (isDashboard) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const user = await verifyTokenEdge(token);

    // Token tidak valid
    if (!user) {
      const response = NextResponse.redirect(
        new URL("/login", request.url)
      );

      response.cookies.delete(COOKIE_NAME);

      return response;
    }

    const role = user.role;

    // Hanya admin & superadmin
    if (role !== "admin" && role !== "superadmin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/dashboard/:path*",
  ],
};