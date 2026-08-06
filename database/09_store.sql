-- database/09_store.sql
-- =====================================================
-- DATABASE UMKM DESA
-- =====================================================

-- =====================================================
-- STORES / UMKM
-- =====================================================

CREATE TABLE stores (
    id BIGSERIAL PRIMARY KEY,
    owner_id VARCHAR(50) NOT NULL UNIQUE,

    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,

    -- Logo
    logo_url TEXT,
    logo_public_id VARCHAR(255),

    -- Banner
    banner_url TEXT,
    banner_public_id VARCHAR(255),

    -- Kontak
    phone VARCHAR(20),
    email VARCHAR(100),

    -- Alamat
    province VARCHAR(100),
    regency VARCHAR(100),
    district VARCHAR(100),
    village VARCHAR(100),
    address TEXT,

    -- Lokasi
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),

    -- Status
    is_store_complete BOOLEAN NOT NULL DEFAULT FALSE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_store_owner
        FOREIGN KEY (owner_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- =====================================================
-- STORE MARKETPLACES
-- =====================================================

CREATE TABLE store_marketplaces (
    id BIGSERIAL PRIMARY KEY,
    store_id BIGINT NOT NULL,

    platform VARCHAR(30) NOT NULL
        CHECK (
            platform IN (
                'shopee',
                'tiktok_shop',
                'tokopedia'
            )
        ),

    url TEXT NOT NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_store_marketplace
        FOREIGN KEY (store_id)
        REFERENCES stores(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_store_platform
        UNIQUE (store_id, platform)
);

-- =====================================================
-- PRODUCT CATEGORIES
-- =====================================================

CREATE TABLE product_categories (
    id BIGSERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PRODUCTS
-- =====================================================

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    store_id BIGINT NOT NULL,
    category_id BIGINT,

    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,

    -- Thumbnail
    thumbnail_url TEXT NOT NULL,
    thumbnail_public_id VARCHAR(255),

    -- Harga
    price DECIMAL(15,0) NOT NULL DEFAULT 0,

    -- Stok
    stock INTEGER NOT NULL DEFAULT 0,

    -- Satuan
    unit VARCHAR(30),

    -- Berat (Kg)
    weight DECIMAL(10,2),

    -- Status
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_store
        FOREIGN KEY (store_id)
        REFERENCES stores(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_product_category
        FOREIGN KEY (category_id)
        REFERENCES product_categories(id)
        ON DELETE SET NULL
);

-- =====================================================
-- PRODUCT IMAGES
-- =====================================================

CREATE TABLE product_images (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,

    image_url TEXT NOT NULL,
    image_public_id VARCHAR(255),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_image
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_stores_owner_id
    ON stores(owner_id);

CREATE INDEX idx_store_marketplaces_store_id
    ON store_marketplaces(store_id);

CREATE INDEX idx_products_store_id
    ON products(store_id);

CREATE INDEX idx_products_category_id
    ON products(category_id);

CREATE INDEX idx_product_images_product_id
    ON product_images(product_id);

-- =====================================================
-- MASTER DATA PRODUCT CATEGORIES
-- =====================================================

INSERT INTO product_categories (name, is_active)
VALUES
    ('Makanan', TRUE),
    ('Minuman', TRUE),
    ('Fashion', TRUE),
    ('Kerajinan', TRUE),
    ('Pertanian', TRUE),
    ('Peternakan', TRUE),
    ('Jasa', TRUE),
    ('Lainnya', TRUE);