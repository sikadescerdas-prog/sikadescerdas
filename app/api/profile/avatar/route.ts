// app/api/profile/avatar/route.ts

import { NextResponse } from "next/server";
import type { UploadApiResponse } from "cloudinary";

import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { getCurrentUser } from "@/core/auth/session";

/* =========================
   UPLOAD AVATAR
========================= */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "File avatar tidak ditemukan" },
        { status: 400 }
      );
    }

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "File harus berupa gambar" },
        { status: 400 }
      );
    }

    // Batas ukuran 2MB
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Ukuran gambar maksimal 2MB" },
        { status: 400 }
      );
    }

    const profile = await prisma.profiles.findUnique({
      where: { user_id: user.id },
      select: { avatar_public_id: true },
    });

    // Hapus gambar lama jika ada
    if (profile?.avatar_public_id) {
      await cloudinary.uploader.destroy(profile.avatar_public_id);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "/profile",
            public_id: `${user.id}_avatar`,
            overwrite: true,
            transformation: [
              {
                width: 500,
                height: 500,
                crop: "fill",
                gravity: "face",
              },
            ],
          },
          (error, result) => {
            if (error || !result) {
              reject(error ?? new Error("Upload stream failed"));
              return;
            }
            resolve(result);
          }
        );

        uploadStream.end(buffer);
      }
    );

    await prisma.profiles.update({
      where: { user_id: user.id },
      data: {
        avatar_url: uploadResult.secure_url,
        avatar_public_id: uploadResult.public_id,
      },
    });

    return NextResponse.json(
      {
        message: "Avatar berhasil diperbarui",
        avatarUrl: uploadResult.secure_url,
        avatarPublicId: uploadResult.public_id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPLOAD AVATAR ERROR:", error);

    return NextResponse.json(
      { message: "Upload avatar gagal" },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE AVATAR
========================= */
export async function DELETE() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const profile = await prisma.profiles.findUnique({
      where: { user_id: user.id },
      select: { avatar_public_id: true },
    });

    if (profile?.avatar_public_id) {
      await cloudinary.uploader.destroy(profile.avatar_public_id);
    }

    await prisma.profiles.update({
      where: { user_id: user.id },
      data: {
        avatar_url: null,
        avatar_public_id: null,
      },
    });

    return NextResponse.json(
      { message: "Avatar berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE AVATAR ERROR:", error);

    return NextResponse.json(
      { message: "Gagal menghapus avatar" },
      { status: 500 }
    );
  }
}