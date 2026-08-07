// app/api/users/[id]/toggle-active/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
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
    const { is_active } = body;

    if (typeof is_active !== "boolean") {
      return NextResponse.json(
        { message: "Status is_active harus berupa boolean" },
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

    // Mencegah perubahan status akun admin/superadmin utama jika diperlukan
    if (targetUser.role === "superadmin") {
      return NextResponse.json(
        { message: "Status akun superadmin tidak dapat diubah" },
        { status: 403 }
      );
    }

    const updatedUser = await prisma.users.update({
      where: { id },
      data: { is_active },
    });

    return NextResponse.json(
      {
        message: "Status akun berhasil diperbarui",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("TOGGLE ACTIVE ERROR:", error);

    return NextResponse.json(
      { message: error.message || "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}