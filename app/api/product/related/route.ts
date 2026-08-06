// app/api/product/related/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/shared/utils/serializeBigInt";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get("storeId");
    const productId = searchParams.get("productId");

    if (!storeId) {
      return NextResponse.json({ data: [] });
    }

    const products = await prisma.products.findMany({
      where: {
        store_id: BigInt(storeId),
        is_active: true,
        ...(productId && { NOT: { id: BigInt(productId) } }),
      },
      take: 8,
      orderBy: { created_at: "desc" },
      include: {
        product_categories: true,
        stores: {
          select: {
            name: true,
            slug: true,
            regency: true,
          },
        },
      },
    });

    const data = products.map((product: any) => ({
      id: String(product.id),
      storeId: String(product.store_id),
      storeName: product.stores?.name ?? null,
      storeSlug: product.stores?.slug ?? null,
      storeCity: product.stores?.regency ?? null,
      name: product.name,
      slug: product.slug,
      thumbnailUrl: product.thumbnail_url,
      price: Number(product.price),
      stock: Number(product.stock),
      category: {
        name: product.product_categories?.name ?? "Umum",
      },
    }));

    return NextResponse.json(serializeBigInt({ data }));
  } catch (error) {
    console.error("GET RELATED PRODUCT ERROR:", error);

    return NextResponse.json(
      { message: "Gagal mengambil produk lainnya" },
      { status: 500 }
    );
  }
}