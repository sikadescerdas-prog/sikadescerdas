-- database/07_news_village.sql
-- =====================================================
-- DATABASE VILLAGE NEWS
-- =====================================================

-- =========================
-- NEWS
-- =========================

CREATE TABLE news (
    id BIGSERIAL PRIMARY KEY,
    village_id BIGINT NOT NULL,

    -- User pembuat berita (jika user dihapus maka NULL)
    author_id VARCHAR(50),

    -- Category: news = Berita, announcement = Pengumuman, event = Kegiatan
    category VARCHAR(20) NOT NULL CHECK (
        category IN ('news', 'announcement', 'event')
    ),

    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,

    -- Deskripsi singkat & isi lengkap
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,

    -- Thumbnail utama
    thumbnail_url TEXT NOT NULL,
    thumbnail_public_id VARCHAR(255) NOT NULL,

    -- Detail kegiatan (opsional)
    content_date DATE,
    content_time TIME,
    content_location TEXT,

    -- Status & Flag
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_news_village
        FOREIGN KEY (village_id)
        REFERENCES villages(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_news_author
        FOREIGN KEY (author_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);


-- =========================
-- NEWS IMAGES
-- =========================

CREATE TABLE news_images (
    id BIGSERIAL PRIMARY KEY,
    news_id BIGINT NOT NULL,

    image_url TEXT NOT NULL,
    image_public_id VARCHAR(255) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_news_images
        FOREIGN KEY (news_id)
        REFERENCES news(id)
        ON DELETE CASCADE
);


-- =========================
-- NEWS LINKS
-- Banyak link per berita (YouTube, Instagram, Website, Drive, dll)
-- =========================

CREATE TABLE news_links (
    id BIGSERIAL PRIMARY KEY,
    news_id BIGINT NOT NULL,
    platform VARCHAR(30),
    url TEXT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_news_links
        FOREIGN KEY (news_id)
        REFERENCES news(id)
        ON DELETE CASCADE
);