// app/api/product/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/shared/utils/serializeBigInt";
import { getCurrentUser } from "@/core/auth/session";

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

// =====================================================
// GET PRODUCT
// =====================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") ?? "";
    const category = searchParams.get("category") ?? "";
    const slug = searchParams.get("slug") ?? "";
    const storeId = searchParams.get("storeId") ?? "";
    const isOwner = searchParams.get("isOwner") === "true";
    const sort = searchParams.get("sort") ?? "default";

    const page = Math.max(
      1,
      Number.parseInt(searchParams.get("page") ?? "1", 10) || 1
    );

    const limit = Math.min(
      100,
      Math.max(
        1,
        Number.parseInt(searchParams.get("limit") ?? "10", 10) || 10
      )
    );

    const skip = (page - 1) * limit;

    const where: any = {};

    // -------------------------------------------------
    // FILTER PRODUK BERDASARKAN PEMILIK TOKO
    // -------------------------------------------------

    if (isOwner) {
      const session = await getCurrentUser();

      if (!session) {
        return NextResponse.json(
          { message: "Silakan login terlebih dahulu" },
          { status: 401 }
        );
      }

      if (session.role !== "seller") {
        return NextResponse.json(
          { message: "Akses hanya untuk seller" },
          { status: 403 }
        );
      }

      const store = await prisma.stores.findFirst({
        where: {
          owner_id: session.id,
          is_active: true,
        },
        select: {
          id: true,
        },
      });

      if (!store) {
        return NextResponse.json(
          { message: "Toko aktif milik akun ini tidak ditemukan" },
          { status: 404 }
        );
      }

      // Gunakan ID toko dari database.
      // Tidak menggunakan storeId dari frontend.
      where.store_id = store.id;
    } else {
      // Produk publik hanya menampilkan produk aktif
      // dari toko aktif dan terverifikasi.
      where.is_active = true;

      where.stores = {
        is_active: true,
        is_verified: true,
      };

      if (storeId) {
        if (!/^\d+$/.test(storeId)) {
          return NextResponse.json(
            { message: "ID toko tidak valid" },
            { status: 400 }
          );
        }

        where.store_id = BigInt(storeId);
      }
    }

    // -------------------------------------------------
    // SEARCH
    // -------------------------------------------------

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    // -------------------------------------------------
    // CATEGORY
    // -------------------------------------------------

    if (category && category !== "semua") {
      where.product_categories = {
        name: {
          equals: category,
          mode: "insensitive",
        },
      };
    }

    // -------------------------------------------------
    // PRODUCT DETAIL BY SLUG
    // -------------------------------------------------

    if (slug) {
      const productWhere: any = {
        slug,
      };

      if (isOwner) {
        Object.assign(productWhere, where);
      } else {
        productWhere.is_active = true;
        productWhere.stores = {
          is_active: true,
          is_verified: true,
        };
      }

      const product = await prisma.products.findFirst({
        where: productWhere,
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

    // -------------------------------------------------
    // SORT
    // -------------------------------------------------

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

    // -------------------------------------------------
    // FETCH PRODUCTS
    // -------------------------------------------------

    const [data, total] = await Promise.all([
      prisma.products.findMany({
        where,
        include: productInclude,
        orderBy,
        skip,
        take: limit,
      }),

      prisma.products.count({
        where,
      }),
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
      {
        message: error?.message ?? "Gagal mengambil produk",
      },
      { status: 500 }
    );
  }
}

// =====================================================
// CREATE PRODUCT
// =====================================================

export async function POST(request: NextRequest) {
  try {
    // 1. Verifikasi sesi pengguna.
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    // 2. Pastikan pengguna adalah seller.
    if (session.role !== "seller") {
      return NextResponse.json(
        { message: "Hanya seller yang dapat menambahkan produk" },
        { status: 403 }
      );
    }

    // 3. Ambil data request.
    const body = await request.json();

    const {
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

    // storeId dari frontend tidak digunakan.
    // ID toko diambil berdasarkan pemilik sesi.

    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { message: "Nama produk wajib diisi" },
        { status: 400 }
      );
    }

    if (
      typeof thumbnailUrl !== "string" ||
      !thumbnailUrl.trim()
    ) {
      return NextResponse.json(
        { message: "Gambar produk wajib diupload" },
        { status: 400 }
      );
    }

    let parsedCategoryId: bigint | null = null;

    if (
      categoryId !== null &&
      categoryId !== undefined &&
      categoryId !== ""
    ) {
      if (
        !/^\d+$/.test(String(categoryId)) ||
        BigInt(categoryId) <= BigInt(0)
      ) {
        return NextResponse.json(
          { message: "Kategori produk tidak valid" },
          { status: 400 }
        );
      }

      parsedCategoryId = BigInt(categoryId);
    }

    const parsedPrice = Number(price ?? 0);
    const parsedStock = Number(stock ?? 0);

    const parsedWeight =
      weight !== null &&
      weight !== undefined &&
      weight !== ""
        ? Number(weight)
        : null;

    if (
      !Number.isFinite(parsedPrice) ||
      parsedPrice < 0 ||
      !Number.isFinite(parsedStock) ||
      parsedStock < 0 ||
      (parsedWeight !== null &&
        (!Number.isFinite(parsedWeight) || parsedWeight < 0))
    ) {
      return NextResponse.json(
        {
          message: "Harga, stok, atau berat produk tidak valid",
        },
        { status: 400 }
      );
    }

    // -------------------------------------------------
    // FIND STORE BY LOGGED-IN SELLER
    // -------------------------------------------------

    const store = await prisma.stores.findFirst({
      where: {
        owner_id: session.id,
        is_active: true,
      },
      select: {
        id: true,
        name: true,
        owner_id: true,
      },
    });

    if (!store) {
      return NextResponse.json(
        {
          message: "Toko aktif milik akun ini tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // -------------------------------------------------
    // CREATE PRODUCT TRANSACTION
    // -------------------------------------------------

    const product = await prisma.$transaction(
      async (tx) => {
        const createdProduct = await tx.products.create({
          data: {
            // ID toko berasal dari database.
            // Bukan dari storeId frontend.
            store_id: store.id,

            category_id: parsedCategoryId,

            name: name.trim(),
            slug,
            description: description ?? null,

            thumbnail_url: thumbnailUrl,
            thumbnail_public_id: thumbnailPublicId ?? null,

            price: parsedPrice,
            stock: parsedStock,

            unit: unit ?? null,
            weight: parsedWeight,

            is_featured: isFeatured ?? false,
            is_active: isActive ?? true,
          },
        });

        // Simpan gambar galeri.
        if (Array.isArray(images) && images.length > 0) {
          await tx.product_images.createMany({
            data: images.map((image: any) => ({
              product_id: createdProduct.id,
              image_url: image.url,
              image_public_id: image.publicId ?? null,
            })),
          });
        }

        // Ambil kembali produk beserta relasinya.
        return tx.products.findUnique({
          where: {
            id: createdProduct.id,
          },
          include: productInclude,
        });
      },
      {
        maxWait: 10000,
        timeout: 20000,
      }
    );

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return NextResponse.json(
      {
        message: "Produk berhasil dibuat",
        store: {
          id: String(store.id),
          name: store.name,
        },
        data: serializeBigInt(product),
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("CREATE PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        message: error?.message ?? "Gagal membuat produk",
      },
      { status: 500 }
    );
  }
}