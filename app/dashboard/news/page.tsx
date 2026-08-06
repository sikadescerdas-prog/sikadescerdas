// app/dashboard/news/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useNews } from "@/modules/dashboard/news/hooks/useNews";
import type { News, NewsForm } from "@/modules/dashboard/news/types/news.types";
import HeaderNews from "@/components/dashboard/news/HeaderNews";
import TableNews from "@/components/dashboard/news/TableNews";
import FormNews from "@/components/dashboard/news/FormNews";

export default function NewsPage() {
  const { news, loading, saveNews, removeNews, toggleNewsFeatured, table } = useNews();
  const [searchInput, setSearchInput] = useState(table.search);
  const [showForm, setShowForm] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);

  useEffect(() => { setSearchInput(table.search); }, [table.search]);

  function handleSearch() {
    table.setSearch(searchInput);
    table.setPage(1);
  }

  function handleReset() {
    setSearchInput("");
    table.setSearch("");
    table.setCategory("");
    table.setPage(1);
  }

  function handleAdd() {
    setSelectedNews(null);
    setShowForm(true);
  }

  function handleEdit(data: News) {
    setSelectedNews(data);
    setShowForm(true);
  }

  function handleBack() {
    setShowForm(false);
    setSelectedNews(null);
  }

  async function handleSubmit(data: NewsForm) {
    await saveNews(data, selectedNews?.id);
    handleBack();
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <HeaderNews />
      <div className="p-6">
        {showForm ? (
          <FormNews initialData={selectedNews ?? undefined} onBack={handleBack} onSubmit={handleSubmit} />
        ) : (
          <TableNews
            news={news}
            loading={loading}
            search={searchInput}
            category={table.category}
            onSearchChange={setSearchInput}
            onSearch={handleSearch}
            onCategoryChange={(value) => { table.setCategory(value); table.setPage(1); }}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={removeNews}
            onReset={handleReset}
            onToggleFeatured={toggleNewsFeatured}
          />
        )}
      </div>
    </div>
  );
}