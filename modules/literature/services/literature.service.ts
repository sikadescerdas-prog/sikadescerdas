// modules/dashboard/literature/services/literature.service.ts

import type {
  Literature,
  LiteratureCreatePayload,
  LiteratureFilter,
} from "../types/literature.types";

const API_URL = "/api/literature";

async function getResponseData<T>(
  response: Response,
  fallback: string
): Promise<T> {
  const text = await response.text();

  if (!text) {
    throw new Error(fallback);
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    console.error("INVALID API RESPONSE:", text);
    throw new Error(fallback);
  }
}

async function getErrorMessage(
  response: Response,
  fallback: string
): Promise<string> {
  const text = await response.text();

  if (!text) return fallback;

  try {
    const error = JSON.parse(text);
    return error.message ?? fallback;
  } catch {
    return text || fallback;
  }
}

function toApiPayload(
  data: Partial<LiteratureCreatePayload>
) {
  return {
    ...(data.type !== undefined && {
      type: data.type,
    }),
    ...(data.title !== undefined && {
      title: data.title,
    }),
    ...(data.description !== undefined && {
      description: data.description,
    }),
    ...(data.categoryId !== undefined && {
      category_id: data.categoryId,
    }),
    ...(data.content !== undefined && {
      content: data.content,
    }),
    ...(data.fileUrl !== undefined && {
      file_url: data.fileUrl,
    }),
    ...(data.filePublicId !== undefined && {
      file_public_id: data.filePublicId,
    }),
    ...(data.bookUrl !== undefined && {
      book_url: data.bookUrl,
    }),
    ...(data.thumbnailUrl !== undefined && {
      thumbnail_url: data.thumbnailUrl,
    }),
    ...(data.thumbnailPublicId !== undefined && {
      thumbnail_public_id: data.thumbnailPublicId,
    }),
    ...(data.is_active !== undefined && {
      is_active: data.is_active,
    }),
    ...(data.links !== undefined && {
      links: data.links,
    }),
  };
}

/* =========================
   GET ALL
========================= */

export async function getLiteratures(
  filter: LiteratureFilter = {}
): Promise<Literature[]> {
  const params = new URLSearchParams();

  if (filter.search) {
    params.set("search", filter.search);
  }

  if (filter.type) {
    params.set("type", filter.type);
  }

  const query = params.toString();

  const response = await fetch(
    query ? `${API_URL}?${query}` : API_URL,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Gagal mengambil data literasi"
      )
    );
  }

  return getResponseData<Literature[]>(
    response,
    "Gagal mengambil data literasi"
  );
}

/* =========================
   GET BY SLUG
========================= */

export async function getLiteratureBySlug(
  slug: string
): Promise<Literature> {
  if (!slug) {
    throw new Error("Slug literasi tidak ditemukan.");
  }

  const response = await fetch(
    `${API_URL}/${encodeURIComponent(slug)}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Gagal mengambil detail literasi"
      )
    );
  }

  return getResponseData<Literature>(
    response,
    "Gagal mengambil detail literasi"
  );
}

/* =========================
   CREATE
========================= */

export async function createLiterature(
  data: LiteratureCreatePayload
): Promise<Literature> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(toApiPayload(data)),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Gagal menambahkan literasi"
      )
    );
  }

  return getResponseData<Literature>(
    response,
    "Gagal menambahkan literasi"
  );
}

/* =========================
   UPDATE BY SLUG
========================= */

export async function updateLiterature(
  slug: string,
  data: Partial<LiteratureCreatePayload>
): Promise<Literature> {
  if (!slug) {
    throw new Error("Slug literasi tidak ditemukan.");
  }

  const response = await fetch(
    `${API_URL}/${encodeURIComponent(slug)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toApiPayload(data)),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Gagal memperbarui literasi"
      )
    );
  }

  return getResponseData<Literature>(
    response,
    "Gagal memperbarui literasi"
  );
}

/* =========================
   DELETE BY SLUG
========================= */

export async function deleteLiterature(
  slug: string
): Promise<void> {
  if (!slug) {
    throw new Error("Slug literasi tidak ditemukan.");
  }

  const response = await fetch(
    `${API_URL}/${encodeURIComponent(slug)}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Gagal menghapus literasi"
      )
    );
  }
}