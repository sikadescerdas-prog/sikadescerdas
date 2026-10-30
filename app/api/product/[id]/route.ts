// app/api/product/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/core/auth/session";
import { serializeBigInt } from "@/shared/utils/serializeBigInt";
import { deleteFromCloudinary } from "@/shared/services/cloudinary.service";

// =====================================================
// PRODUCT INCLUDE
// =====================================================

const productInclude = {
  product_categories: true,
  product_images: true,
  stores: {
    select: {
      name: true,
      slug: true,
      logo_url: true,
      regency: true,
      is_active: true,
      is_verified: true,
    },
  },
};

// =====================================================
// MAP PRODUCT
// =====================================================

function mapProduct(product: any) {
  return {
    id: String(product.id),
    storeId: String(product.store_id),
    storeName: product.stores?.name ?? null,
    storeSlug: product.stores?.slug ?? null,
    storeLogo: product.stores?.logo_url ?? null,
    storeRegency: product.stores?.regency ?? null,

    categoryId: product.category_id
      ? String(product.category_id)
      : null,

    category: product.product_categories?.name ?? null,

    name: product.name,
    slug: product.slug,
    description: product.description,

    thumbnailUrl: product.thumbnail_url,
    thumbnailPublicId: product.thumbnail_public_id,

    price: Number(product.price),
    stock: Number(product.stock),
    unit: product.unit,

    weight:
      product.weight !== null
        ? Number(product.weight)
        : null,

    isFeatured: product.is_featured,
    isActive: product.is_active,

    createdAt: product.created_at,
    updatedAt: product.updated_at,

    images:
      product.product_images?.map((item: any) => ({
        id: String(item.id),
        url: item.image_url,
        publicId: item.image_public_id,
      })) ?? [],
  };
}

// =====================================================
// HELPER: GET SELLER STORE
// =====================================================

async function getSellerStore() {
  const session = await getCurrentUser();

  if (!session) {
    return {
      error: NextResponse.json(
        { message: "Silakan login terlebih dahulu" },
        { status: 401 }
      ),
      store: null,
    };
  }

  if (session.role !== "seller") {
    return {
      error: NextResponse.json(
        { message: "Akses hanya untuk seller" },
        { status: 403 }
      ),
      store: null,
    };
  }

  const store = await prisma.stores.findFirst({
    where: {
      owner_id: session.id,
      is_active: true,
    },
    select: {
      id: true,
      owner_id: true,
      name: true,
    },
  });

  if (!store) {
    return {
      error: NextResponse.json(
        { message: "Toko aktif tidak ditemukan" },
        { status: 404 }
      ),
      store: null,
    };
  }

  return {
    error: null,
    store,
  };
}

// =====================================================
// HELPER: VALIDATE PRODUCT ID
// =====================================================

function isValidProductId(id: string) {
  return /^\d+$/.test(id) && BigInt(id) > BigInt(0);
}

