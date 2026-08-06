// components/dashboard/news/form/TitleNews.tsx

"use client";

interface Props {
  title: string;
  excerpt: string | null;
  content: string;
  onTitleChange: (value: string) => void;
  onExcerptChange: (value: string) => void;
  onContentChange: (value: string) => void;
}

export default function TitleNews({
  title,
  excerpt,
  content,
  onTitleChange,
  onExcerptChange,
  onContentChange,
}: Props) {
  return (
    <div className="space-y-5">
      {/* TITLE */}
      <div>
        <label className="mb-2 block text-sm font-medium">Judul</label>
        <input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Masukkan judul berita"
          className="w-full rounded-lg border px-4 py-2"
        />
      </div>

      {/* EXCERPT */}
      <div>
        <label className="mb-2 block text-sm font-medium">Ringkasan</label>
        <input
          value={excerpt ?? ""}
          onChange={(e) => onExcerptChange(e.target.value)}
          placeholder="Ringkasan singkat berita..."
          className="w-full rounded-lg border px-4 py-2"
        />
      </div>

      {/* CONTENT */}
      <div>
        <label className="mb-2 block text-sm font-medium">Isi Berita</label>
        <textarea
          rows={8}
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Tulis isi berita..."
          className="w-full rounded-lg border px-4 py-2"
        />
      </div>
    </div>
  );
}