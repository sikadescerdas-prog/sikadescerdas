// app/api/setup/status/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/shared/utils/serializeBigInt";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const totalSuperAdmin = await prisma.users.count({
      where: {
        role: "superadmin",
      },
    });

    return NextResponse.json(
      serializeBigInt({
        initialized: totalSuperAdmin > 0,
      })
    );
  } catch (error) {
    console.error("SETUP STATUS ERROR:", error);

    return NextResponse.json(
      serializeBigInt({
        initialized: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal memeriksa status setup",
      }),
      {
        status: 500,
      }
    );
  }
}