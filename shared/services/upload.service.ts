// shared/services/upload.service.ts

export async function uploadImage(file: File, folder: string, publicId?: string, type: "logo" | "banner" = "banner") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  formData.append("type", type);
  if (publicId) formData.append("publicId", publicId);

  const response = await fetch("/api/upload/cloudinary", { method: "POST", body: formData });
  const text = await response.text();

  let result;
  try {
    result = JSON.parse(text);
  } catch {
    throw new Error(text || `Upload gambar gagal (${response.status})`);
  }

  if (!response.ok || !result.success) {
    throw new Error(result.message || `Upload gambar gagal (${response.status})`);
  }

  return result.data;
}

export async function deleteImage(publicId: string) {
  const response = await fetch("/api/upload/cloudinary", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicId, type: "image" }),
  });

  const text = await response.text();

  let result;
  try {
    result = JSON.parse(text);
  } catch {
    throw new Error(text || `Hapus gambar gagal (${response.status})`);
  }

  if (!response.ok || !result.success) {
    throw new Error(result.message || `Hapus gambar gagal (${response.status})`);
  }

  return result;
}

export async function uploadPdf(file: File, folder: string, publicId?: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  formData.append("type", "pdf");
  if (publicId) formData.append("publicId", publicId);

  const response = await fetch("/api/upload/cloudinary", { method: "POST", body: formData });
  const text = await response.text();

  let result;
  try {
    result = JSON.parse(text);
  } catch {
    throw new Error(text || `Upload PDF gagal (${response.status})`);
  }

  if (!response.ok || !result.success) {
    throw new Error(result.message || `Upload PDF gagal (${response.status})`);
  }

  return result.data;
}

export async function deletePdf(publicId: string) {
  const response = await fetch("/api/upload/cloudinary", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicId, type: "pdf" }),
  });

  const text = await response.text();

  let result;
  try {
    result = JSON.parse(text);
  } catch {
    throw new Error(text || `Hapus PDF gagal (${response.status})`);
  }

  if (!response.ok || !result.success) {
    throw new Error(result.message || `Hapus PDF gagal (${response.status})`);
  }

  return result;
}