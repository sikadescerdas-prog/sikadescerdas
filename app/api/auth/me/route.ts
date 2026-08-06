// app/api/auth/me/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/core/auth/session";

export async function GET() {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json(
        { user: null },
        { status: 401 }
      );
    }

    const user = await prisma.users.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        profiles: {
          select: {
            fullname: true,
            avatar_url: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { user: null },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullname: user.profiles?.fullname ?? "",
        avatar: user.profiles?.avatar_url ?? null,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("ME ERROR:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}