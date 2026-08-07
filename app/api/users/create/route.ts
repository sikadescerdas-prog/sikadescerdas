// app/api/users/create/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateEmail, sanitizeEmail } from "@/core/auth/helpers/email";
import {
  validateUsername,
  sanitizeUsername,
} from "@/core/auth/helpers/username";
import { validatePassword } from "@/core/auth/helpers/password";
import { hashPassword } from "@/core/auth/hash";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, username, fullname, password } = body;

    /* =========================
       VALIDASI (Sama seperti sebelumnya)
    ========================= */
    const emailResult = validateEmail(email);
    if (!emailResult.ok) return NextResponse.json({ message: emailResult.error }, { status: 400 });
    
    const cleanEmail = sanitizeEmail(email);
    const cleanUsername = sanitizeUsername(username ?? "");
    const usernameResult = validateUsername(cleanUsername);
    if (!usernameResult.ok) return NextResponse.json({ message: usernameResult.error }, { status: 400 });

    if (!fullname || fullname.trim().length < 3) {
      return NextResponse.json({ message: "Nama lengkap minimal 3 karakter" }, { status: 400 });
    }

    const passwordResult = validatePassword(password);
    if (!passwordResult.ok) return NextResponse.json({ message: passwordResult.error }, { status: 400 });

    /* =========================
       CEK DUPLIKASI
    ========================= */
    const existing = await prisma.users.findFirst({
      where: { OR: [{ email: cleanEmail }, { username: cleanUsername }] },
    });
    if (existing) {
      return NextResponse.json({ message: "Email atau username sudah digunakan" }, { status: 409 });
    }

    /* =========================
       PROSES CREATE (Tanpa Token)
    ========================= */
    const passwordHash = await hashPassword(password);

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.users.create({
        data: {
          id: crypto.randomUUID(),
          email: cleanEmail,
          username: cleanUsername,
          password_hash: passwordHash,
          role: "admin", // Hardcoded jadi admin
          is_active: true,
        },
        select: { id: true, email: true, username: true, role: true },
      });

      await tx.profiles.create({
        data: {
          user_id: newUser.id,
          fullname: fullname.trim(),
        },
      });

      return newUser;
    });

    return NextResponse.json(
      { message: "Admin Desa berhasil dibuat.", user },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("CREATE ADMIN ERROR:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}