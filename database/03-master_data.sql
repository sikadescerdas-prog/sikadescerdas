-- ======================================================
-- MASTER DATA
-- ======================================================


-- =====================================================
-- STRUCTURE CATEGORY
-- =====================================================

INSERT INTO village_structure_categories (name, type, level)
VALUES
('Pemerintah Desa', 'government', 1),
('Lembaga Desa', 'institution', 2);

-- =====================================================
-- LEMBAGA DESA
-- =====================================================

INSERT INTO village_structure_groups (category_id, name)
SELECT
    c.id,
    x.name
FROM village_structure_categories c
CROSS JOIN (
    VALUES
        ('PKK'),
        ('Karang Taruna'),
        ('LPM'),
        ('Posyandu'),
        ('Gapoktan'),
        ('BUMDes'),
        ('Linmas'),
        ('RT'),
        ('RW'),
        ('BPD')
) AS x(name)
WHERE c.type = 'institution';

-- =====================================================
-- PEMERINTAH DESA
-- =====================================================

-- Kepala Desa
INSERT INTO village_structure_positions (
    category_id,
    name
)
SELECT
    id,
    'Kepala Desa'
FROM village_structure_categories
WHERE type = 'government';

-- Di bawah Kepala Desa
INSERT INTO village_structure_positions (
    category_id,
    parent_id,
    name
)
SELECT
    c.id,
    p.id,
    x.name
FROM village_structure_categories c
JOIN village_structure_positions p
    ON p.category_id = c.id
   AND p.name = 'Kepala Desa'
CROSS JOIN (
    VALUES
        ('Sekretaris Desa'),
        ('Kasi Pemerintahan'),
        ('Kasi Kesejahteraan'),
        ('Kasi Pelayanan')
) AS x(name)
WHERE c.type = 'government';

-- Di bawah Sekretaris Desa
INSERT INTO village_structure_positions (
    category_id,
    parent_id,
    name
)
SELECT
    c.id,
    p.id,
    x.name
FROM village_structure_categories c
JOIN village_structure_positions p
    ON p.category_id = c.id
   AND p.name = 'Sekretaris Desa'
CROSS JOIN (
    VALUES
        ('Kaur Tata Usaha dan Umum'),
        ('Kaur Keuangan'),
        ('Kaur Perencanaan')
) AS x(name)
WHERE c.type = 'government';

-- Kepala Dusun
INSERT INTO village_structure_positions (
    category_id,
    parent_id,
    name,
    is_multiple
)
SELECT
    c.id,
    p.id,
    'Kepala Dusun',
    TRUE
FROM village_structure_categories c
JOIN village_structure_positions p
    ON p.category_id = c.id
   AND p.name = 'Kepala Desa'
WHERE c.type = 'government';

-- =====================================================
-- LEMBAGA DESA
-- Berlaku untuk semua group (PKK, Posyandu, BPD, dll)
-- =====================================================

INSERT INTO village_structure_positions (
    category_id,
    group_id,
    name,
    is_multiple
)
SELECT
    c.id,
    g.id,
    x.name,
    x.is_multiple
FROM village_structure_categories c
JOIN village_structure_groups g
    ON g.category_id = c.id
CROSS JOIN (
    VALUES
        ('Ketua', FALSE),
        ('Wakil Ketua', FALSE),
        ('Sekretaris', FALSE),
        ('Bendahara', FALSE),
        ('Anggota', TRUE)
) AS x(name, is_multiple)
WHERE c.type = 'institution';