// app/api/upload/cloudinary/route.ts

import { NextResponse } from "next/server";
import {
  uploadToCloudinary,
  uploadPdfToCloudinary,
  deleteFromCloudinary,
  deletePdfFromCloudinary,
} from "@/shared/services/cloudinary.service";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder");
    const publicId = formData.get("publicId");
    const type = formData.get("type");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "File tidak ditemukan" },
        { status: 400 }
      );
    }

    const uploadFolder = typeof folder === "string" && folder.trim() ? folder.trim() : "uploads";
    const uploadPublicId = typeof publicId === "string" && publicId.trim() ? publicId.trim() : undefined;
    const buffer = Buffer.from(await file.arrayBuffer());

    if (type === "pdf") {
      if (file.type !== "application/pdf") {
        return NextResponse.json(
          { success: false, message: "File harus berupa PDF" },
          { status: 400 }
        );
      }

      const maxSize = 10 * 1024 * 1024;

      if (file.size > maxSize) {
        return NextResponse.json(
          { success: false, message: "Ukuran PDF maksimal 10 MB" },
          { status: 400 }
        );
      }

      const uploaded = await uploadPdfToCloudinary(buffer, uploadFolder, uploadPublicId);

      return NextResponse.json({
        success: true,
        data: uploaded,
      });
    }

    if (file.type.startsWith("image/") === false) {
      return NextResponse.json(
        { success: false, message: "File harus berupa gambar" },
        { status: 400 }
      );
    }

    const imageType = type === "logo" ? "logo" : "banner";
    const uploaded = await uploadToCloudinary(buffer, uploadFolder, uploadPublicId, imageType);

    return NextResponse.json({
      success: true,
      data: uploaded,
    });
  } catch (error) {
    console.error("UPLOAD CLOUDINARY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Upload gagal",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const publicId = body?.publicId;
    const type = body?.type;

    if (!publicId || typeof publicId !== "string") {
      return NextResponse.json(
        { success: false, message: "Public ID kosong" },
        { status: 400 }
      );
    }

    if (type === "pdf") {
      const result = await deletePdfFromCloudinary(publicId);

      if (result.result !== "ok" && result.result !== "not found") {
        return NextResponse.json(
          { success: false, message: "Gagal menghapus PDF" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "PDF berhasil dihapus",
      });
    }

    await deleteFromCloudinary(publicId);

    return NextResponse.json({
      success: true,
      message: "Berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE CLOUDINARY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Hapus gagal",
      },
      { status: 500 }
    );
  }
}