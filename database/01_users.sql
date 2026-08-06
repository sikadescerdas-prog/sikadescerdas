-- =========================================================
-- AUTH & USER MANAGEMENT
-- =========================================================

-- =========================
-- USERS
-- =========================
CREATE TABLE users (
  id            VARCHAR(50) PRIMARY KEY,
  email         VARCHAR(100) UNIQUE NOT NULL,
  username      VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          VARCHAR(20) NOT NULL DEFAULT 'user' 
                  CHECK (role IN ('superadmin', 'admin', 'seller', 'user')),
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMP,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- USER PROFILES
-- =========================
CREATE TABLE profiles (
  id               BIGSERIAL PRIMARY KEY,
  user_id          VARCHAR(50) NOT NULL UNIQUE,
  fullname         VARCHAR(100) NOT NULL,
  phone            VARCHAR(20),
  bio              TEXT,
  gender           VARCHAR(10) CHECK (gender IN ('male', 'female')),
  birth_date       DATE,
  avatar_url       TEXT,
  avatar_public_id VARCHAR(255),

  -- Alamat Pribadi
  province         VARCHAR(100),
  regency          VARCHAR(100),
  district         VARCHAR(100),
  village          VARCHAR(100),
  detail_address   TEXT,

  -- Geolokasi
  latitude         DECIMAL(10, 7),
  longitude        DECIMAL(10, 7),

  -- Status kelengkapan profile
  is_completed     BOOLEAN NOT NULL DEFAULT FALSE,

  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- Foreign Keys
  CONSTRAINT fk_profile_user 
    FOREIGN KEY (user_id) 
    REFERENCES users(id) 
    ON DELETE CASCADE
);