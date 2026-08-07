// app/api/auth/update-password/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/core/auth/session";
import { validatePassword } from "@/core/auth/helpers/password";
import { verifyPassword, hashPassword } from "@/core/auth/hash";

export async function PUT(request: Request) {
  try {
    // 1. Cek sesi/user yang sedang login menggunakan getCurrentUser
    const userSession = await getCurrentUser();
    if (!userSession || !userSession.id) {
      return NextResponse.json(
        { message: "Unauthorized - Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPasswordHash, newPasswordHash } = body;

    if (!currentPasswordHash || !newPasswordHash) {
      return NextResponse.json(
        { message: "Data sandi tidak lengkap" },
        { status: 400 }
      );
    }

    // 2. Ambil data user dari database
    const user = await prisma.users.findUnique({
      where: { id: userSession.id },
      select: { id: true, password_hash: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    // 3. Verifikasi sandi saat ini
    const isPasswordValid = await verifyPassword(currentPasswordHash, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Sandi saat ini salah" },
        { status: 400 }
      );
    }

    // 4. Validasi kekuatan password baru
    const passwordResult = validatePassword(newPasswordHash);
    if (!passwordResult.ok) {
      return NextResponse.json(
        { message: passwordResult.error },
        { status: 400 }
      );
    }

    // 5. Hash password baru
    const newPasswordHashed = await hashPassword(newPasswordHash);

    // 6. Update ke database
    await prisma.users.update({
      where: { id: userSession.id },
      data: { password_hash: newPasswordHashed },
    });

    return NextResponse.json(
      { message: "Sandi berhasil diperbarui" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("UPDATE_PASSWORD_ERROR:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}