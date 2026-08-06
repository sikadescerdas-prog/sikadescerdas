// app/api/product/categories/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.product_categories.findMany({
      where: { is_active: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });

    return NextResponse.json({
      code: "PRODUCT_CATEGORIES_FOUND",
      message: "Kategori produk berhasil diambil.",
      categories: categories.map((category) => ({
        id: category.id.toString(),
        name: category.name,
      })),
    });
  } catch (error) {
    console.error("[PRODUCT_CATEGORIES_GET_ERROR]:", error);

    return NextResponse.json(
      {
        code: "PRODUCT_CATEGORIES_ERROR",
        message: "Gagal mengambil kategori produk.",
      },
      { status: 500 }
    );
  }
}