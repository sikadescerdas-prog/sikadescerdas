-- database/05_potential_village.sql
-- =====================================================
-- DATABASE VILLAGE FACILITY
-- =====================================================
-- =========================
-- VILLAGE POTENTIAL CATEGORIES
-- =========================

CREATE TABLE village_potential_categories (
    id BIGSERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================
-- VILLAGE POTENTIALS
-- =========================

CREATE TABLE village_potentials (
    id BIGSERIAL PRIMARY KEY,

    village_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,

    name VARCHAR(150) NOT NULL,
    description TEXT,

    image_url TEXT,
    image_public_id VARCHAR(255),

    address TEXT,
    link_maps TEXT,

    website VARCHAR(255),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_potential_category
        FOREIGN KEY (category_id)
        REFERENCES village_potential_categories(id)
        ON DELETE CASCADE,


    CONSTRAINT fk_potential_village
        FOREIGN KEY (village_id)
        REFERENCES villages(id)
        ON DELETE CASCADE,


    CONSTRAINT uq_potential_name
        UNIQUE(village_id, category_id, name)
);