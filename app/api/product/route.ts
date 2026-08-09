// app/api/product/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/shared/utils/serializeBigInt";

const productInclude = {
  product_categories: true,
  product_images: true,
  stores: {
    select: {
      slug: true,
      name: true,
      regency: true,
      logo_url: true,
      is_active: true,
      is_verified: true,
    },
  },
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") ?? "";
    const category = searchParams.get("category") ?? "";
    const slug = searchParams.get("slug") ?? "";
    const storeId = searchParams.get("storeId") ?? "";
    const isOwner = searchParams.get("isOwner") === "true";
    const sort = searchParams.get("sort") ?? "default";

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (isOwner && storeId) {
      where.store_id = BigInt(storeId);
    } else {
      where.is_active = true;
      where.stores = {
        is_active: true,
        is_verified: true,
      };

      if (storeId) {
        where.store_id = BigInt(storeId);
      }
    }

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (category && category !== "semua") {
      where.product_categories = {
        name: {
          equals: category,
          mode: "insensitive",
        },
      };
    }

    if (slug) {
      const product = await prisma.products.findFirst({
        where: { slug },
        include: productInclude,
      });

      if (!product) {
        return NextResponse.json(
          { message: "Produk tidak ditemukan" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        data: serializeBigInt(product),
      });
    }

    let orderBy: any = [
      { is_featured: "desc" },
      { is_active: "asc" },
      { created_at: "desc" },
    ];

    switch (sort) {
      case "newest":
        orderBy = [
          { is_featured: "desc" },
          { is_active: "asc" },
          { created_at: "desc" },
        ];
        break;

      case "oldest":
        orderBy = [
          { is_featured: "desc" },
          { is_active: "asc" },
          { created_at: "asc" },
        ];
        break;

      case "price-low":
        orderBy = [
          { is_featured: "desc" },
          { is_active: "asc" },
          { price: "asc" },
        ];
        break;

      case "price-high":
        orderBy = [
          { is_featured: "desc" },
          { is_active: "asc" },
          { price: "desc" },
        ];
        break;

      case "name":
        orderBy = [
          { is_featured: "desc" },
          { is_active: "asc" },
          { name: "asc" },
        ];
        break;
    }

    const [data, total] = await Promise.all([
      prisma.products.findMany({
        where,
        include: productInclude,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.products.count({ where }),
    ]);

    return NextResponse.json(
      serializeBigInt({
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      })
    );
  } catch (error: any) {
    console.error("GET PRODUCT ERROR:", error);

    return NextResponse.json(
      { message: error?.message ?? "Gagal mengambil produk" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      storeId,
      categoryId,
      name,
      slug,
      description,
      thumbnailUrl,
      thumbnailPublicId,
      images,
      price,
      stock,
      unit,
      weight,
      isFeatured,
      isActive,
    } = body;

    if (!storeId) {
      return NextResponse.json(
        { message: "Toko wajib dipilih" },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { message: "Nama produk wajib diisi" },
        { status: 400 }
      );
    }

    if (!thumbnailUrl) {
      return NextResponse.json(
        { message: "Gambar produk wajib diupload" },
        { status: 400 }
      );
    }

    // Menambahkan opsi maxWait dan timeout agar terhindar dari error transaction timeout
    const product = await prisma.$transaction(
      async (tx) => {
        const createdProduct = await tx.products.create({
          data: {
            store_id: BigInt(storeId),
            category_id: categoryId ? BigInt(categoryId) : null,
            name,
            slug,
            description: description ?? null,
            thumbnail_url: thumbnailUrl,
            thumbnail_public_id: thumbnailPublicId ?? null,
            price: Number(price ?? 0),
            stock: Number(stock ?? 0),
            unit: unit ?? null,
            weight: weight ? Number(weight) : null,
            is_featured: isFeatured ?? false,
            is_active: isActive ?? true,
          },
        });

        if (images?.length) {
          await tx.product_images.createMany({
            data: images.map((image: any) => ({
              product_id: createdProduct.id,
              image_url: image.url,
              image_public_id: image.publicId ?? null,
            })),
          });
        }

        return tx.products.findUnique({
          where: { id: createdProduct.id },
          include: productInclude,
        });
      },
      {
        maxWait: 10000, // Waktu maksimal menunggu antrean koneksi (10 detik)
        timeout: 20000, // Waktu maksimal proses transaksi berjalan (20 detik)
      }
    );

    return NextResponse.json(
      {
        message: "Produk berhasil dibuat",
        data: serializeBigInt(product),
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("CREATE PRODUCT ERROR:", error);

    return NextResponse.json(
      { message: error?.message ?? "Gagal membuat produk" },
      { status: 500 }
    );
  }
}