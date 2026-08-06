-- database/02_villages.sql

-- =========================================================
-- VILLAGE MANAGEMENT
-- =========================================================

-- =========================
-- VILLAGES
-- =========================
CREATE TABLE villages (
  id              BIGSERIAL PRIMARY KEY,

  -- Identitas Desa
  name            VARCHAR(150),
  history         TEXT,
  vision          TEXT,
  mission         TEXT,
  welcome_message TEXT,

  -- Logo
  logo_url        TEXT,
  logo_public_id  VARCHAR(255),

  -- Kontak
  email           VARCHAR(100),
  phone           VARCHAR(20),
  website         VARCHAR(255),

  -- Media Sosial
  facebook        VARCHAR(255),
  instagram       VARCHAR(255),
  tiktok          VARCHAR(255),
  youtube         VARCHAR(255),

  -- Alamat Kantor / Pos
  address         TEXT,
  rt              VARCHAR(5),
  rw              VARCHAR(5),
  province        VARCHAR(100),
  regency         VARCHAR(100),
  district        VARCHAR(100),
  village         VARCHAR(100),
  postal_code     VARCHAR(10),

  -- Data Wilayah & Geografis
  area_size       NUMERIC(10, 4),
  founded_year    SMALLINT,
  map_embed       TEXT,

  -- Jumlah Wilayah Administratif
  total_hamlets   INTEGER NOT NULL DEFAULT 0,
  total_rw        INTEGER NOT NULL DEFAULT 0,
  total_rt        INTEGER NOT NULL DEFAULT 0,

  -- Batas Wilayah
  north_boundary  VARCHAR(255),
  south_boundary  VARCHAR(255),
  east_boundary   VARCHAR(255),
  west_boundary   VARCHAR(255),

  -- Audit Timestamps
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);