// components/dashboard/users/UserList.tsx

"use client";

import { useState } from "react";
import { useUsers } from "@/core/users/hooks/useUsers";
import { useTableQuery } from "@/shared/hooks/useTableQuery";
import UsersHeader from "./UsersHeader";
import { FaSpinner, FaSearch, FaEye, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function UserList() {
  const { users, loading, error, refreshUsers } = useUsers();
  const { search, setSearch, page, setPage, limit } = useTableQuery({ defaultLimit: 50 });

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredUsers = users.filter((user) => {
    const role = user.role || "user";
    // Sembunyikan superadmin dari daftar tabel agar aman
    if (role === "superadmin") return false;

    const term = search.toLowerCase();
    const fullname = user.fullname?.toLowerCase() || "";
    const username = user.username?.toLowerCase() || "";
    const email = user.email?.toLowerCase() || "";

    return fullname.includes(term) || username.includes(term) || email.includes(term);
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const roleA = a.role || "user";
    const roleB = b.role || "user";

    const getOrder = (role: string) => {
      if (role === "admin") return 1;
      if (role === "user") return 2;
      if (role === "seller") return 3;
      return 4;
    };

    return getOrder(roleA) - getOrder(roleB);
  });

  const totalPages = Math.ceil(sortedUsers.length / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedUsers = sortedUsers.slice(startIndex, startIndex + limit);

  async function handleDelete(userId: string) {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Gagal menghapus akun.");
      }

      alert("Akun berhasil dihapus.");
      setDeletingId(null);
      refreshUsers();
    } catch (error: any) {
      console.error("DELETE USER ERROR:", error);
      alert(error.message || "Terjadi kesalahan server.");
    } finally {
      setIsDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <UsersHeader searchTerm={search} setSearchTerm={setSearch} />
        <div className="flex flex-col items-center justify-center gap-3 p-16 text-slate-400 dark:text-slate-500">
          <FaSpinner className="animate-spin text-xl text-green-500" />
          <p className="text-sm font-medium">Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <UsersHeader searchTerm={search} setSearchTerm={setSearch} />
        <div className="m-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-8 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          <div>
            <span className="font-semibold">Gagal memuat data:</span> {error}
          </div>
          <button
            onClick={refreshUsers}
            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <UsersHeader searchTerm={search} setSearchTerm={setSearch} />

      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/50 px-6 py-3 dark:border-slate-800 dark:bg-slate-800/30">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Daftar Admin Desa & Pengguna Sistem
        </span>
        <div className="text-xs text-slate-400">
          Total: <span className="font-semibold text-slate-700 dark:text-slate-200">{sortedUsers.length}</span> data
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-800/40">
              <th className="px-6 py-3.5">Nama Lengkap</th>
              <th className="px-6 py-3.5">Username</th>
              <th className="px-6 py-3.5">Email</th>
              <th className="px-6 py-3.5">Role</th>
              <th className="px-6 py-3.5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700 dark:divide-slate-800 dark:text-slate-300">
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                      <FaSearch className="text-base" />
                    </div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      Tidak ada pengguna ditemukan
                    </p>
                    <p className="text-xs text-slate-400">Coba ubah kata kunci pencarian Anda.</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => {
                const role = user.role || "user";
                let roleLabel = "Users";
                let badgeColor = "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";

                if (role === "admin") {
                  roleLabel = "Admin Desa";
                  badgeColor = "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
                } else if (role === "seller") {
                  roleLabel = "Penjual";
                  badgeColor = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
                }

                return (
                  <tr key={user.id} className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {user.fullname || "-"}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">@{user.username}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${badgeColor}`}>
                        {roleLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          title="Lihat Detail"
                          className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                          onClick={() => alert(`Detail user: ${user.username}`)}
                        >
                          <FaEye className="text-xs" />
                          <span>Detail</span>
                        </button>
                        <button
                          title="Hapus Akun"
                          className="inline-flex items-center gap-1 rounded-xl bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/40"
                          onClick={() => setDeletingId(user.id)}
                        >
                          <FaTrash className="text-xs" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Halaman <span className="font-semibold text-slate-700 dark:text-slate-200">{page}</span> dari{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-200">{totalPages}</span>
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(Math.max(page - 1, 1))}
            disabled={page === 1}
            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <FaChevronLeft className="text-[10px]" />
            <span>Sebelumnya</span>
          </button>
          <button
            onClick={() => setPage(Math.min(page + 1, totalPages))}
            disabled={page === totalPages || totalPages === 0}
            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <span>Berikutnya</span>
            <FaChevronRight className="text-[10px]" />
          </button>
        </div>
      </div>

      {/* MODAL KONFIRMASI HAPUS */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400 mb-4">
              <FaTrash size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Hapus Akun Ini?
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Tindakan ini bersifat permanen. Akun (termasuk Admin Desa atau pengguna lain yang dipilih) akan dihapus secara total dari sistem.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingId(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => handleDelete(deletingId)}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting && <FaSpinner className="animate-spin text-xs" />}
                <span>Ya, Hapus</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}