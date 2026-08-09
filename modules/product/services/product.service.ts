// modules/product/services/product.service.ts

import type { Product, ProductFilter, ProductCreatePayload, ProductListResponse } from "../types/product.types";

const API_URL = "/api/product";

// Helper internal untuk membaca dan memparsing response API dengan aman
async function parseResponse(res: Response, defaultErrorMessage: string) {
  const text = await res.text();
  let json: any = {};

  try {
    json = JSON.parse(text);
  } catch {
    json = { message: text };
  }

  if (!res.ok) {
    throw new Error(json.message || text || defaultErrorMessage);
  }

  return json.data ?? json;
}

export async function getProducts(filter: ProductFilter = {}): Promise<ProductListResponse> {
  const params = new URLSearchParams();
  if (filter.search) params.set("search", filter.search);
  if (filter.category) params.set("category", filter.category);
  params.set("page", String(filter.page ?? 1));
  params.set("limit", String(filter.limit ?? 10));

  const res = await fetch(`${API_URL}?${params.toString()}`, { cache: "no-store" });
  return parseResponse(res, "Gagal mengambil data produk");
}

export async function getProductById(id: string): Promise<Product> {
  const res = await fetch(`${API_URL}/${id}`, { cache: "no-store" });
  return parseResponse(res, "Gagal mengambil detail produk");
}

export async function createProduct(data: ProductCreatePayload): Promise<Product> {
  console.log("CREATE PAYLOAD:", data);

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  console.log("CREATE STATUS:", res.status);
  return parseResponse(res, "Gagal menambah produk");
}

export async function updateProduct(id: string, data: Partial<ProductCreatePayload>): Promise<Product> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  console.log("UPDATE PRODUCT STATUS:", res.status);
  return parseResponse(res, "Gagal memperbarui produk");
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  console.log("DELETE PRODUCT STATUS:", res.status);
  
  await parseResponse(res, "Gagal menghapus produk");
}