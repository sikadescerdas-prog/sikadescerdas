// modules/product/services/product.service.ts

import type { Product, ProductFilter, ProductCreatePayload, ProductListResponse } from "../types/product.types";

const API_URL = "/api/product";

export async function getProducts(filter: ProductFilter = {}): Promise<ProductListResponse> {
  const params = new URLSearchParams();
  if (filter.search) params.set("search", filter.search);
  if (filter.category) params.set("category", filter.category);
  params.set("page", String(filter.page ?? 1));
  params.set("limit", String(filter.limit ?? 10));

  const res = await fetch(`${API_URL}?${params.toString()}`, { cache: "no-store" });
  const json = await res.json();

  if (!res.ok) throw new Error(json.message ?? "Gagal mengambil data produk");

  return json;
}

export async function getProductById(id: string): Promise<Product> {
  const res = await fetch(`${API_URL}/${id}`, { cache: "no-store" });
  const json = await res.json();

  if (!res.ok) throw new Error(json.message ?? "Gagal mengambil detail produk");

  return json.data ?? json;
}

export async function createProduct(data: ProductCreatePayload): Promise<Product> {
  console.log("CREATE PAYLOAD:", data);

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  console.log("CREATE STATUS:", res.status);
  const text = await res.text();
  console.log("CREATE RESPONSE:", text);

  let json: any = {};
  try {
    json = JSON.parse(text);
  } catch {
    json = { message: text };
  }

  if (!res.ok) {
    console.error("CREATE PRODUCT API ERROR:", json);
    throw new Error(json.message ?? "Gagal menambah produk");
  }

  return json.data ?? json;
}

export async function updateProduct(id: string, data: Partial<ProductCreatePayload>): Promise<Product> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const text = await res.text();
  console.log("UPDATE PRODUCT STATUS:", res.status);
  console.log("UPDATE PRODUCT RESPONSE:", text);

  let json: any = {};
  try {
    json = JSON.parse(text);
  } catch {
    json = {};
  }

  if (!res.ok) {
    throw new Error(json.message ?? text ?? "Gagal memperbarui produk");
  }

  return json.data ?? json;
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  const text = await res.text();
  console.log("DELETE PRODUCT STATUS:", res.status);
  console.log("DELETE PRODUCT RESPONSE:", text);

  if (!res.ok) {
    let json: any = {};
    try {
      json = JSON.parse(text);
    } catch {
      json = {};
    }

    throw new Error(json.message ?? text ?? "Gagal menghapus produk");
  }
}