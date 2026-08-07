// proxy.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyTokenEdge } from "@/core/auth/jwt-edge";

const COOKIE_NAME = "sikades_token";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  const isSetupPage = pathname.startsWith("/setup");
  const isAuthPage =
    pathname === "/login" || pathname === "/register";
  const isDashboard = pathname.startsWith("/dashboard");

  // =====================
  // SETUP
  // =====================
  if (isSetupPage) {
    try {
      const res = await fetch(
        `${request.nextUrl.origin}/api/setup/status`,
        {
          cache: "no-store",
        }
      );

      if (res.ok) {
        const { initialized } = await res.json();

        if (initialized) {
          return NextResponse.redirect(
            new URL("/login", request.url)
          );
        }
      }
    } catch (error) {
      console.error("Setup check error:", error);
    }
  }

  // =====================
  // LOGIN / REGISTER
  // =====================
  if (isAuthPage) {
    if (token) {
      const user = await verifyTokenEdge(token);

      if (user) {
        return NextResponse.redirect(
          new URL("/", request.url)
        );
      }
    }

    return NextResponse.next();
  }

  // =====================
  // DASHBOARD
  // =====================
  if (isDashboard) {
    if (!token) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
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

    // Hanya admin & superadmin yang boleh masuk dashboard secara umum
    if (
      user.role !== "admin" &&
      user.role !== "superadmin"
    ) {
      return NextResponse.redirect(
        new URL("/", request.url)
      );
    }

    // ==========================================
    // PROTEKSI KHUSUS HALAMAN FORM TAMBAH ADMIN
    // ==========================================
    // Jika path diawali dengan /dashboard/users/form (atau sesuai rute Anda),
    // batasi hanya untuk superadmin.
    if (
      pathname.startsWith("/dashboard/users/form") &&
      user.role !== "superadmin"
    ) {
      return NextResponse.redirect(
        new URL("/dashboard", request.url) // Alihkan kembali ke dashboard utama jika bukan superadmin
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/setup",
    "/dashboard/:path*",
  ],
};