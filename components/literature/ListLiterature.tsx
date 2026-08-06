// components/literature/ListLiterature.tsx

"use client";

import { LibraryBig } from "lucide-react";
import type { Literature } from "@/modules/literature/types/literature.types";
import CardArtikel from "./card/CardArtikel";
import CardBook from "./card/CardBook";

interface Props {
  items: Literature[];
  isAdmin: boolean;
  currentUserId?: string | null;
  loading?: boolean;
  onOpenModal: (item: Literature) => void;
  onEdit: (item: Literature) => void;
  onDelete: (id: string, type: string) => Promise<void>;
  onToggleActive: (item: Literature) => Promise<void>;
}

export default function ListLiterature({ items, isAdmin, currentUserId, loading = false, onOpenModal, onEdit, onDelete, onToggleActive }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
            <div className="aspect-video animate-pulse bg-gray-100" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-3/4 animate-pulse rounded-lg bg-gray-100" />
              <div className="h-3 w-full animate-pulse rounded-lg bg-gray-100" />
              <div className="h-3 w-2/3 animate-pulse rounded-lg bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // EMPTY
  if (!items.length) {
    return (
      <div className="rounded-xl bg-white p-12 text-center">
        <LibraryBig size={48} className="mx-auto text-green-500" />
        <p className="mt-3 font-medium text-gray-700">Belum ada literasi</p>
        <p className="mt-1 text-sm text-gray-400">Silakan tambahkan buku atau artikel terlebih dahulu</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const isMine = !!currentUserId && item.author_id === currentUserId;

        if (item.type === "book") {
          return (
            <CardBook
              key={item.id}
              item={item}
              isAdmin={isAdmin}
              isMine={isMine}
              onOpenModal={onOpenModal}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleActive={onToggleActive}
            />
          );
        }

        return (
          <CardArtikel
            key={item.id}
            item={item}
            isAdmin={isAdmin}
            isMine={isMine}
            onOpenModal={onOpenModal}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleActive={onToggleActive}
          />
        );
      })}
    </div>
  );
}