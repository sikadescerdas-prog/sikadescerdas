// app/api/check-username/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sanitizeUsername, validateUsername } from "@/core/auth/helpers/username";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = sanitizeUsername(body.username ?? "");

    // Username kosong
    if (!username) {
      return NextResponse.json({
        exists: false,
      });
    }

    // Validasi format username
    const validation = validateUsername(username);
    if (!validation.ok) {
      return NextResponse.json({
        exists: false,
        message: validation.error,
      });
    }

    // Cek keberadaan username di database
    const user = await prisma.users.findUnique({
      where: { username },
      select: { id: true },
    });

    return NextResponse.json({
      exists: Boolean(user),
    });
  } catch (error) {
    console.error("CHECK USERNAME ERROR:", error);

    return NextResponse.json(
      {
        message: "Server error",
        exists: false,
      },
      { status: 500 }
    );
  }
}