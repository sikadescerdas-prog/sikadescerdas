// modules/literature/utils/literature.form.ts

import type {
  Literature,
  LiteratureForm,
  LiteratureLinkForm,
} from "../types/literature.types";

export function createEmptyLiteratureForm(): LiteratureForm {
  return {
    type: "article",
    title: "",
    description: null,
    categoryId: null,
    content: null,
    thumbnail: {
      url: null,
      publicId: null,
      file: null,
    },
    fileUrl: null,
    filePublicId: null,
    file: null,
    bookUrl: null,
    links: [],
  };
}

export function literatureToForm(
  literature: Literature
): LiteratureForm {
  const links: LiteratureLinkForm[] =
    (literature.literature_links ?? []).map((link) => ({
      platform: link.platform,
      url: link.url,
    }));

  return {
    type: literature.type,
    title: literature.title,
    description: literature.description,
    categoryId: literature.category_id
      ? String(literature.category_id)
      : null,
    content: literature.content,
    thumbnail: {
      url: literature.thumbnail_url,
      publicId: literature.thumbnail_public_id,
      file: null,
    },
    fileUrl: literature.file_url,
    filePublicId: literature.file_public_id,
    file: null,
    bookUrl: literature.book_url,
    links,
  };
}