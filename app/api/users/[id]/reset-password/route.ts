// app/api/users/[id]/reset-password/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validatePassword } from "@/core/auth/helpers/password";
import { hashPassword } from "@/core/auth/hash";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json(
        { message: "ID pengguna tidak valid" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { newPassword } = body;

    const passwordResult = validatePassword(newPassword);
    if (!passwordResult.ok) {
      return NextResponse.json(
        { message: passwordResult.error },
        { status: 400 }
      );
    }

    const targetUser = await prisma.users.findUnique({
      where: { id },
      select: { id: true, role: true },
    });

    if (!targetUser) {
      return NextResponse.json(
        { message: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }

    if (targetUser.role === "admin" || targetUser.role === "superadmin") {
      return NextResponse.json(
        { message: "Sandi akun admin atau superadmin tidak dapat direset" },
        { status: 403 }
      );
    }

    const passwordHash = await hashPassword(newPassword);

    await prisma.users.update({
      where: { id },
      data: {
        password_hash: passwordHash,
      },
    });

    return NextResponse.json(
      { message: "Sandi berhasil direset" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("RESET PASSWORD ERROR:", error);

    return NextResponse.json(
      { message: error.message || "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}