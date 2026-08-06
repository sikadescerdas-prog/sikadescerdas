// app/api/dashboard/umkm/verify/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/shared/utils/serializeBigInt";

export async function PATCH(request: Request) {
  try {
    const { ownerUid, isVerified } = await request.json();

    if (!ownerUid) {
      return NextResponse.json(
        { message: "Owner UID diperlukan" }, 
        { status: 400 }
      );
    }

    const targetVerified: boolean = Boolean(isVerified);
    const targetActive: boolean = targetVerified ? true : false;

    const updatedStore = await prisma.stores.update({
      where: { owner_id: ownerUid },
      data: {
        is_verified: targetVerified,
        is_active: targetActive,
      },
    });

    return NextResponse.json(
      serializeBigInt({
        success: true,
        message: "Status verifikasi berhasil diubah",
        store: updatedStore,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error /verify:", error);
    return NextResponse.json(
      { message: "Gagal memperbarui status verifikasi di database" },
      { status: 500 }
    );
  }
}