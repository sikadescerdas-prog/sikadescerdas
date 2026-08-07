// app/api/users/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { message: "ID pengguna tidak valid." },
        { status: 400 }
      );
    }

    // Cek apakah user yang ingin dihapus ada di database
    const targetUser = await prisma.users.findUnique({
      where: { id: id },
      select: { id: true, role: true },
    });

    if (!targetUser) {
      return NextResponse.json(
        { message: "Pengguna tidak ditemukan." },
        { status: 404 }
      );
    }

    // Mencegah penghapusan akun superadmin
    if (targetUser.role === "superadmin") {
      return NextResponse.json(
        { message: "Akun Superadmin tidak dapat dihapus." },
        { status: 403 }
      );
    }

    // Eksekusi penghapusan menggunakan Prisma Transaction
    await prisma.$transaction(async (tx) => {
      // Hapus profil terkait terlebih dahulu (jika relasi menggunakan user_id)
      await tx.profiles.deleteMany({
        where: { user_id: id },
      });

      // Hapus data utama user
      await tx.users.delete({
        where: { id: id },
      });
    });

    return NextResponse.json(
      { message: "Akun berhasil dihapus." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE USER ERROR:", error);
    return NextResponse.json(
      { message: error.message || "Terjadi kesalahan server saat menghapus akun." },
      { status: 500 }
    );
  }
}