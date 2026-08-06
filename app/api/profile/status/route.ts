// app/api/profile/status/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/core/auth/session";

export async function GET() {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json(
        {
          code: "UNAUTHORIZED",
          message: "Silakan login terlebih dahulu.",
        },
        { status: 401 }
      );
    }

    const profile = await prisma.profiles.findUnique({
      where: { user_id: session.id },
      select: { is_completed: true },
    });

    if (!profile) {
      return NextResponse.json(
        {
          code: "PROFILE_NOT_FOUND",
          message: "Profile tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      code: "PROFILE_STATUS",
      is_completed: profile.is_completed,
    });
  } catch (error) {
    console.error("[PROFILE_STATUS_ERROR]:", error);

    return NextResponse.json(
      {
        code: "PROFILE_STATUS_ERROR",
        message: "Gagal mengambil status profile.",
      },
      { status: 500 }
    );
  }
}