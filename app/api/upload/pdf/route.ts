// app/api/upload/cloudinary/pdf/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  uploadPdfToCloudinary,
  deletePdfFromCloudinary,
} from "@/shared/services/cloudinary.service";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder");
    const publicId = formData.get("publicId");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "File PDF wajib dipilih" },
        { status: 400 }
      );
    }

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

    const uploadFolder = typeof folder === "string" && folder.trim() ? folder : "literature/books";
    const uploadPublicId = typeof publicId === "string" && publicId.trim() ? publicId : undefined;
    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await uploadPdfToCloudinary(buffer, uploadFolder, uploadPublicId);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("UPLOAD PDF ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Upload PDF gagal",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const publicId = body?.publicId;

    if (!publicId || typeof publicId !== "string") {
      return NextResponse.json(
        { success: false, message: "Public ID PDF wajib diisi" },
        { status: 400 }
      );
    }

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
  } catch (error) {
    console.error("DELETE PDF ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Hapus PDF gagal",
      },
      { status: 500 }
    );
  }
}