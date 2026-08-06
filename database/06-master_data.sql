-- =========================
-- POPULATION CATEGORIES
-- =========================
INSERT INTO population_categories (name, sort_order)
VALUES
    ('Pendidikan', 1),
    ('Pekerjaan', 2),
    ('Agama', 3),
    ('Status Perkawinan', 4),
    ('Kelompok Umur', 5),
    ('Kewarganegaraan', 6),
    ('Disabilitas', 7);

-- =========================
-- PENDIDIKAN
-- category_id = 1
-- =========================

INSERT INTO population_master_items
(category_id, name, sort_order)
VALUES
(1,'Tidak / Belum Sekolah',1),
(1,'Belum Tamat SD',2),
(1,'SD / Sederajat',3),
(1,'SMP / Sederajat',4),
(1,'SMA / Sederajat',5),
(1,'Diploma III',6),
(1,'Diploma IV / S1',7),
(1,'S2',8),
(1,'S3',9);


-- =========================
-- PEKERJAAN
-- category_id = 2
-- =========================

INSERT INTO population_master_items
(category_id, name, sort_order)
VALUES
(2,'Belum / Tidak Bekerja',1),
(2,'Pelajar',2),
(2,'Mahasiswa',3),
(2,'Ibu Rumah Tangga',4),
(2,'Petani',5),
(2,'Buruh Tani',6),
(2,'Peternak',7),
(2,'Nelayan',8),
(2,'Pedagang',9),
(2,'Wiraswasta',10),
(2,'Karyawan Swasta',11),
(2,'PNS / ASN',12),
(2,'TNI',13),
(2,'POLRI',14),
(2,'Guru / Dosen',15),
(2,'Tenaga Kesehatan',16),
(2,'Pensiunan',17),
(2,'Pekerjaan Lainnya',18);


-- =========================
-- AGAMA
-- category_id = 3
-- =========================

INSERT INTO population_master_items
(category_id, name, sort_order)
VALUES
(3,'Islam',1),
(3,'Kristen Protestan',2),
(3,'Kristen Katolik',3),
(3,'Hindu',4),
(3,'Buddha',5),
(3,'Konghucu',6),
(3,'Kepercayaan Lainnya',7);


-- =========================
-- STATUS PERKAWINAN
-- category_id = 4
-- =========================

INSERT INTO population_master_items
(category_id, name, sort_order)
VALUES
(4,'Belum Kawin',1),
(4,'Kawin',2),
(4,'Cerai Hidup',3),
(4,'Cerai Mati',4);


-- =========================
-- KELOMPOK UMUR
-- category_id = 5
-- =========================

INSERT INTO population_master_items
(category_id, name, sort_order)
VALUES
(5,'0 - 5 Tahun',1),
(5,'6 - 12 Tahun',2),
(5,'13 - 17 Tahun',3),
(5,'18 - 25 Tahun',4),
(5,'26 - 35 Tahun',5),
(5,'36 - 45 Tahun',6),
(5,'46 - 60 Tahun',7),
(5,'Diatas 60 Tahun',8);


-- =========================
-- KEWARGANEGARAAN
-- category_id = 6
-- =========================

INSERT INTO population_master_items
(category_id, name, sort_order)
VALUES
(6,'WNI',1),
(6,'WNA',2);


-- =========================
-- DISABILITAS
-- category_id = 7
-- =========================

INSERT INTO population_master_items
(category_id, name, sort_order)
VALUES
(7,'Tidak Ada Disabilitas',1),
(7,'Tuna Netra',2),
(7,'Tuna Rungu',3),
(7,'Tuna Wicara',4),
(7,'Tuna Daksa',5),
(7,'Tuna Grahita',6),
(7,'Gangguan Mental / Jiwa',7),
(7,'Disabilitas Lainnya',8);