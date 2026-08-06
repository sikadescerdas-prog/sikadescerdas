// app/api/product/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "@/shared/utils/serializeBigInt";
import { deleteFromCloudinary } from "@/shared/services/cloudinary.service";

function mapProduct(product: any) {
  return {
    id: String(product.id),
    storeId: String(product.store_id),
    storeName: product.stores?.name ?? null,
    storeSlug: product.stores?.slug ?? null,
    storeLogo: product.stores?.logo_url ?? null,
    storeRegency: product.stores?.regency ?? null,
    categoryId: product.category_id ? String(product.category_id) : null,
    category: product.product_categories?.name ?? null,
    name: product.name,
    slug: product.slug,
    description: product.description,
    thumbnailUrl: product.thumbnail_url,
    thumbnailPublicId: product.thumbnail_public_id,
    price: Number(product.price),
    stock: Number(product.stock),
    unit: product.unit,
    weight: product.weight !== null ? Number(product.weight) : null,
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

const productInclude = {
  product_categories: true,
  product_images: true,
  stores: {
    select: {
      name: true,
      slug: true,
      logo_url: true,
      regency: true,
    },
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.products.findFirst({
      where: /^\d+$/.test(id) ? { id: BigInt(id) } : { slug: id },
      include: productInclude,
    });

    if (!product) {
      return NextResponse.json(
        { message: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: serializeBigInt(mapProduct(product)),
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Gagal mengambil produk" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!/^\d+$/.test(id)) {
      return NextResponse.json(
        { message: "ID produk tidak valid" },
        { status: 400 }
      );
    }

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

    if (isFeatured === true) {
      const currentProduct = await prisma.products.findUnique({
        where: { id: BigInt(id) },
        select: {
          store_id: true,
          is_featured: true,
        },
      });

      if (!currentProduct) {
        return NextResponse.json(
          { message: "Produk tidak ditemukan" },
          { status: 404 }
        );
      }

      if (!currentProduct.is_featured) {
        const totalFeatured = await prisma.products.count({
          where: {
            store_id: currentProduct.store_id,
            is_featured: true,
          },
        });

        if (totalFeatured >= 5) {
          return NextResponse.json(
            { message: "Maksimal 5 produk unggulan dalam satu toko" },
            { status: 400 }
          );
        }
      }
    }

    const product = await prisma.$transaction(async (tx) => {
      const updated = await tx.products.update({
        where: { id: BigInt(id) },
        data: {
          ...(categoryId !== undefined && {
            category_id: categoryId ? BigInt(categoryId) : null,
          }),
          ...(name !== undefined && { name }),
          ...(slug !== undefined && { slug }),
          ...(description !== undefined && { description }),
          ...(thumbnailUrl !== undefined && { thumbnail_url: thumbnailUrl }),
          ...(thumbnailPublicId !== undefined && {
            thumbnail_public_id: thumbnailPublicId,
          }),
          ...(price !== undefined && { price: Number(price) }),
          ...(stock !== undefined && { stock: Number(stock) }),
          ...(unit !== undefined && { unit }),
          ...(weight !== undefined && {
            weight: weight ? Number(weight) : null,
          }),
          ...(isFeatured !== undefined && { is_featured: isFeatured }),
          ...(isActive !== undefined && { is_active: isActive }),
        },
      });

      if (Array.isArray(images)) {
        await tx.product_images.deleteMany({
          where: { product_id: BigInt(id) },
        });

        if (images.length) {
          await tx.product_images.createMany({
            data: images.map((image: any) => ({
              product_id: BigInt(id),
              image_url: image.url,
              image_public_id: image.publicId ?? null,
            })),
          });
        }
      }

      const result = await tx.products.findUnique({
        where: { id: updated.id },
        include: productInclude,
      });

      if (!result) {
        throw new Error("Produk tidak ditemukan setelah update");
      }

      return result;
    });

    return NextResponse.json({
      message: "Produk berhasil diperbarui",
      data: serializeBigInt(mapProduct(product)),
    });
  } catch (error: any) {
    console.error("UPDATE PRODUCT ERROR", error);

    return NextResponse.json(
      { message: error.message || "Gagal update produk" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!/^\d+$/.test(id)) {
      return NextResponse.json(
        { message: "ID produk tidak valid" },
        { status: 400 }
      );
    }

    const product = await prisma.products.findUnique({
      where: { id: BigInt(id) },
      include: {
        product_images: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    if (product.thumbnail_public_id) {
      await deleteFromCloudinary(product.thumbnail_public_id);
    }

    for (const image of product.product_images) {
      if (image.image_public_id) {
        await deleteFromCloudinary(image.image_public_id);
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.product_images.deleteMany({
        where: { product_id: BigInt(id) },
      });

      await tx.products.delete({
        where: { id: BigInt(id) },
      });
    });

    return NextResponse.json({
      message: "Produk berhasil dihapus",
    });
  } catch (error: any) {
    console.error("DELETE PRODUCT ERROR", error);

    return NextResponse.json(
      { message: error.message || "Gagal menghapus produk" },
      { status: 500 }
    );
  }
}