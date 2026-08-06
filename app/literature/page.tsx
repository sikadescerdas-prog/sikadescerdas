// app/literature/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, FileText, LayoutGrid, Users } from "lucide-react";
import HeaderLiterature from "@/components/literature/HeaderLiterature";
import BacaUMP from "@/components/literature/BacaUMP";
import ListLiterature from "@/components/literature/ListLiterature";
import PageToolbar from "@/components/shared/page/PageToolbar";
import { useLiterature } from "@/modules/literature/hooks/useLiterature";
import type { Literature } from "@/modules/literature/types/literature.types";

interface CurrentUser {
  id: string;
  username?: string | null;
  role: string;
}

export default function LiteraturePage() {
  const router = useRouter();
  const {
    literatures,
    loading,
    fetchLiteratures,
    removeLiterature,
    toggleLiteratureActive,
  } = useLiterature();

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [type, setType] = useState<"all" | "book" | "article" | "mine">("all");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isCheckingUser, setIsCheckingUser] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) {
          setCurrentUser(null);
          return;
        }
        const data = await res.json();
        setCurrentUser(data.user ?? null);
      } catch (error) {
        console.error("USER ERROR", error);
        setCurrentUser(null);
      } finally {
        setIsCheckingUser(false);
      }
    }

    loadUser();
  }, []);

  const isLogin = Boolean(currentUser);

  const filters = useMemo(() => {
    const base = [
      { value: "all", label: "Semua", icon: LayoutGrid },
      { value: "book", label: "Buku", icon: BookOpen },
      { value: "article", label: "Artikel", icon: FileText },
    ];

    if (isLogin) {
      base.push({
        value: "mine",
        label: "Milik Saya",
        icon: Users,
      });
    }

    return base;
  }, [isLogin]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLiteratures({
        search: search || undefined,
        type: type === "all" || type === "mine" ? undefined : type,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [search, type, fetchLiteratures]);

  function updateUrl(searchValue: string, typeValue: string) {
    const params = new URLSearchParams();
    if (searchValue.trim()) {
      params.set("search", searchValue.trim());
    }
    if (typeValue !== "all") {
      params.set("type", typeValue);
    }
    const query = params.toString();
    router.push(query ? `/literature?${query}` : "/literature");
  }

  function handleSearch() {
    setSearch(searchInput.trim());
    updateUrl(searchInput, type);
  }

  function handleFilter(value: string) {
    if (value === "mine" && !isLogin) {
      return;
    }
    setType(value as "all" | "book" | "article" | "mine");
    updateUrl(search, value);
  }

  function handleReset() {
    setSearch("");
    setSearchInput("");
    setType("all");
    router.push("/literature");
  }

  function handleAdd() {
    router.push("/literature/form");
  }

  function handleOpenModal(item: Literature) {
    console.log("OPEN", item);
  }

  function handleEdit(item: Literature) {
    if (!item.slug) return;
    router.push(`/literature/form?edit=${encodeURIComponent(item.slug)}`);
  }

  async function handleDelete(slug: string) {
    if (!slug) return;
    await removeLiterature(slug);
  }

  async function handleToggleActive(item: Literature) {
    if (!item.slug) return;
    await toggleLiteratureActive(item.slug, !item.is_active);
  }

  return (
    <div className="w-full space-y-6">
      <HeaderLiterature />

      <div className="sticky top-12 z-40 pt-2 pb-2 lg:px-8">
        <PageToolbar
          title="Literasi"
          filters={filters}
          activeFilter={type}
          search={searchInput}
          onFilterChange={handleFilter}
          onSearchChange={setSearchInput}
          onSearch={handleSearch}
          onReset={handleReset}
          onAdd={!isCheckingUser && isLogin ? handleAdd : undefined}
        />
      </div>

      <ListLiterature
        items={literatures}
        isAdmin={currentUser?.role === "admin" || currentUser?.role === "superadmin"}
        currentUserId={currentUser?.id ?? null}
        loading={loading}
        onOpenModal={handleOpenModal}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
      />

      <BacaUMP />
    </div>
  );
}