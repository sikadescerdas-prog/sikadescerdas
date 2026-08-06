-- ======================================================
-- MASTER DATA
-- ======================================================

-- =========================
-- CATEGORIES
-- =========================
INSERT INTO village_facility_categories (name)
VALUES
('Pendidikan'),
('Kesehatan'),
('Ibadah'),
('Ekonomi'),
('Umum');

-- =========================
-- TYPES : PENDIDIKAN
-- =========================
INSERT INTO village_facility_types (category_id, name)
VALUES
(1, 'PAUD'),
(1, 'TK'),
(1, 'SD'),
(1, 'SMP'),
(1, 'SMA'),
(1, 'SMK'),
(1, 'Perguruan Tinggi');

-- =========================
-- TYPES : KESEHATAN
-- =========================
INSERT INTO village_facility_types (category_id, name)
VALUES
(2, 'Posyandu'),
(2, 'Polindes'),
(2, 'Puskesmas'),
(2, 'Pustu'),
(2, 'Klinik'),
(2, 'Apotek');

-- =========================
-- TYPES : IBADAH
-- =========================
INSERT INTO village_facility_types (category_id, name)
VALUES
(3, 'Masjid'),
(3, 'Musala'),
(3, 'Gereja'),
(3, 'Pura'),
(3, 'Vihara'),
(3, 'Klenteng');

-- =========================
-- TYPES : EKONOMI
-- =========================
INSERT INTO village_facility_types (category_id, name)
VALUES
(4, 'Pasar'),
(4, 'BUMDes'),
(4, 'Koperasi'),
(4, 'Bank'),
(4, 'UMKM'),
(4, 'Minimarket');

-- =========================
-- TYPES : UMUM
-- =========================
INSERT INTO village_facility_types (category_id, name)
VALUES
(5, 'Balai Desa'),
(5, 'Lapangan'),
(5, 'Gedung Serbaguna'),
(5, 'Perpustakaan'),
(5, 'Terminal'),
(5, 'Taman'),
(5, 'Pemakaman');