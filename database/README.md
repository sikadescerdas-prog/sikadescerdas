# SIKADES CERDAS Database

Database PostgreSQL untuk aplikasi **SIKADES CERDAS (Sistem Informasi Kependudukan dan Administrasi Desa Cerdas)**.

---

## Struktur Folder

```
database/
├── 01_users.sql
├── 02_villages.sql
├── 03_marketplace.sql
├── 04_content.sql
├── 05_population.sql
├── 06_structure.sql
├── 07_views.sql
├── 08_indexes.sql
└── README.md
```

---

# Modul Database

## 01_users.sql

Modul autentikasi dan data pengguna.

### Tables

- users
- profiles

---

## 02_villages.sql

Modul informasi desa.

### Tables

- villages
- village_facility_categories
- village_facilities
- village_potential_categories
- village_potentials

---

## 03_marketplace.sql

Modul UMKM / Marketplace Desa.

### Tables

- stores
- store_marketplaces
- product_categories
- products
- product_images

---

## 04_content.sql

Modul berita dan literasi.

### Tables

- literatures
- literature_images
- literature_links
- news
- news_images

---

## 05_population.sql

Modul kependudukan.

### Tables

- village_populations
- population_categories
- village_population_details

---

## 06_structure.sql

Modul struktur organisasi desa.

### Tables

- village_structure_periods
- village_structure_categories
- village_structure_positions
- village_structures

---

## 07_views.sql

Database View.

### Views

- village_gallery_view

---

## 08_indexes.sql

Berisi seluruh index untuk optimasi performa query.

---

# Urutan Eksekusi

Jalankan file SQL sesuai urutan berikut.

```
01_users.sql
02_villages.sql
03_marketplace.sql
04_content.sql
05_population.sql
06_structure.sql
07_views.sql
08_indexes.sql
```

---

# Total Database

## Tables

| Modul | Jumlah |
|-------|-------:|
| Auth | 2 |
| Villages | 5 |
| Marketplace | 5 |
| Content | 5 |
| Population | 3 |
| Structure | 4 |
| **Total** | **24 Tables** |

---

## Views

- village_gallery_view

---

## Indexes

Seluruh index berada pada file:

```
08_indexes.sql
```

---

# Database

- PostgreSQL

---

# Project

SIKADES CERDAS