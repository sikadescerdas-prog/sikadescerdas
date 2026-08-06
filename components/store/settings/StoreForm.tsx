// components/store/settings/StoreForm.tsx

"use client";

import { useEffect, useState } from "react";
import type { Store, UpdateStorePayload } from "@/modules/store/types/store.types";
import StoreHeaderForm from "./StoreHeaderForm";
import StoreLogo from "./StoreLogo";
import StoreBasicForm from "./StoreBasicForm";
import StoreAddress from "./StoreAddress";
import StoreMediaSosial from "./StoreMediaSosial";
import StoreSaveButton from "./StoreSaveButton";

type StoreFormProps = {
  store: Store;
  saving?: boolean;
  onSubmit: (data: UpdateStorePayload) => Promise<void>;
};

type FormState = {
  name: string;
  slug: string;
  description: string;
  email: string;
  phone: string;
  province: string;
  regency: string;
  district: string;
  village: string;
  address: string;
  latitude: string;
  longitude: string;
  shopee: string;
  tiktokShop: string;
  tokopedia: string;
  logoUrl: string | null;
  logoPublicId: string | null;
  bannerUrl: string | null;
  bannerPublicId: string | null;
};

type PreviewImage = {
  file: File;
  url: string;
};

const getMarketplace = (store: Store, platform: "shopee" | "tiktok_shop" | "tokopedia") => {
  return store.marketplaces?.find((item) => item.platform === platform && item.is_active)?.url ?? "";
};

const createFormState = (store: Store): FormState => ({
  name: store.name,
  slug: store.slug,
  description: store.description ?? "",
  email: store.email ?? "",
  phone: store.phone ?? "",
  province: store.province ?? "",
  regency: store.regency ?? "",
  district: store.district ?? "",
  village: store.village ?? "",
  address: store.address ?? "",
  latitude: store.latitude ?? "",
  longitude: store.longitude ?? "",
  shopee: getMarketplace(store, "shopee"),
  tiktokShop: getMarketplace(store, "tiktok_shop"),
  tokopedia: getMarketplace(store, "tokopedia"),
  logoUrl: store.logo_url,
  logoPublicId: store.logo_public_id,
  bannerUrl: store.banner_url,
  bannerPublicId: store.banner_public_id,
});

