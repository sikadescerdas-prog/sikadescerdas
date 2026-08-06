-- database/06_population_village.sql
-- =====================================================
-- DATABASE VILLAGE POPULATIONS
-- =====================================================

-- =========================
-- VILLAGE POPULATIONS
-- DATA UTAMA DESA
-- =========================
CREATE TABLE village_populations (
    id BIGSERIAL PRIMARY KEY,
    village_id BIGINT NOT NULL,
    year SMALLINT NOT NULL,

    -- DATA UMUM
    total_family_cards INTEGER NOT NULL DEFAULT 0,
    total_male INTEGER NOT NULL DEFAULT 0,
    total_female INTEGER NOT NULL DEFAULT 0,
    total_population INTEGER NOT NULL DEFAULT 0, -- otomatis = total_male + total_female

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_population_village
        FOREIGN KEY (village_id)
        REFERENCES villages(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_population_year
        UNIQUE (village_id, year)
);

-- =========================
-- POPULATION CATEGORIES
-- MASTER KATEGORI
-- =========================
CREATE TABLE population_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    sort_order SMALLINT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- POPULATION MASTER ITEMS
-- DETAIL PILIHAN SETIAP KATEGORI
-- =========================
CREATE TABLE population_master_items (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    sort_order SMALLINT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_population_master_category
        FOREIGN KEY (category_id)
        REFERENCES population_categories(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_population_master_item
        UNIQUE (category_id, name)
);

-- =========================
-- VILLAGE POPULATION DETAILS
-- DATA JUMLAH PER ITEM
-- =========================
CREATE TABLE village_population_details (
    id BIGSERIAL PRIMARY KEY,
    population_id BIGINT NOT NULL,
    item_id BIGINT NOT NULL,
    total INTEGER NOT NULL DEFAULT 0,
    sort_order SMALLINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_population_detail_population
        FOREIGN KEY (population_id)
        REFERENCES village_populations(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_population_detail_item
        FOREIGN KEY (item_id)
        REFERENCES population_master_items(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_population_detail
        UNIQUE (population_id, item_id)
);