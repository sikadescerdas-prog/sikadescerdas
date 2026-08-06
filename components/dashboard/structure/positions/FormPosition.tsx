// components/dashboard/structure/positions/FormPosition.tsx

"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Swal from "sweetalert2";

import InputGoogle from "@/components/ui/InputGoogle";
import SelectGoogle from "@/components/ui/SelectGoogle";

import type {
  StructureCategory,
  StructureGroup,
  StructurePosition,
  StructurePositionForm,
} from "@/modules/dashboard/structure/types/structure.types";

interface Props {
  initialData?: StructurePosition;
  categories: StructureCategory[];
  groups: StructureGroup[];
  positions: StructurePosition[];
  addGroup: (data: { name: string; category_id: string }) => Promise<StructureGroup>;
  onBack: () => void;
  onSubmit: (data: StructurePositionForm) => Promise<void>;
}

const GOVERNMENT_ORDER = [
  "Kepala Desa",
  "Sekretaris Desa",
  "Kaur Tata Usaha dan Umum",
  "Kaur Keuangan",
  "Kaur Perencanaan",
  "Kasi Pemerintahan",
  "Kasi Kesejahteraan",
  "Kasi Pelayanan",
  "Kepala Dusun",
];

const INSTITUTION_POSITIONS = ["Ketua", "Wakil Ketua", "Sekretaris", "Bendahara", "Anggota"];

export default function FormPosition({
  initialData,
  categories,
  groups,
  positions,
  addGroup,
  onBack,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<StructurePositionForm>({
    category_id: "",
    parent_id: null,
    group_id: null,
    name: "",
    is_multiple: false,
  });

  const [loading, setLoading] = useState(false);
  const [createGroup, setCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm({
        category_id: initialData.category_id,
        parent_id: initialData.parent_id ?? null,
        group_id: initialData.group_id ?? null,
        name: initialData.name,
        is_multiple: initialData.is_multiple ?? false,
      });
    } else {
      setForm({
        category_id: "",
        parent_id: null,
        group_id: null,
        name: "",
        is_multiple: false,
      });
      setCreateGroup(false);
      setNewGroupName("");
    }
  }, [initialData]);

  const selectedCategory = categories.find((item) => item.id === form.category_id);
  const isGovernment = selectedCategory?.type === "government";
  const isInstitution = selectedCategory?.type === "institution";

  const parentPositions = positions
    .filter((item) => item.category_id === form.category_id && item.parent_id === null)
    .sort((a, b) => {
      const aIndex = GOVERNMENT_ORDER.indexOf(a.name);
      const bIndex = GOVERNMENT_ORDER.indexOf(b.name);
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    });

  const selectedGroups = groups.filter((item) => item.category_id === form.category_id);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      let groupId = form.group_id;

      if (isInstitution && createGroup) {
        if (!newGroupName.trim()) {
          await Swal.fire({
            icon: "warning",
            title: "Nama lembaga kosong",
            text: "Silakan isi nama lembaga terlebih dahulu",
          });
          return;
        }

        const newGroup = await addGroup({
          name: newGroupName,
          category_id: form.category_id,
        });
        groupId = newGroup.id;
      }

      await onSubmit({
        ...form,
        group_id: groupId,
      });

      await Swal.fire({
        icon: "success",
        title: initialData ? "Berhasil diperbarui" : "Berhasil ditambahkan",
        text: initialData ? "Jabatan berhasil diperbarui" : "Jabatan berhasil ditambahkan",
        timer: 1500,
        showConfirmButton: false,
      });

      onBack();
    } catch (error) {
      console.error(error);
      await Swal.fire({
        icon: "error",
        title: "Gagal menyimpan",
        text: error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan data",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl bg-white">
      {/* HEADER */}
      <div className="flex items-center gap-3 border-b px-6 py-4">
        <button type="button" onClick={onBack} className="rounded-lg border p-2 hover:bg-gray-50">
          <ArrowLeft size={18} />
        </button>

        <div>
          <h3 className="font-semibold text-gray-950">
            {initialData ? "Edit Jabatan" : "Tambah Jabatan"}
          </h3>
          <p className="text-sm text-gray-500">Kelola struktur organisasi desa</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 p-6">
        <SelectGoogle
          label="Kategori"
          required
          value={form.category_id}
          onChange={(e) => {
            setForm((prev) => ({
              ...prev,
              category_id: e.target.value,
              parent_id: null,
              group_id: null,
              name: "",
            }));
          }}
          options={[
            { value: "", label: "Pilih kategori" },
            ...categories.map((item) => ({ value: item.id, label: item.name })),
          ]}
        />

        {/* PEMERINTAH */}
        {isGovernment && (
          <>
            <SelectGoogle
              label="Struktur di bawah"
              value={form.parent_id ?? ""}
              onChange={(e) => {
                setForm((prev) => ({
                  ...prev,
                  parent_id: e.target.value || null,
                }));
              }}
              options={[
                { value: "", label: "Kepala Desa (Pimpinan Utama)" },
                ...parentPositions.map((item) => ({ value: item.id, label: item.name })),
              ]}
            />

            <InputGoogle
              label="Nama Jabatan"
              required
              placeholder="Contoh: Kepala Desa"
              value={form.name}
              onChange={(e) => {
                setForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }));
              }}
            />

            <p className="text-xs text-gray-500">
              Catatan: Pilih struktur di bawah jika jabatan berada di bawah Kepala Desa.
            </p>
          </>
        )}

        {/* LEMBAGA DESA */}
        {isInstitution && (
          <>
            <SelectGoogle
              label="Lembaga"
              required
              value={createGroup ? "new" : form.group_id ?? ""}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "new") {
                  setCreateGroup(true);
                  setForm((prev) => ({
                    ...prev,
                    group_id: null,
                    name: "",
                  }));
                  return;
                }

                setCreateGroup(false);
                setForm((prev) => ({
                  ...prev,
                  group_id: value || null,
                  name: "",
                }));
              }}
              options={[
                { value: "", label: "Pilih lembaga" },
                ...selectedGroups.map((item) => ({ value: item.id, label: item.name })),
                { value: "new", label: "+ Tambah Lembaga Baru" },
              ]}
            />

            {createGroup && (
              <InputGoogle
                label="Nama Lembaga Baru"
                required
                placeholder="Contoh: Posyandu"
                value={newGroupName}
                onChange={(e) => {
                  setNewGroupName(e.target.value);
                }}
              />
            )}

            {(form.group_id || createGroup) && (
              <SelectGoogle
                label="Jabatan Lembaga"
                required
                value={form.name}
                onChange={(e) => {
                  setForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }));
                }}
                options={[
                  { value: "", label: "Pilih jabatan" },
                  ...INSTITUTION_POSITIONS.map((item) => ({ value: item, label: item })),
                ]}
              />
            )}

            <p className="text-xs text-gray-500">
              Pilih lembaga terlebih dahulu, kemudian pilih jabatan.
            </p>
          </>
        )}

        <div className="flex justify-end gap-3 border-t pt-6">
          <button type="button" onClick={onBack} className="rounded-lg border px-5 py-2 hover:bg-gray-50">
            Batal
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700 disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "Menyimpan..." : initialData ? "Perbarui" : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}