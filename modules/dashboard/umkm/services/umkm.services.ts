// modules/dashboard/services/umkm.services.ts
import { prisma } from "@/lib/prisma";
import type { UMKMDataResponse, Store, UMKMProduct } from "../types/umkm.types";

export async function getUMKMData(): Promise<UMKMDataResponse> {
  try {
    const storesFromDb = await prisma.stores.findMany({
      include: {
        products: {
          include: {
            product_categories: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const stores: Store[] = [];
    const products: UMKMProduct[] = [];

    storesFromDb.forEach((store) => {
      const isVerified = store.is_verified ?? false;
      const isActive = isVerified ? (store.is_active ?? true) : false;

      stores.push({
        ownerUid: store.owner_id,
        nameStore: store.name,
        addressStore: {
          city: store.regency || store.district || store.province || "-",
          latitude: store.latitude ? Number(store.latitude) : undefined,
          longitude: store.longitude ? Number(store.longitude) : undefined,
        },
        logo: {
          url: store.logo_url || "/placeholder.png",
        },
        isActive: isActive,
        isVerified: isVerified, // Masukkan ke view model
      });

      store.products.forEach((prod) => {
        products.push({
          id: prod.id.toString(),
          ownerUid: store.owner_id,
          name: prod.name,
          category: prod.product_categories?.name || "-",
          price: Number(prod.price),
          image: {
            url: prod.thumbnail_url || "/placeholder.png",
          },
        });
      });
    });

    return { stores, products };
  } catch (error) {
    console.error("umkmService error:", error);
    throw new Error("Gagal mengambil data UMKM dari database");
  }
}