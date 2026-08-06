// modules/dashboard/structure/services/member.service.ts

import type { CreateStructureMember } from "../types/structure.types";

const API_URL = "/api/dashboard/structure/members";

// GET MEMBERS
export async function getMembers(params?: {
  period_id?: string;
  position_id?: string;
}) {
  const query = new URLSearchParams();

  if (params?.period_id) query.append("period_id", params.period_id);
  if (params?.position_id) query.append("position_id", params.position_id);

  const url = query.toString() ? `${API_URL}?${query.toString()}` : API_URL;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Gagal mengambil data struktur");
  }

  return response.json();
}

// GET MEMBER BY ID
export async function getMemberById(id: string) {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Member tidak ditemukan");
  }

  const result = await response.json();
  return result.data;
}

// CREATE MEMBER
export async function createMember(data: CreateStructureMember) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Gagal menambahkan pejabat struktur");
  }

  return response.json();
}

// UPDATE MEMBER
export async function updateMember(id: string, data: CreateStructureMember) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      period_id: data.period_id,
      position_id: data.position_id,
      full_name: data.full_name,
      gender: data.gender,
      photo_url: data.photo_url,
      photo_public_id: data.photo_public_id,
      phone: data.phone,
      email: data.email,
      address: data.address,
    }),
  });

  if (!response.ok) {
    throw new Error("Gagal memperbarui pejabat struktur");
  }

  return response.json();
}

// DELETE MEMBER
export async function deleteMember(id: string) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Gagal menghapus pejabat struktur");
  }

  return response.json();
}