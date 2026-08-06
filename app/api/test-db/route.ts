// app/api/test-db/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const village = await prisma.villages.findFirst();

    return NextResponse.json({
      success: true,
      message: "Database Supabase CONNECTED",
      data: village,
    });
  } catch (error) {
    console.error("DATABASE TEST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Database FAILED",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    );
  }
}