export default function StoreForm({ store, saving = false, onSubmit }: StoreFormProps) {
  const [form, setForm] = useState<FormState>(() => createFormState(store));
  const [logoPreview, setLogoPreview] = useState<PreviewImage | null>(null);
  const [bannerPreview, setBannerPreview] = useState<PreviewImage | null>(null);
  const [logoDeleted, setLogoDeleted] = useState(false);
  const [bannerDeleted, setBannerDeleted] = useState(false);
  const [sameBasicProfile, setSameBasicProfile] = useState(false);
  const [sameAddressProfile, setSameAddressProfile] = useState(false);

  useEffect(() => {
    setForm(createFormState(store));
    setLogoPreview((current) => {
      if (current) URL.revokeObjectURL(current.url);
      return null;
    });
    setBannerPreview((current) => {
      if (current) URL.revokeObjectURL(current.url);
      return null;
    });
    setLogoDeleted(false);
    setBannerDeleted(false);
  }, [store]);

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview.url);
      if (bannerPreview) URL.revokeObjectURL(bannerPreview.url);
    };
  }, [logoPreview, bannerPreview]);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleLogoUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setLogoPreview((current) => {
      if (current) URL.revokeObjectURL(current.url);
      return { file, url };
    });
    setLogoDeleted(false);
  };

  const handleLogoDelete = () => {
    setLogoPreview((current) => {
      if (current) URL.revokeObjectURL(current.url);
      return null;
    });
    setLogoDeleted(true);
  };

  const handleBannerUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setBannerPreview((current) => {
      if (current) URL.revokeObjectURL(current.url);
      return { file, url };
    });
    setBannerDeleted(false);
  };

  const handleBannerDelete = () => {
    setBannerPreview((current) => {
      if (current) URL.revokeObjectURL(current.url);
      return null;
    });
    setBannerDeleted(true);
  };

  const uploadImage = async (file: File, type: "logo" | "banner"): Promise<{ url: string; publicId: string }> => {
    const formData = new FormData();
    const publicId = `${type}-${store.owner_id}`;
    formData.append("file", file);
    formData.append("folder", "store");
    formData.append("publicId", publicId);
    formData.append("type", type);

    const response = await fetch("/api/upload/cloudinary", { method: "POST", body: formData });
    let data: { success?: boolean; data?: { url?: string; publicId?: string }; message?: string };

    try {
      data = await response.json();
    } catch {
      throw new Error("Response upload gambar tidak valid.");
    }

    if (!response.ok || !data.success) throw new Error(data.message ?? "Gagal mengunggah gambar.");
    if (!data.data?.url || !data.data.publicId) throw new Error("Response Cloudinary tidak lengkap.");

    return { url: data.data.url, publicId: data.data.publicId };
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let logoUrl = form.logoUrl;
    let logoPublicId = form.logoPublicId;
    let bannerUrl = form.bannerUrl;
    let bannerPublicId = form.bannerPublicId;

    if (logoDeleted) {
      logoUrl = null;
      logoPublicId = null;
    }

    if (bannerDeleted) {
      bannerUrl = null;
      bannerPublicId = null;
    }

    if (logoPreview) {
      const uploadedLogo = await uploadImage(logoPreview.file, "logo");
      logoUrl = uploadedLogo.url;
      logoPublicId = uploadedLogo.publicId;
    }

    if (bannerPreview) {
      const uploadedBanner = await uploadImage(bannerPreview.file, "banner");
      bannerUrl = uploadedBanner.url;
      bannerPublicId = uploadedBanner.publicId;
    }

    await onSubmit({
      name: form.name.trim(),
      description: form.description.trim() || null,
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      province: form.province.trim() || null,
      regency: form.regency.trim() || null,
      district: form.district.trim() || null,
      village: form.village.trim() || null,
      address: form.address.trim() || null,
      latitude: form.latitude.trim() || null,
      longitude: form.longitude.trim() || null,
      shopee: form.shopee.trim() || null,
      tiktokShop: form.tiktokShop.trim() || null,
      tokopedia: form.tokopedia.trim() || null,
      logo_url: logoUrl,
      logo_public_id: logoPublicId,
      banner_url: bannerUrl,
      banner_public_id: bannerPublicId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <StoreHeaderForm />
      <StoreLogo
        logoUrl={logoPreview?.url ?? (logoDeleted ? null : form.logoUrl)}
        bannerUrl={bannerPreview?.url ?? (bannerDeleted ? null : form.bannerUrl)}
        onLogoUpload={handleLogoUpload}
        onLogoDelete={handleLogoDelete}
        onBannerUpload={handleBannerUpload}
        onBannerDelete={handleBannerDelete}
        disabled={saving}
      />
      <StoreBasicForm
        name={form.name}
        description={form.description}
        email={form.email}
        phone={form.phone}
        sameAsProfile={sameBasicProfile}
        onChange={(field, value) => updateField(field, value)}
        onSameAsProfileChange={setSameBasicProfile}
      />
      <StoreAddress
        address={form.address}
        village={form.village}
        district={form.district}
        regency={form.regency}
        province={form.province}
        latitude={form.latitude}
        longitude={form.longitude}
        sameAsProfile={sameAddressProfile}
        onChange={(field, value) => updateField(field, value)}
        onSameAsProfileChange={setSameAddressProfile}
      />
      <StoreMediaSosial
        shopee={form.shopee}
        tiktokShop={form.tiktokShop}
        tokopedia={form.tokopedia}
        onChange={(field, value) => updateField(field, value)}
      />
      <StoreSaveButton saving={saving} />
    </form>
  );
}