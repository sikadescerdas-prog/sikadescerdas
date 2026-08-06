// app/api/dashboard/umkm/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Sesuaikan path import prisma client Anda

export async function GET() {
  try {
    // 1. Ambil data stores beserta relasi product-nya dari database PostgreSQL
    const storesFromDb = await prisma.stores.findMany({
      include: {
        products: {
          include: {
            product_categories: true, // Untuk mengambil nama kategori produk
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const stores: any[] = [];
    const products: any[] = [];

    // 2. Mapping data Prisma ke format view model yang digunakan oleh frontend components
    storesFromDb.forEach((store) => {
      // Ambil nilai is_verified dari database (default false jika null)
      const isVerified = store.is_verified ?? false;
      
      // ATURAN: Jika is_verified false, maka isActive wajib false. 
      // Jika is_verified true, ikuti status is_active dari database (default true jika null).
      const isActive = isVerified ? (store.is_active ?? true) : false;

      // Mapping untuk struktur data Store
      stores.push({
        ownerUid: store.owner_id, // Menggunakan owner_id sebagai pengganti ownerUid
        nameStore: store.name,
        addressStore: {
          city: store.regency || store.district || store.province || "-",
          latitude: store.latitude ? Number(store.latitude) : undefined,
          longitude: store.longitude ? Number(store.longitude) : undefined,
        },
        logo: {
          url: store.logo_url || "/placeholder.png",
        },
        isVerified: isVerified,
        isActive: isActive,
      });

      // Mapping untuk produk-produk milik toko tersebut
      store.products.forEach((prod) => {
        products.push({
          id: prod.id.toString(), // Konversi BigInt ke string agar aman dikirim via JSON
          ownerUid: store.owner_id,
          name: prod.name,
          category: prod.product_categories?.name || "-",
          price: Number(prod.price), // Konversi Decimal Prisma ke number JavaScript
          image: {
            url: prod.thumbnail_url || "/placeholder.png",
          },
        });
      });
    });

    return NextResponse.json(
      {
        stores,
        products,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API /dashboard/umkm error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}