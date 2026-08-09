// prisma/seed.ts

import { prisma } from '@/lib/prisma';

async function main() {
  console.log('🌱 Memulai proses seeding data master...');

  // =====================================================
  // 1. STRUCTURE CATEGORY, GROUPS & POSITIONS
  // =====================================================
  console.log('📌 Memeriksa village_structure_categories...');
  const existingGov = await prisma.village_structure_categories.findFirst({ where: { type: 'government' } });
  if (existingGov) {
    console.log('    ⏭️ Data kategori struktur sudah ada, dilewati.');
  } else {
    await prisma.village_structure_categories.createMany({
      data: [
        { name: 'Pemerintah Desa', type: 'government', level: 1 },
        { name: 'Lembaga Desa', type: 'institution', level: 2 },
      ],
      skipDuplicates: true,
    });
    console.log('    ✅ Data kategori struktur berhasil ditambahkan.');
  }

  const govCategory = await prisma.village_structure_categories.findUnique({
    where: { type: 'government' },
  });

  const institutionCategory = await prisma.village_structure_categories.findUnique({
    where: { type: 'institution' },
  });

  // A. Seeding Posisi Pemerintah Desa (Diperbaiki agar aman dari duplikat)
  if (govCategory) {
    console.log('📌 Memeriksa village_structure_positions (Pemerintah Desa)...');
    const governmentPositions = [
      'Kepala Desa', 'Sekretaris Desa', 'Kaur Tata Usaha dan Umum', 
      'Kaur Keuangan', 'Kaur Perencanaan', 'Kasi Pemerintahan', 
      'Kasi Kesejahteraan', 'Kasi Pelayanan', 'Kepala Dusun'
    ];

    let newGovPosCount = 0;

    for (const posName of governmentPositions) {
      // Cek apakah posisi dengan nama dan category_id tersebut sudah ada
      const existingPos = await prisma.village_structure_positions.findFirst({
        where: {
          category_id: govCategory.id,
          name: posName,
          group_id: null, // Pemerintah desa tidak memiliki group_id
        },
      });

      if (!existingPos) {
        await prisma.village_structure_positions.create({
          data: {
            category_id: govCategory.id,
            name: posName,
          },
        });
        newGovPosCount++;
      }
    }

    if (newGovPosCount === 0) {
      console.log('    ⏭️ Posisi pemerintah desa sudah lengkap, dilewati.');
    } else {
      console.log(`    ✅ Posisi pemerintah desa berhasil ditambahkan (${newGovPosCount} data baru).`);
    }
  }

  // B. Seeding Groups & Positions Lembaga Desa
  if (institutionCategory) {
    console.log('📌 Memeriksa village_structure_groups & positions (Lembaga Desa)...');
    const institutionGroups = [
      { name: 'PKK', leader: 'Ketua TP PKK', sec: 'Sekretaris TP PKK', treas: 'Bendahara TP PKK', member: 'Anggota TP PKK' },
      { name: 'Karang Taruna', leader: 'Ketua Karang Taruna', sec: 'Sekretaris Karang Taruna', treas: 'Bendahara Karang Taruna', member: 'Anggota Karang Taruna' },
      { name: 'LPM', leader: 'Ketua LPM', sec: 'Sekretaris LPM', treas: 'Bendahara LPM', member: 'Anggota LPM' },
      { name: 'Posyandu', leader: 'Ketua Forum Posyandu', sec: 'Sekretaris Posyandu', treas: 'Bendahara Posyandu', member: 'Kader Posyandu' },
      { name: 'Gapoktan', leader: 'Ketua Gapoktan', sec: 'Sekretaris Gapoktan', treas: 'Bendahara Gapoktan', member: 'Anggota Gapoktan' },
      { name: 'BUMDes', leader: 'Direktur / Ketua BUMDes', sec: 'Sekretaris BUMDes', treas: 'Bendahara BUMDes', member: 'Unit Usaha / Pegawai BUMDes' },
      { name: 'Linmas', leader: 'Komandan Regu Linmas', sec: 'Sekretaris Linmas', treas: 'Bendahara Linmas', member: 'Anggota Linmas' },
      { name: 'RT', leader: 'Ketua RT', sec: 'Sekretaris RT', treas: 'Bendahara RT', member: 'Warga / Anggota RT' },
      { name: 'RW', leader: 'Ketua RW', sec: 'Sekretaris RW', treas: 'Bendahara RW', member: 'Pengurus / Anggota RW' },
      { name: 'BPD', leader: 'Ketua BPD', sec: 'Sekretaris BPD', treas: 'Bendahara BPD', member: 'Anggota BPD' },
    ];

    for (const group of institutionGroups) {
      const createdGroup = await prisma.village_structure_groups.upsert({
        where: {
          category_id_name: {
            category_id: institutionCategory.id,
            name: group.name,
          },
        },
        update: {},
        create: {
          category_id: institutionCategory.id,
          name: group.name,
        },
      });

      const groupPositions = [
        group.leader,
        group.sec,
        group.treas,
        `Koordinator Bidang / Seksi ${group.name}`,
        group.member,
      ];

      for (const posName of groupPositions) {
        const existingGroupPos = await prisma.village_structure_positions.findFirst({
          where: {
            category_id: institutionCategory.id,
            group_id: createdGroup.id,
            name: posName,
          },
        });

        if (!existingGroupPos) {
          await prisma.village_structure_positions.create({
            data: {
              category_id: institutionCategory.id,
              group_id: createdGroup.id,
              name: posName,
            },
          });
        }
      }
    }
    console.log('    ✅ Data grup & posisi lembaga desa berhasil diperiksa/ditambahkan.');
  }

  // =====================================================
  // 2. VILLAGE FACILITY CATEGORIES & TYPES
  // =====================================================
  console.log('📌 Memeriksa village_facility_categories & types...');
  const facilityCategoriesData = [
    { name: 'Pendidikan', types: ['PAUD', 'TK', 'SD', 'SMP', 'SMA', 'SMK', 'Perguruan Tinggi'] },
    { name: 'Kesehatan', types: ['Posyandu', 'Polindes', 'Puskesmas', 'Pustu', 'Klinik', 'Apotek'] },
    { name: 'Ibadah', types: ['Masjid', 'Musala', 'Gereja', 'Pura', 'Vihara', 'Klenteng'] },
    { name: 'Ekonomi', types: ['Pasar', 'BUMDes', 'Koperasi', 'Bank', 'UMKM', 'Minimarket'] },
    { name: 'Umum', types: ['Balai Desa', 'Lapangan', 'Gedung Serbaguna', 'Perpustakaan', 'Terminal', 'Taman', 'Pemakaman'] },
  ];

  for (const cat of facilityCategoriesData) {
    const createdCat = await prisma.village_facility_categories.upsert({
      where: { name: cat.name },
      update: {},
      create: { name: cat.name },
    });

    let newTypesCount = 0;
    for (const typeName of cat.types) {
      const existingType = await prisma.village_facility_types.findFirst({
        where: { category_id: createdCat.id, name: typeName },
      });
      if (!existingType) {
        await prisma.village_facility_types.create({
          data: { category_id: createdCat.id, name: typeName },
        });
        newTypesCount++;
      }
    }

    if (newTypesCount === 0) {
      console.log(`    ⏭️ Fasilitas kategori "${cat.name}" sudah ada, dilewati.`);
    } else {
      console.log(`    ✅ Fasilitas kategori "${cat.name}" berhasil ditambahkan (${newTypesCount} data baru).`);
    }
  }

  // =====================================================
  // 3. VILLAGE POTENTIAL CATEGORIES
  // =====================================================
  console.log('📌 Memeriksa village_potential_categories...');
  const potentials = [
    { name: 'Wisata', description: 'Potensi wisata alam, budaya, dan tempat rekreasi desa' },
    { name: 'Pertanian', description: 'Potensi hasil pertanian dan perkebunan desa' },
    { name: 'Peternakan', description: 'Potensi peternakan masyarakat desa' },
    { name: 'Perikanan', description: 'Potensi perikanan dan budidaya ikan desa' },
    { name: 'UMKM', description: 'Potensi usaha dan produk unggulan masyarakat desa' },
    { name: 'Kerajinan', description: 'Potensi kerajinan lokal desa' },
  ];

  for (const pot of potentials) {
    const existingPot = await prisma.village_potential_categories.findUnique({ where: { name: pot.name } });
    if (existingPot) {
      console.log(`    ⏭️ Potensi "${pot.name}" sudah ada, dilewati.`);
    } else {
      await prisma.village_potential_categories.create({ data: pot });
      console.log(`    ✅ Potensi "${pot.name}" berhasil ditambahkan.`);
    }
  }

  // =====================================================
  // 4. POPULATION CATEGORIES & MASTER ITEMS
  // =====================================================
  console.log('📌 Memeriksa population_categories & master_items...');
  const populationData = [
    {
      category: { name: 'Pendidikan', sort_order: 1 },
      items: [
        'Tidak / Belum Sekolah', 'Belum Tamat SD', 'SD / Sederajat', 
        'SMP / Sederajat', 'SMA / Sederajat', 'Diploma III', 
        'Diploma IV / S1', 'S2', 'S3'
      ]
    },
    {
      category: { name: 'Pekerjaan', sort_order: 2 },
      items: [
        'Belum / Tidak Bekerja', 'Pelajar', 'Mahasiswa', 'Ibu Rumah Tangga', 
        'Petani', 'Buruh Tani', 'Peternak', 'Nelayan', 'Pedagang', 
        'Wiraswasta', 'Karyawan Swasta', 'PNS / ASN', 'TNI', 'POLRI', 
        'Guru / Dosen', 'Tenaga Kesehatan', 'Pensiunan', 'Pekerjaan Lainnya'
      ]
    },
    {
      category: { name: 'Agama', sort_order: 3 },
      items: ['Islam', 'Kristen Protestan', 'Kristen Katolik', 'Hindu', 'Buddha', 'Konghucu', 'Kepercayaan Lainnya']
    },
    {
      category: { name: 'Status Perkawinan', sort_order: 4 },
      items: ['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati']
    },
    {
      category: { name: 'Kelompok Umur', sort_order: 5 },
      items: ['0 - 5 Tahun', '6 - 12 Tahun', '13 - 17 Tahun', '18 - 25 Tahun', '26 - 35 Tahun', '36 - 45 Tahun', '46 - 60 Tahun', 'Diatas 60 Tahun']
    },
    {
      category: { name: 'Kewarganegaraan', sort_order: 6 },
      items: ['WNI', 'WNA']
    },
    {
      category: { name: 'Disabilitas', sort_order: 7 },
      items: ['Tidak Ada Disabilitas', 'Tuna Netra', 'Tuna Rungu', 'Tuna Wicara', 'Tuna Daksa', 'Tuna Grahita', 'Gangguan Mental / Jiwa', 'Disabilitas Lainnya']
    }
  ];

  for (const data of populationData) {
    const cat = await prisma.population_categories.upsert({
      where: { name: data.category.name },
      update: {},
      create: data.category,
    });

    let sortIdx = 1;
    let newItemsCount = 0;
    for (const itemName of data.items) {
      const existingItem = await prisma.population_master_items.findFirst({
        where: { category_id: cat.id, name: itemName },
      });
      if (!existingItem) {
        await prisma.population_master_items.create({
          data: { category_id: cat.id, name: itemName, sort_order: sortIdx },
        });
        newItemsCount++;
      }
      sortIdx++;
    }

    if (newItemsCount === 0) {
      console.log(`    ⏭️ Kependudukan "${data.category.name}" sudah ada, dilewati.`);
    } else {
      console.log(`    ✅ Kependudukan "${data.category.name}" ditambahkan (${newItemsCount} item baru).`);
    }
  }

  // =====================================================
  // 5. LITERATURE CATEGORIES
  // =====================================================
  console.log('📌 Memeriksa literature_categories...');
  const literatureCategories = [
    'Pendidikan', 'Kesehatan', 'Teknologi', 'Ekonomi', 'Pertanian', 
    'Pemerintahan', 'Sosial & Masyarakat', 'Lingkungan', 'Budaya & Pariwisata', 
    'Keagamaan', 'Hukum', 'Lainnya'
  ];

  let newLitCount = 0;
  for (const litName of literatureCategories) {
    const existingLit = await prisma.literature_categories.findUnique({ where: { name: litName } });
    if (!existingLit) {
      await prisma.literature_categories.create({ data: { name: litName } });
      newLitCount++;
    }
  }
  if (newLitCount === 0) {
    console.log('    ⏭️ Kategori literasi sudah ada semua, dilewati.');
  } else {
    console.log(`    ✅ Kategori literasi berhasil ditambahkan (${newLitCount} data baru).`);
  }

  // =====================================================
  // 6. PRODUCT CATEGORIES
  // =====================================================
  console.log('📌 Memeriksa product_categories...');
  const productCategories = [
    'Makanan', 'Minuman', 'Fashion', 'Kerajinan', 
    'Pertanian', 'Peternakan', 'Jasa', 'Lainnya'
  ];

  let newProdCount = 0;
  for (const prodName of productCategories) {
    const existingProd = await prisma.product_categories.findUnique({ where: { name: prodName } });
    if (!existingProd) {
      await prisma.product_categories.create({ data: { name: prodName, is_active: true } });
      newProdCount++;
    }
  }
  if (newProdCount === 0) {
    console.log('    ⏭️ Kategori produk sudah ada semua, dilewati.');
  } else {
    console.log(`    ✅ Kategori produk berhasil ditambahkan (${newProdCount} data baru).`);
  }

  console.log('🎉 Proses seeding selesai dengan cepat!');
}

main()
  .catch((e) => {
    console.error('❌ Terjadi kesalahan saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });