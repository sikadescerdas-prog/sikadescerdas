// components/store/settings/StoreMediaSosial.tsx

"use client";

import InputGoogle from "@/components/ui/InputGoogle";

type StoreMediaSosialProps = { shopee: string; tiktokShop: string; tokopedia: string; onChange: (field: "shopee" | "tiktokShop" | "tokopedia", value: string) => void; };

export default function StoreMediaSosial({ shopee, tiktokShop, tokopedia, onChange }: StoreMediaSosialProps) {
  return (
    <section className="border-t border-gray-100 pt-6">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-800">Marketplace</h2>
        <p className="mt-1 text-xs text-gray-500">Tambahkan akun marketplace toko Anda.</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <InputGoogle
          id="store-shopee"
          name="shopee"
          label="Shopee"
          placeholder="Username atau link"
          value={shopee}
          onChange={(event) => onChange("shopee", event.target.value)}
        />

        <InputGoogle
          id="store-tiktok-shop"
          name="tiktokShop"
          label="TikTok Shop"
          placeholder="Username atau link"
          value={tiktokShop}
          onChange={(event) => onChange("tiktokShop", event.target.value)}
        />

        <InputGoogle
          id="store-tokopedia"
          name="tokopedia"
          label="Tokopedia"
          placeholder="Username atau link"
          value={tokopedia}
          onChange={(event) => onChange("tokopedia", event.target.value)}
        />
      </div>
    </section>
  );
}