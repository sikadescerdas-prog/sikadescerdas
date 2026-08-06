// app/api/literature/categories/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/core/auth/session";
import { serializeBigInt } from "@/shared/utils/serializeBigInt";

export async function GET() {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const categories = await prisma.literature_categories.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(serializeBigInt(categories), { status: 200 });
  } catch (error) {
    console.error("GET LITERATURE CATEGORIES ERROR:", error);

    return NextResponse.json(
      { message: "Gagal mengambil kategori literasi" },
      { status: 500 }
    );
  }
}