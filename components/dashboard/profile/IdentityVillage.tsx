// components/dashboard/profile/IdentityVillage.tsx

"use client";

import InputGoogle from "@/components/ui/InputGoogle";
import TextareaGoogle from "@/components/ui/TextareaGoogle";
import type { VillageProfileForm } from "@/modules/dashboard/village/types/village.types";

type Props = {
  formData: VillageProfileForm;
  onChange: <K extends keyof VillageProfileForm>(field: K, value: VillageProfileForm[K]) => void;
};

export default function IdentityVillage({ formData, onChange }: Props) {
  return (
    <div className="animate-fade-up">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-5 w-1 rounded-full bg-emerald-500" />
        <h3 className="text-base font-bold text-gray-800">Identitas Desa</h3>
      </div>

      <div className="space-y-5">
        {/* NAMA - LUAS - TAHUN */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-10">
          <div className="lg:col-span-6">
            <InputGoogle
              name="name"
              label="Nama Desa"
              value={formData.name ?? ""}
              placeholder="Nama Desa"
              onChange={(e) => onChange("name", e.target.value)}
            />
          </div>

          <div className="lg:col-span-2">
            <InputGoogle
              name="areaSize"
              label="Luas (ha)"
              value={formData.areaSize ?? ""}
              placeholder="62,5"
              onChange={(e) => onChange("areaSize", e.target.value)}
            />
          </div>

          <div className="lg:col-span-2">
            <InputGoogle
              name="foundedYear"
              label="Tahun Berdiri"
              value={formData.foundedYear ?? ""}
              placeholder="1990"
              maxLength={4}
              onChange={(e) => onChange("foundedYear", e.target.value.replace(/\D/g, ""))}
            />
          </div>
        </div>

        {/* JUMLAH WILAYAH */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <InputGoogle
            name="totalHamlets"
            label="Jumlah Dusun"
            value={formData.totalHamlets ?? ""}
            placeholder="5"
            onChange={(e) => onChange("totalHamlets", e.target.value.replace(/\D/g, ""))}
          />

          <InputGoogle
            name="totalRw"
            label="Jumlah RW"
            value={formData.totalRw ?? ""}
            placeholder="10"
            onChange={(e) => onChange("totalRw", e.target.value.replace(/\D/g, ""))}
          />

          <InputGoogle
            name="totalRt"
            label="Jumlah RT"
            value={formData.totalRt ?? ""}
            placeholder="25"
            onChange={(e) => onChange("totalRt", e.target.value.replace(/\D/g, ""))}
          />
        </div>

        {/* SEJARAH - SAMBUTAN */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <TextareaGoogle
            name="history"
            label="Sejarah Desa"
            rows={6}
            value={formData.history ?? ""}
            placeholder="Sejarah singkat desa..."
            onChange={(e) => onChange("history", e.target.value)}
          />

          <TextareaGoogle
            name="welcomeMessage"
            label="Sambutan Kepala Desa"
            rows={6}
            value={formData.welcomeMessage ?? ""}
            placeholder="Sambutan kepala desa..."
            onChange={(e) => onChange("welcomeMessage", e.target.value)}
          />
        </div>

        {/* KONTAK */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <InputGoogle
            name="phone"
            label="Nomor Telepon"
            value={formData.phone ?? ""}
            placeholder="0812 3456 7890"
            maxLength={15}
            onChange={(e) => onChange("phone", e.target.value)}
          />

          <InputGoogle
            name="email"
            label="E-mail"
            value={formData.email ?? ""}
            placeholder="desa@email.com"
            onChange={(e) => onChange("email", e.target.value)}
          />

          <InputGoogle
            name="website"
            label="Website"
            value={formData.website ?? ""}
            placeholder="https://desa.com"
            onChange={(e) => onChange("website", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}