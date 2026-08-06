// app/api/auth/logout/route.ts

import { NextResponse } from "next/server";
import { clearSession } from "@/core/auth/session";

export async function POST() {
  try {
    await clearSession();

    return NextResponse.json(
      { message: "Logout berhasil" },
      { status: 200 }
    );
  } catch (error) {
    console.error("LOGOUT ERROR:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}