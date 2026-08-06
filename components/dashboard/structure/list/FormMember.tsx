// components/dashboard/structure/FormMember.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";

import InputGoogle from "@/components/ui/InputGoogle";
import SelectGoogle from "@/components/ui/SelectGoogle";
import ImageUpload from "@/components/shared/media/ImageUpload";

import type {
  StructureMember,
  StructureMemberForm,
  StructurePeriod,
  Gender,
} from "@/modules/dashboard/structure/types/structure.types";

interface FormMemberProps {
  initialData?: StructureMember;
  periods: StructurePeriod[];
  positions: any[];
  photoPreview: string | null;
  onUpload: (file: File) => void;
  onDeletePhoto: () => void;
  onBack: () => void;
  onSubmit: (data: StructureMemberForm) => Promise<void>;
}

const INITIAL_FORM_STATE: StructureMemberForm = {
  period_id: "",
  position_id: "",
  full_name: "",
  gender: null,
  photo: {
    url: null,
    publicId: null,
    file: null,
  },
  phone: null,
  email: null,
  address: null,
};

const GENDER_OPTIONS = [
  { value: "", label: "Pilih Jenis Kelamin" },
  { value: "male", label: "Laki-laki" },
  { value: "female", label: "Perempuan" },
];

// Urutan prioritas jabatan dari tertinggi ke bawah
const POSITION_ORDER = [
  "Kepala Desa",
  "Sekretaris Desa",
  "Kaur",
  "Kasi",
  "Kepala Dusun",
  "Kadus",
  "Ketua",
  "Wakil Ketua",
  "Sekretaris",
  "Bendahara",
  "Anggota",
];

export default function FormMember({
  initialData,
  periods,
  positions,
  photoPreview,
  onUpload,
  onDeletePhoto,
  onBack,
  onSubmit,
}: FormMemberProps) {
  const [form, setForm] = useState<StructureMemberForm>(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialData) {
      setForm(INITIAL_FORM_STATE);
      return;
    }

    setForm({
      period_id: initialData.period_id,
      position_id: initialData.position_id,
      full_name: initialData.full_name,
      gender: initialData.gender ?? null,
      photo: {
        url: initialData.photo_url ?? null,
        publicId: initialData.photo_public_id ?? null,
        file: null,
      },
      phone: initialData.phone ?? null,
      email: initialData.email ?? null,
      address: initialData.address ?? null,
    });
  }, [initialData]);

  function handleNullableChange(field: keyof StructureMemberForm, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value.trim() ? value : null,
    }));
  }

  function handleUpload(file: File) {
    onUpload(file);
    setForm((prev) => ({
      ...prev,
      photo: {
        ...prev.photo,
        file,
      },
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  }

  const periodOptions = useMemo(
    () => [
      { value: "", label: "Pilih Periode" },
      ...periods.map((item) => ({
        value: item.id,
        label: `${item.start_year} - ${item.end_year}`,
      })),
    ],
    [periods]
  );

  const positionOptions = useMemo(() => {
    const sorted = [...positions].sort((a, b) => {
      const aIndex = POSITION_ORDER.findIndex((keyword) =>
        a.name.toLowerCase().includes(keyword.toLowerCase())
      );
      const bIndex = POSITION_ORDER.findIndex((keyword) =>
        b.name.toLowerCase().includes(keyword.toLowerCase())
      );

      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    });

    return [
      { value: "", label: "Pilih Jabatan" },
      ...sorted.map((item) => ({
        value: item.id,
        label: item.group ? `${item.group.name} - ${item.name}` : item.name,
      })),
    ];
  }, [positions]);

  return (
    <div className="rounded-xl border bg-white">
      {/* HEADER */}
      <div className="flex items-center gap-3 border-b px-6 py-4">
        <button type="button" onClick={onBack} className="rounded-lg border p-2 hover:bg-gray-50">
          <ArrowLeft size={18} />
        </button>

        <div>
          <h3 className="font-semibold text-gray-900">
            {initialData ? "Edit Pejabat Struktur" : "Tambah Pejabat Struktur"}
          </h3>
          <p className="text-sm text-gray-500">Isi data pejabat yang mengisi jabatan desa</p>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-5 p-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[220px_1fr]">
          {/* FOTO */}
          <div>
            <ImageUpload
              ratio="square"
              imageUrl={photoPreview ?? form.photo.url}
              label="Upload Foto Pejabat"
              onUpload={handleUpload}
              onDelete={onDeletePhoto}
            />
          </div>

          {/* CONTENT */}
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <SelectGoogle
                label="Periode Struktur"
                required
                value={form.period_id}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    period_id: e.target.value,
                  }))
                }
                options={periodOptions}
              />

              <SelectGoogle
                label="Jabatan"
                required
                value={form.position_id}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    position_id: e.target.value,
                  }))
                }
                options={positionOptions}
              />
            </div>

            <InputGoogle
              label="Nama Lengkap"
              placeholder="Masukkan nama lengkap beserta gelar"
              required
              value={form.full_name}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  full_name: e.target.value,
                }))
              }
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <SelectGoogle
                label="Jenis Kelamin"
                value={form.gender ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    gender: (e.target.value as Gender) || null,
                  }))
                }
                options={GENDER_OPTIONS}
              />

              <InputGoogle
                label="Nomor Telepon"
                placeholder="Contoh: 08123456789"
                value={form.phone ?? ""}
                onChange={(e) => handleNullableChange("phone", e.target.value)}
              />

              <InputGoogle
                label="Email"
                type="email"
                placeholder="Contoh: nama@email.com"
                value={form.email ?? ""}
                onChange={(e) => handleNullableChange("email", e.target.value)}
              />
            </div>

            <InputGoogle
              label="Alamat"
              placeholder="Masukkan alamat domisili lengkap"
              value={form.address ?? ""}
              onChange={(e) => handleNullableChange("address", e.target.value)}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 border-t pt-5">
          <button type="button" onClick={onBack} className="rounded-lg border px-5 py-2 text-sm hover:bg-gray-50">
            Batal
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            <Save size={16} />
            {loading ? "Menyimpan..." : initialData ? "Perbarui" : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}