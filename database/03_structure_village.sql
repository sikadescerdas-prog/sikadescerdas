-- database/03_structure_village.sql
-- =====================================================
-- DATABASE STRUCTURE VILLAGE
-- =====================================================

-- =====================================================
-- VILLAGE STRUCTURE CATEGORIES
-- =====================================================

CREATE TABLE village_structure_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(30) NOT NULL UNIQUE,
    level SMALLINT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- VILLAGE STRUCTURE GROUPS
-- =====================================================

CREATE TABLE village_structure_groups (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_structure_group_category
        FOREIGN KEY (category_id)
        REFERENCES village_structure_categories(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_structure_group
        UNIQUE(category_id, name)
);

CREATE INDEX idx_structure_group_category
ON village_structure_groups(category_id);

-- =====================================================
-- VILLAGE STRUCTURE POSITIONS
-- =====================================================

CREATE TABLE village_structure_positions (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL,
    group_id BIGINT,
    parent_id BIGINT,
    name VARCHAR(100) NOT NULL,
    is_multiple BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_position_category
        FOREIGN KEY (category_id)
        REFERENCES village_structure_categories(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_position_group
        FOREIGN KEY (group_id)
        REFERENCES village_structure_groups(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_position_parent
        FOREIGN KEY (parent_id)
        REFERENCES village_structure_positions(id)
        ON DELETE SET NULL
);

CREATE UNIQUE INDEX uq_structure_position
ON village_structure_positions (
    category_id,
    COALESCE(group_id, 0),
    name
);

CREATE INDEX idx_position_category
ON village_structure_positions(category_id);

CREATE INDEX idx_position_group
ON village_structure_positions(group_id);

CREATE INDEX idx_position_parent
ON village_structure_positions(parent_id);

-- =====================================================
-- VILLAGE STRUCTURE PERIODS
-- =====================================================

CREATE TABLE village_structure_periods (
    id BIGSERIAL PRIMARY KEY,
    start_year SMALLINT NOT NULL,
    end_year SMALLINT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_structure_period
        UNIQUE(start_year, end_year),

    CONSTRAINT ck_structure_period
        CHECK (end_year >= start_year)
);

-- =====================================================
-- VILLAGE STRUCTURES
-- =====================================================

CREATE TABLE village_structures (
    id BIGSERIAL PRIMARY KEY,
    village_id BIGINT NOT NULL,
    period_id BIGINT NOT NULL,
    position_id BIGINT NOT NULL,

    full_name VARCHAR(100) NOT NULL,

    gender VARCHAR(10)
        CHECK (
            gender IN ('male', 'female')
        ),

    photo_url TEXT,
    photo_public_id VARCHAR(255),

    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_structure_village
        FOREIGN KEY (village_id)
        REFERENCES villages(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_structure_period
        FOREIGN KEY (period_id)
        REFERENCES village_structure_periods(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_structure_position
        FOREIGN KEY (position_id)
        REFERENCES village_structure_positions(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_structure_village
ON village_structures(village_id);

CREATE INDEX idx_structure_period
ON village_structures(period_id);

CREATE INDEX idx_structure_position
ON village_structures(position_id);

CREATE UNIQUE INDEX uq_structure_member
ON village_structures (
    village_id,
    period_id,
    position_id,
    full_name
);