// =====================================================
// GET PRODUCT DETAIL
// =====================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.products.findFirst({
      where: /^\d+$/.test(id)
        ? { id: BigInt(id) }
        : { slug: id },

      include: productInclude,
    });

    if (!product) {
      return NextResponse.json(
        { message: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    // Produk aktif dari toko aktif dan terverifikasi
    // dapat diakses secara publik.
    const isPublicProduct =
      product.is_active &&
      product.stores?.is_active &&
      product.stores?.is_verified;

    // Produk yang tidak tersedia untuk publik hanya
    // boleh dilihat oleh seller pemilik toko.
    if (!isPublicProduct) {
      const session = await getCurrentUser();

      if (!session || session.role !== "seller") {
        return NextResponse.json(
          { message: "Produk tidak ditemukan" },
          { status: 404 }
        );
      }

      const ownedStore = await prisma.stores.findFirst({
        where: {
          owner_id: session.id,
          id: product.store_id,
        },
        select: {
          id: true,
        },
      });

      if (!ownedStore) {
        return NextResponse.json(
          { message: "Produk tidak ditemukan" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({
      data: serializeBigInt(mapProduct(product)),
    });
  } catch (error: any) {
    console.error("GET PRODUCT DETAIL ERROR", error);

    return NextResponse.json(
      { message: error.message || "Gagal mengambil produk" },
      { status: 500 }
    );
  }
}

// =====================================================
// PUT UPDATE PRODUCT
// =====================================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!isValidProductId(id)) {
      return NextResponse.json(
        { message: "ID produk tidak valid" },
        { status: 400 }
      );
    }

    // -----------------------------------------------
    // AUTHENTICATION & STORE OWNERSHIP
    // -----------------------------------------------

    const { error: authError, store } = await getSellerStore();

    if (authError || !store) {
      return authError;
    }

    const productId = BigInt(id);

    const currentProduct = await prisma.products.findFirst({
      where: {
        id: productId,
        store_id: store.id,
      },
      select: {
        id: true,
        store_id: true,
        is_featured: true,
      },
    });

    if (!currentProduct) {
      return NextResponse.json(
        { message: "Produk tidak ditemukan atau bukan milik toko Anda" },
        { status: 404 }
      );
    }

    // -----------------------------------------------
    // REQUEST BODY
    // -----------------------------------------------

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

    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

    if (
      name !== undefined &&
      (typeof name !== "string" || !name.trim())
    ) {
      return NextResponse.json(
        { message: "Nama produk wajib diisi" },
        { status: 400 }
      );
    }

    if (price !== undefined) {
      const parsedPrice = Number(price);

      if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
        return NextResponse.json(
          { message: "Harga produk tidak valid" },
          { status: 400 }
        );
      }
    }

    if (stock !== undefined) {
      const parsedStock = Number(stock);

      if (
        !Number.isInteger(parsedStock) ||
        parsedStock < 0
      ) {
        return NextResponse.json(
          { message: "Stok produk tidak valid" },
          { status: 400 }
        );
      }
    }

    if (weight !== undefined && weight !== null && weight !== "") {
      const parsedWeight = Number(weight);

      if (!Number.isFinite(parsedWeight) || parsedWeight < 0) {
        return NextResponse.json(
          { message: "Berat produk tidak valid" },
          { status: 400 }
        );
      }
    }

    if (
      categoryId !== undefined &&
      categoryId !== null &&
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
    }

    if (images !== undefined && !Array.isArray(images)) {
      return NextResponse.json(
        { message: "Format gambar produk tidak valid" },
        { status: 400 }
      );
    }

    // -----------------------------------------------
    // FEATURED PRODUCT LIMIT
    // Maksimal 5 produk unggulan per toko
    // -----------------------------------------------

    if (isFeatured === true && !currentProduct.is_featured) {
      const totalFeatured = await prisma.products.count({
        where: {
          store_id: store.id,
          is_featured: true,
        },
      });

      if (totalFeatured >= 5) {
        return NextResponse.json(
          {
            message:
              "Maksimal 5 produk unggulan dalam satu toko",
          },
          { status: 400 }
        );
      }
    }

    // -----------------------------------------------
    // UPDATE PRODUCT
    // -----------------------------------------------

    const product = await prisma.$transaction(async (tx) => {
      const updated = await tx.products.updateMany({
        where: {
          id: productId,
          store_id: store.id,
        },

        data: {
          ...(categoryId !== undefined && {
            category_id: categoryId
              ? BigInt(categoryId)
              : null,
          }),

          ...(name !== undefined && {
            name: name.trim(),
          }),

          ...(slug !== undefined && {
            slug,
          }),

          ...(description !== undefined && {
            description,
          }),

          ...(thumbnailUrl !== undefined && {
            thumbnail_url: thumbnailUrl,
          }),

          ...(thumbnailPublicId !== undefined && {
            thumbnail_public_id: thumbnailPublicId,
          }),

          ...(price !== undefined && {
            price: Number(price),
          }),

          ...(stock !== undefined && {
            stock: Number(stock),
          }),

          ...(unit !== undefined && {
            unit,
          }),

          ...(weight !== undefined && {
            weight:
              weight === null || weight === ""
                ? null
                : Number(weight),
          }),

          ...(isFeatured !== undefined && {
            is_featured: isFeatured,
          }),

          ...(isActive !== undefined && {
            is_active: isActive,
          }),
        },
      });

      if (updated.count === 0) {
        throw new Error("PRODUCT_NOT_FOUND");
      }

      // Update gallery jika images dikirim
      if (Array.isArray(images)) {
        await tx.product_images.deleteMany({
          where: {
            product_id: productId,
          },
        });

        if (images.length > 0) {
          await tx.product_images.createMany({
            data: images.map((image: any) => ({
              product_id: productId,
              image_url: image.url,
              image_public_id: image.publicId ?? null,
            })),
          });
        }
      }

      const result = await tx.products.findFirst({
        where: {
          id: productId,
          store_id: store.id,
        },
        include: productInclude,
      });

      if (!result) {
        throw new Error("PRODUCT_NOT_FOUND");
      }

      return result;
    });

    return NextResponse.json({
      message: "Produk berhasil diperbarui",
      data: serializeBigInt(mapProduct(product)),
    });
  } catch (error: any) {
    console.error("UPDATE PRODUCT ERROR", error);

    if (error.message === "PRODUCT_NOT_FOUND") {
      return NextResponse.json(
        { message: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: error.message || "Gagal update produk" },
      { status: 500 }
    );
  }
}

// =====================================================
// DELETE PRODUCT
// =====================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!isValidProductId(id)) {
      return NextResponse.json(
        { message: "ID produk tidak valid" },
        { status: 400 }
      );
    }

    // -----------------------------------------------
    // AUTHENTICATION & STORE OWNERSHIP
    // -----------------------------------------------

    const { error: authError, store } = await getSellerStore();

    if (authError || !store) {
      return authError;
    }

    const productId = BigInt(id);

    // Ambil produk hanya jika milik toko seller login.
    const product = await prisma.products.findFirst({
      where: {
        id: productId,
        store_id: store.id,
      },

      include: {
        product_images: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Produk tidak ditemukan atau bukan milik toko Anda" },
        { status: 404 }
      );
    }

    // -----------------------------------------------
    // DELETE DATABASE RECORDS
    // -----------------------------------------------

    await prisma.$transaction(async (tx) => {
      await tx.product_images.deleteMany({
        where: {
          product_id: productId,
        },
      });

      const deleted = await tx.products.deleteMany({
        where: {
          id: productId,
          store_id: store.id,
        },
      });

      if (deleted.count === 0) {
        throw new Error("PRODUCT_NOT_FOUND");
      }
    });

    // -----------------------------------------------
    // DELETE CLOUDINARY IMAGES
    // Dilakukan setelah database berhasil dihapus.
    // -----------------------------------------------

    const cloudinaryPublicIds = [
      product.thumbnail_public_id,
      ...product.product_images.map(
        (image: any) => image.image_public_id
      ),
    ].filter(
      (publicId: string | null): publicId is string =>
        Boolean(publicId)
    );

    for (const publicId of cloudinaryPublicIds) {
      try {
        await deleteFromCloudinary(publicId);
      } catch (cloudinaryError) {
        console.error(
          `Gagal menghapus gambar Cloudinary: ${publicId}`,
          cloudinaryError
        );
      }
    }

    return NextResponse.json({
      message: "Produk berhasil dihapus",
    });
  } catch (error: any) {
    console.error("DELETE PRODUCT ERROR", error);

    if (error.message === "PRODUCT_NOT_FOUND") {
      return NextResponse.json(
        { message: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: error.message || "Gagal menghapus produk" },
      { status: 500 }
    );
  }
}