// app/api/profile/username/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/core/auth/session";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username")?.trim().toLowerCase();

    if (!username) {
      return NextResponse.json(
        { available: false, message: "Username wajib diisi." },
        { status: 400 }
      );
    }

    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        {
          available: false,
          message: "Username hanya boleh huruf, angka, underscore (3-20 karakter).",
        },
        { status: 200 }
      );
    }

    const existing = await prisma.users.findUnique({
      where: { username },
      select: { id: true },
    });

    if (existing && existing.id !== user.id) {
      return NextResponse.json({ available: false }, { status: 200 });
    }

    return NextResponse.json({ available: true }, { status: 200 });
  } catch (error) {
    console.error("CHECK USERNAME ERROR:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}