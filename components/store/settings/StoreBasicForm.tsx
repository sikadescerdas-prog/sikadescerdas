// components/store/settings/StoreBasicForm.tsx

"use client";

import InputGoogle from "@/components/ui/InputGoogle";

type StoreBasicFormProps = {
  name: string;
  description: string;
  email: string;
  phone: string;
  profilePhone?: string | null;
  sameAsProfile: boolean;
  onChange: (field: "name" | "description" | "email" | "phone", value: string) => void;
  onSameAsProfileChange: (value: boolean) => void;
  errors?: { name?: string; description?: string; email?: string; phone?: string };
};

export default function StoreBasicForm({
  name,
  description,
  email,
  phone,
  profilePhone = null,
  sameAsProfile,
  onChange,
  onSameAsProfileChange,
  errors = {},
}: StoreBasicFormProps) {
  const handleSameAsProfile = (checked: boolean) => {
    onSameAsProfileChange(checked);
    if (checked) {
      onChange("phone", profilePhone ?? "");
      return;
    }
    onChange("phone", "");
  };

  return (
    <section className="border-t border-gray-100 pt-6">
      <div className="mb-4">
        <h2 className="text-md font-semibold text-gray-800">Informasi Dasar Toko</h2>
        <p className="mt-1 text-xs text-gray-500">Informasi utama yang akan ditampilkan pada toko Anda.</p>
      </div>

      <div className="space-y-4">
        {/* NAMA TOKO */}
        <InputGoogle
          id="store-name"
          name="name"
          label="Nama Toko"
          placeholder="Masukkan nama toko"
          value={name}
          onChange={(event) => onChange("name", event.target.value)}
          error={errors.name}
          showValidIcon
        />

        {/* DESKRIPSI */}
        <div className="relative">
          <textarea
            id="store-description"
            name="description"
            value={description}
            onChange={(event) => onChange("description", event.target.value)}
            placeholder="Ceritakan tentang toko Anda"
            rows={4}
            className={`peer w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 ${
              errors.description
                ? "border-red-500 bg-white text-gray-700 focus:border-red-500"
                : "border-gray-300 bg-white text-gray-700 focus:border-green-500"
            }`}
          />

          <label htmlFor="store-description" className={`pointer-events-none absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-xs ${errors.description ? "text-red-500" : "text-gray-500"}`}>
            Deskripsi
          </label>

          {errors.description && (
            <p className="mt-1 pl-1 text-xs text-red-500">{errors.description}</p>
          )}
        </div>

        {/* EMAIL */}
        <InputGoogle
          id="store-email"
          name="email"
          type="email"
          label="Email Toko"
          placeholder="contoh@email.com"
          value={email}
          onChange={(event) => onChange("email", event.target.value)}
          error={errors.email}
        />

        {/* WHATSAPP BISNIS */}
        <div>
          <InputGoogle
            id="store-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            label="WhatsApp Bisnis"
            placeholder="081234567890"
            value={phone}
            disabled={sameAsProfile}
            onChange={(event) => onChange("phone", event.target.value)}
            error={errors.phone}
            style={{
              backgroundColor: sameAsProfile ? "#f3f4f6" : "#ffffff",
              color: sameAsProfile ? "#9ca3af" : "#374151",
              borderColor: sameAsProfile ? "#e5e7eb" : "#d1d5db",
              cursor: sameAsProfile ? "not-allowed" : "text",
            }}
          />

          {/* SAMAKAN DENGAN PROFILE */}
          <label className="mt-2 flex cursor-pointer items-center gap-2 pl-1">
            <input
              type="checkbox"
              checked={sameAsProfile}
              onChange={(event) => handleSameAsProfile(event.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-xs text-gray-600">
              Gunakan nomor WhatsApp yang tersimpan pada profile Anda.
            </span>
          </label>
        </div>
      </div>
    </section>
  );
}