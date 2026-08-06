-- database/04_facility_village.sql
-- =====================================================
-- DATABASE VILLAGE FACILITY
-- =====================================================

-- =====================================================
-- VILLAGE FACILITY CATEGORIES
-- =====================================================

CREATE TABLE village_facility_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- VILLAGE FACILITY TYPES
-- =====================================================

CREATE TABLE village_facility_types (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_facility_type_category
        FOREIGN KEY (category_id)
        REFERENCES village_facility_categories(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_facility_type
        UNIQUE (category_id, name)
);

CREATE INDEX idx_facility_type_category
ON village_facility_types(category_id);

-- =====================================================
-- VILLAGE FACILITIES
-- =====================================================

CREATE TABLE village_facilities (
    id BIGSERIAL PRIMARY KEY,

    village_id BIGINT NOT NULL,
    type_id BIGINT NOT NULL,

    name VARCHAR(150) NOT NULL,

    image_url TEXT,
    image_public_id VARCHAR(255),

    address TEXT,

    link_maps TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_facility_village
        FOREIGN KEY (village_id)
        REFERENCES villages(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_facility_type
        FOREIGN KEY (type_id)
        REFERENCES village_facility_types(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_facility
        UNIQUE (village_id, type_id, name)
);

CREATE INDEX idx_facility_village
ON village_facilities(village_id);

CREATE INDEX idx_facility_type
ON village_facilities(type_id);