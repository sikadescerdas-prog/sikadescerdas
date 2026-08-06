-- database/08_literatures.sql
-- =====================================================
-- DATABASE LITERATURES
-- =====================================================

-- ARTICLE
--   type
--   title
--   slug
--   category_id
--   description
--   content
--   thumbnail
--   links

-- BOOK
--   type
--   title
--   slug
--   description
--   file
--   book_url
--   thumbnail
--   links


-- =====================================================
-- LITERATURE CATEGORIES
-- =====================================================
CREATE TABLE literature_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- LITERATURES
-- Artikel dan Buku dalam satu tabel
-- =====================================================
CREATE TABLE literatures (
    id BIGSERIAL PRIMARY KEY,
    author_id VARCHAR(50) NOT NULL,
    -- TYPE
    -- article = Artikel
    -- book    = Buku
    type VARCHAR(20) NOT NULL
        CHECK (type IN ('article', 'book')),

    -- CATEGORY
    -- Hanya digunakan oleh artikel
    -- Buku harus NULL
    category_id BIGINT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    content TEXT,

    -- BOOK
    -- Hanya digunakan jika type = book
    file_url TEXT,
    file_public_id VARCHAR(255),
    book_url TEXT,

    thumbnail_url TEXT,
    thumbnail_public_id VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- =================================================
    -- RELATION AUTHOR
    -- =================================================
    CONSTRAINT fk_literatures_author
        FOREIGN KEY (author_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    -- =================================================
    -- RELATION CATEGORY
    -- =================================================
    CONSTRAINT fk_literatures_category
        FOREIGN KEY (category_id)
        REFERENCES literature_categories(id)
        ON DELETE SET NULL,

    CONSTRAINT chk_literature_type_fields
        CHECK (
            (
                type = 'article'
                AND file_url IS NULL
                AND file_public_id IS NULL
                AND book_url IS NULL
            )
            OR
            (
                type = 'book'
                AND category_id IS NULL
                AND content IS NULL
            )
        )
);

-- =====================================================
-- LITERATURE LINKS
-- Link tambahan untuk literasi
-- =====================================================
CREATE TABLE literature_links (
    id BIGSERIAL PRIMARY KEY,
    literature_id BIGINT NOT NULL,
    platform VARCHAR(20) NOT NULL
        CHECK (
            platform IN (
                'youtube',
                'tiktok',
                'instagram',
                'facebook',
                'website',
                'x'
            )
        ),
    url TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_literature_links
        FOREIGN KEY (literature_id)
        REFERENCES literatures(id)
        ON DELETE CASCADE
);


-- =====================================================
-- INDEX
-- =====================================================

CREATE INDEX idx_literatures_author
    ON literatures(author_id);
CREATE INDEX idx_literatures_type
    ON literatures(type);
CREATE INDEX idx_literatures_category
    ON literatures(category_id);
CREATE INDEX idx_literatures_active
    ON literatures(is_active);
CREATE INDEX idx_literature_links_literature
    ON literature_links(literature_id);

-- =====================================================
-- DEFAULT LITERATURE CATEGORIES
-- =====================================================
INSERT INTO literature_categories (name)
VALUES
    ('Pendidikan'),
    ('Kesehatan'),
    ('Teknologi'),
    ('Ekonomi'),
    ('Pertanian'),
    ('Pemerintahan'),
    ('Sosial & Masyarakat'),
    ('Lingkungan'),
    ('Budaya & Pariwisata'),
    ('Keagamaan'),
    ('Hukum'),
    ('Lainnya')
ON CONFLICT (name) DO NOTHING;