// shared/services/cloudinary.service.ts

import cloudinary from "@/lib/cloudinary";

interface UploadResult { url: string | undefined; publicId: string | undefined; }

export async function uploadToCloudinary(file: Buffer, folder: string, publicId?: string, type: "logo" | "banner" = "banner"): Promise<UploadResult> {
  const transformation = type === "logo" ? [{ width: 300, height: 300, crop: "fill", gravity: "auto", quality: 80, fetch_format: "webp" }] : [{ width: 1280, height: 720, crop: "fill", gravity: "auto", quality: 75, fetch_format: "webp" }];

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder, public_id: publicId, resource_type: "image", transformation }, (error, result) => {
      if (error) return reject(error);
      resolve({ url: result?.secure_url, publicId: result?.public_id });
    }).end(file);
  });
}

export async function deleteFromCloudinary(publicId: string) {
  return cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}

export async function uploadPdfToCloudinary(file: Buffer, folder: string, publicId?: string): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder, public_id: publicId, resource_type: "raw" }, (error, result) => {
      if (error) return reject(error);
      resolve({ url: result?.secure_url, publicId: result?.public_id });
    }).end(file);
  });
}

export async function deletePdfFromCloudinary(publicId: string) {
  return cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
}