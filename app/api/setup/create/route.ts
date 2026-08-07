// app/api/setup/create/route.ts

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
       CEK SUDAH SETUP?
    ========================= */
    const superAdminExists = await prisma.users.findFirst({
      where: {
        role: "superadmin",
      },
      select: {
        id: true,
      },
    });

    if (superAdminExists) {
      return NextResponse.json(
        {
          message: "Setup sudah dilakukan.",
        },
        {
          status: 409,
        }
      );
    }

    /* =========================
       VALIDATE EMAIL
    ========================= */
    const emailResult = validateEmail(email);

    if (!emailResult.ok) {
      return NextResponse.json(
        {
          message: emailResult.error,
        },
        {
          status: 400,
        }
      );
    }

    const cleanEmail = sanitizeEmail(email);

    /* =========================
       VALIDATE USERNAME
    ========================= */
    const cleanUsername = sanitizeUsername(username ?? "");

    const usernameResult = validateUsername(cleanUsername);

    if (!usernameResult.ok) {
      return NextResponse.json(
        {
          message: usernameResult.error,
        },
        {
          status: 400,
        }
      );
    }

    /* =========================
       VALIDATE FULLNAME
    ========================= */
    if (!fullname || fullname.trim().length < 3) {
      return NextResponse.json(
        {
          message: "Nama lengkap minimal 3 karakter",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================
       VALIDATE PASSWORD
    ========================= */
    const passwordResult = validatePassword(password);

    if (!passwordResult.ok) {
      return NextResponse.json(
        {
          message: passwordResult.error,
        },
        {
          status: 400,
        }
      );
    }

    /* =========================
       CHECK EMAIL
    ========================= */
    const emailExists = await prisma.users.findUnique({
      where: {
        email: cleanEmail,
      },
      select: {
        id: true,
      },
    });

    if (emailExists) {
      return NextResponse.json(
        {
          message: "Email sudah digunakan",
        },
        {
          status: 409,
        }
      );
    }

    /* =========================
       CHECK USERNAME
    ========================= */
    const usernameExists = await prisma.users.findUnique({
      where: {
        username: cleanUsername,
      },
      select: {
        id: true,
      },
    });

    if (usernameExists) {
      return NextResponse.json(
        {
          message: "Username sudah digunakan",
        },
        {
          status: 409,
        }
      );
    }

    /* =========================
       HASH PASSWORD
    ========================= */
    const passwordHash = await hashPassword(password);

    /* =========================
       CREATE SUPER ADMIN
    ========================= */
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.users.create({
        data: {
          id: crypto.randomUUID(),
          email: cleanEmail,
          username: cleanUsername,
          password_hash: passwordHash,
          role: "superadmin",
          is_active: true,
        },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
        },
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
      {
        message: "Setup berhasil. Super Administrator berhasil dibuat.",
        user,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    console.error("SETUP ERROR:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        {
          message: "Email atau username sudah digunakan",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Terjadi kesalahan server",
      },
      {
        status: 500,
      }
    );
  }
}