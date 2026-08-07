// app/api/auth/login/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword } from "@/core/auth/hash";
import { signToken } from "@/core/auth/jwt";
import { setSession } from "@/core/auth/session";
import type { UserRole } from "@/core/auth/types/user.types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    // Validasi input wajib
    if (!identifier || !password) {
      return NextResponse.json(
        { message: "Email/Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    const value = identifier.trim().toLowerCase();

    // Cari user berdasarkan email atau username
    const user = await prisma.users.findFirst({
      where: {
        OR: [{ email: value }, { username: value }],
      },
      select: {
        id: true,
        email: true,
        username: true,
        password_hash: true,
        role: true,
        is_active: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Email/Username atau password salah" },
        { status: 401 }
      );
    }

    // Cek apakah akun aktif
    if (!user.is_active) {
      return NextResponse.json(
        { message: "Akun telah dinonaktifkan, silahkan hubungi admin" },
        { status: 403 }
      );
    }

    // Verifikasi password
    const passwordMatch = await verifyPassword(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Email/Username atau password salah" },
        { status: 401 }
      );
    }

    // Update waktu login terakhir
    await prisma.users.update({
      where: { id: user.id },
      data: { last_login_at: new Date() },
    });

    // Generate JWT token & set session
    const token = signToken({
      id: user.id,
      role: user.role as UserRole,
    });

    await setSession(token);

    return NextResponse.json(
      {
        message: "Login berhasil",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}