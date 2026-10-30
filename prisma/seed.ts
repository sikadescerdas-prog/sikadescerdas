// prisma/seed.ts

import "dotenv/config";

import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL tidak terbaca dari .env");
}

const parsedUrl = new URL(databaseUrl);

console.log("Database host:", parsedUrl.hostname);
console.log("Database username:", parsedUrl.username);
console.log("Password tersedia:", Boolean(parsedUrl.password));

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({ adapter });

const DEFAULT_PASSWORD = "Dummy123!";

const productCategories = [
  "Makanan",
  "Minuman",
  "Fashion",
  "Kerajinan",
  "Pertanian",
  "Peternakan",
  "Jasa",
  "Lainnya",
] as const;

type ProductSeed = {
  name: string;
  slug: string;
  description: string;
  category: (typeof productCategories)[number];
  price: string;
  stock: number;
  unit: string;
  weight: number;
  thumbnailUrl: string;
};

type SellerSeed = {
  id: string;
  email: string;
  username: string;
  fullname: string;
  phone: string;
  gender: string;
  birthDate: Date;
  bio: string;
  province: string;
  regency: string;
  district: string;
  village: string;
  detailAddress: string;
  avatarUrl: string;
  store: {
    name: string;
    slug: string;
    description: string;
    phone: string;
    email: string;
    province: string;
    regency: string;
    district: string;
    village: string;
    address: string;
    logoUrl: string;
    bannerUrl: string;
    shopeeUrl: string;
    tiktokUrl: string;
  };
  products: ProductSeed[];
};

const sellers: SellerSeed[] = [
  // =========================================================
  // 1. TOKO ROBUSTA LERENG
  // =========================================================
  {
    id: "dummy-seller-001",
    email: "budi@example.com",
    username: "budi.robusta",
    fullname: "Budi Santoso",
    phone: "081200000001",
    gender: "Laki-laki",
    birthDate: new Date("1990-04-12"),
    bio: "Petani dan penjual kopi robusta lokal.",
    province: "Jawa Tengah",
    regency: "Kabupaten Temanggung",
    district: "Parakan",
    village: "Parakan Wetan",
    detailAddress: "Jl. Kopi Robusta No. 1",
    avatarUrl: "https://placehold.co/400x400?text=Budi",
    store: {
      name: "Robusta Lereng",
      slug: "robusta-lereng",
      description:
        "Toko kopi robusta pilihan dan produk lokal berkualitas.",
      phone: "081200000011",
      email: "robusta@example.com",
      province: "Jawa Tengah",
      regency: "Kabupaten Temanggung",
      district: "Parakan",
      village: "Parakan Wetan",
      address: "Jl. Kopi Robusta No. 1, Parakan",
      logoUrl: "https://placehold.co/400x400?text=Robusta+Lereng",
      bannerUrl: "https://placehold.co/1200x400?text=Robusta+Lereng",
      shopeeUrl: "https://shopee.co.id/ISI_USERNAME_ROBUSTA_LERENG",
      tiktokUrl: "https://www.tiktok.com/@ISI_USERNAME_ROBUSTA_LERENG",
    },
    products: [
      {
        name: "Kopi Robusta Bubuk 250 Gram",
        slug: "robusta-lereng-kopi-robusta-bubuk-250-gram",
        description:
          "Kopi robusta lokal dengan aroma khas dan cita rasa yang kuat.",
        category: "Minuman",
        price: "35000",
        stock: 50,
        unit: "bungkus",
        weight: 250,
        thumbnailUrl: "https://placehold.co/600x600?text=Kopi+Robusta",
      },
      {
        name: "Biji Kopi Robusta 1 Kg",
        slug: "robusta-lereng-biji-kopi-robusta-1-kg",
        description:
          "Biji kopi robusta pilihan untuk kebutuhan usaha maupun rumahan.",
        category: "Pertanian",
        price: "85000",
        stock: 30,
        unit: "kg",
        weight: 1000,
        thumbnailUrl: "https://placehold.co/600x600?text=Biji+Kopi",
      },
      {
        name: "Gula Aren Cair 250 ml",
        slug: "robusta-lereng-gula-aren-cair-250-ml",
        description:
          "Gula aren cair untuk campuran minuman, kopi, dan makanan.",
        category: "Makanan",
        price: "18000",
        stock: 40,
        unit: "botol",
        weight: 300,
        thumbnailUrl: "https://placehold.co/600x600?text=Gula+Aren+Cair",
      },
      {
        name: "Gula Aren Cetak 500 Gram",
        slug: "robusta-lereng-gula-aren-cetak-500-gram",
        description:
          "Gula aren cetak dengan rasa manis khas untuk berbagai hidangan.",
        category: "Makanan",
        price: "22000",
        stock: 35,
        unit: "bungkus",
        weight: 500,
        thumbnailUrl: "https://placehold.co/600x600?text=Gula+Aren",
      },
      {
        name: "Sapu Lidi Tradisional",
        slug: "robusta-lereng-sapu-lidi-tradisional",
        description:
          "Sapu lidi untuk membantu membersihkan halaman dan area rumah.",
        category: "Kerajinan",
        price: "15000",
        stock: 25,
        unit: "pcs",
        weight: 500,
        thumbnailUrl: "https://placehold.co/600x600?text=Sapu+Lidi",
      },
    ],
  },

  // =========================================================
  // 2. TOKO PANGAN LESTARI
  // =========================================================
  {
    id: "dummy-seller-002",
    email: "siti@example.com",
    username: "siti.pangan",
    fullname: "Siti Aminah",
    phone: "081200000002",
    gender: "Perempuan",
    birthDate: new Date("1992-07-20"),
    bio: "Menyediakan aneka pangan dan hasil bumi lokal.",
    province: "Jawa Tengah",
    regency: "Kabupaten Banyumas",
    district: "Sokaraja",
    village: "Sokaraja Kulon",
    detailAddress: "Jl. Pangan Lestari No. 2",
    avatarUrl: "https://placehold.co/400x400?text=Siti",
    store: {
      name: "Pangan Lestari",
      slug: "pangan-lestari",
      description:
        "Produk pangan lokal untuk kebutuhan keluarga sehari-hari.",
      phone: "081200000012",
      email: "pangan@example.com",
      province: "Jawa Tengah",
      regency: "Kabupaten Banyumas",
      district: "Sokaraja",
      village: "Sokaraja Kulon",
      address: "Jl. Pangan Lestari No. 2, Sokaraja",
      logoUrl: "https://placehold.co/400x400?text=Pangan+Lestari",
      bannerUrl: "https://placehold.co/1200x400?text=Pangan+Lestari",
      shopeeUrl: "https://shopee.co.id/ISI_USERNAME_PANGAN_LESTARI",
      tiktokUrl: "https://www.tiktok.com/@ISI_USERNAME_PANGAN_LESTARI",
    },
    products: [
      {
        name: "Kopi Robusta Bubuk 200 Gram",
        slug: "pangan-lestari-kopi-robusta-bubuk-200-gram",
        description:
          "Kopi robusta bubuk untuk menemani aktivitas sehari-hari.",
        category: "Minuman",
        price: "28000",
        stock: 40,
        unit: "bungkus",
        weight: 200,
        thumbnailUrl: "https://placehold.co/600x600?text=Kopi+Bubuk",
      },
      {
        name: "Gula Aren Asli 500 Gram",
        slug: "pangan-lestari-gula-aren-asli-500-gram",
        description:
          "Gula aren lokal untuk bahan minuman dan aneka masakan.",
        category: "Makanan",
        price: "20000",
        stock: 45,
        unit: "bungkus",
        weight: 500,
        thumbnailUrl: "https://placehold.co/600x600?text=Gula+Aren",
      },
      {
        name: "Beras Lokal 5 Kg",
        slug: "pangan-lestari-beras-lokal-5-kg",
        description:
          "Beras lokal untuk kebutuhan konsumsi sehari-hari.",
        category: "Pertanian",
        price: "75000",
        stock: 25,
        unit: "karung",
        weight: 5000,
        thumbnailUrl: "https://placehold.co/600x600?text=Beras+Lokal",
      },
      {
        name: "Madu Murni 250 ml",
        slug: "pangan-lestari-madu-murni-250-ml",
        description:
          "Madu dalam kemasan praktis untuk kebutuhan rumah tangga.",
        category: "Makanan",
        price: "45000",
        stock: 20,
        unit: "botol",
        weight: 350,
        thumbnailUrl: "https://placehold.co/600x600?text=Madu+Murni",
      },
      {
        name: "Keripik Singkong 250 Gram",
        slug: "pangan-lestari-keripik-singkong-250-gram",
        description:
          "Keripik singkong renyah untuk camilan bersama keluarga.",
        category: "Makanan",
        price: "15000",
        stock: 50,
        unit: "bungkus",
        weight: 250,
        thumbnailUrl: "https://placehold.co/600x600?text=Keripik+Singkong",
      },
    ],
  },

  // =========================================================
  // 3. TOKO PERKAKAS JAYA
  // =========================================================
  {
    id: "dummy-seller-003",
    email: "andi@example.com",
    username: "andi.perkakas",
    fullname: "Andi Pratama",
    phone: "081200000003",
    gender: "Laki-laki",
    birthDate: new Date("1988-02-15"),
    bio: "Menyediakan perkakas rumah tangga dan produk kerajinan.",
    province: "Jawa Tengah",
    regency: "Kabupaten Purbalingga",
    district: "Bobotsari",
    village: "Bobotsari",
    detailAddress: "Jl. Perkakas Jaya No. 3",
    avatarUrl: "https://placehold.co/400x400?text=Andi",
    store: {
      name: "Perkakas Jaya",
      slug: "perkakas-jaya",
      description:
        "Peralatan rumah tangga sederhana dan produk kerajinan lokal.",
      phone: "081200000013",
      email: "perkakas@example.com",
      province: "Jawa Tengah",
      regency: "Kabupaten Purbalingga",
      district: "Bobotsari",
      village: "Bobotsari",
      address: "Jl. Perkakas Jaya No. 3, Bobotsari",
      logoUrl: "https://placehold.co/400x400?text=Perkakas+Jaya",
      bannerUrl: "https://placehold.co/1200x400?text=Perkakas+Jaya",
      shopeeUrl: "https://shopee.co.id/ISI_USERNAME_PERKAKAS_JAYA",
      tiktokUrl: "https://www.tiktok.com/@ISI_USERNAME_PERKAKAS_JAYA",
    },
    products: [
      {
        name: "Sapu Lidi Halaman",
        slug: "perkakas-jaya-sapu-lidi-halaman",
        description:
          "Sapu lidi untuk membersihkan halaman dan area luar rumah.",
        category: "Kerajinan",
        price: "18000",
        stock: 35,
        unit: "pcs",
        weight: 600,
        thumbnailUrl: "https://placehold.co/600x600?text=Sapu+Lidi",
      },
      {
        name: "Sapu Ijuk Tradisional",
        slug: "perkakas-jaya-sapu-ijuk-tradisional",
        description:
          "Sapu ijuk untuk membantu menjaga kebersihan lantai rumah.",
        category: "Kerajinan",
        price: "25000",
        stock: 30,
        unit: "pcs",
        weight: 700,
        thumbnailUrl: "https://placehold.co/600x600?text=Sapu+Ijuk",
      },
      {
        name: "Keset Sabut Kelapa",
        slug: "perkakas-jaya-keset-sabut-kelapa",
        description:
          "Keset berbahan sabut kelapa untuk area pintu rumah.",
        category: "Kerajinan",
        price: "20000",
        stock: 25,
        unit: "pcs",
        weight: 500,
        thumbnailUrl: "https://placehold.co/600x600?text=Keset+Sabut",
      },
      {
        name: "Kemoceng Bulu",
        slug: "perkakas-jaya-kemoceng-bulu",
        description:
          "Kemoceng untuk membantu membersihkan debu pada perabot.",
        category: "Lainnya",
        price: "12000",
        stock: 40,
        unit: "pcs",
        weight: 200,
        thumbnailUrl: "https://placehold.co/600x600?text=Kemoceng",
      },
      {
        name: "Serok Sampah Plastik",
        slug: "perkakas-jaya-serok-sampah-plastik",
        description:
          "Serok sampah untuk membantu kegiatan bersih-bersih rumah.",
        category: "Lainnya",
        price: "10000",
        stock: 40,
        unit: "pcs",
        weight: 150,
        thumbnailUrl: "https://placehold.co/600x600?text=Serok+Sampah",
      },
    ],
  },

  // =========================================================
  // 4. TOKO BERKAH SEMBAKO
  // =========================================================
  {
    id: "dummy-seller-004",
    email: "rini@example.com",
    username: "rini.sembako",
    fullname: "Rini Wulandari",
    phone: "081200000004",
    gender: "Perempuan",
    birthDate: new Date("1994-11-08"),
    bio: "Menyediakan kebutuhan sembako dan bahan dapur.",
    province: "Jawa Tengah",
    regency: "Kabupaten Cilacap",
    district: "Kroya",
    village: "Kroya",
    detailAddress: "Jl. Berkah Sembako No. 4",
    avatarUrl: "https://placehold.co/400x400?text=Rini",
    store: {
      name: "Berkah Sembako",
      slug: "berkah-sembako",
      description:
        "Toko kebutuhan dapur dan bahan pangan untuk keluarga.",
      phone: "081200000014",
      email: "sembako@example.com",
      province: "Jawa Tengah",
      regency: "Kabupaten Cilacap",
      district: "Kroya",
      village: "Kroya",
      address: "Jl. Berkah Sembako No. 4, Kroya",
      logoUrl: "https://placehold.co/400x400?text=Berkah+Sembako",
      bannerUrl: "https://placehold.co/1200x400?text=Berkah+Sembako",
      shopeeUrl: "https://shopee.co.id/ISI_USERNAME_BERKAH_SEMBAKO",
      tiktokUrl: "https://www.tiktok.com/@ISI_USERNAME_BERKAH_SEMBAKO",
    },
    products: [
      {
        name: "Gula Aren Cetak 1 Kg",
        slug: "berkah-sembako-gula-aren-cetak-1-kg",
        description:
          "Gula aren cetak untuk berbagai kebutuhan makanan dan minuman.",
        category: "Makanan",
        price: "38000",
        stock: 30,
        unit: "bungkus",
        weight: 1000,
        thumbnailUrl: "https://placehold.co/600x600?text=Gula+Aren",
      },
      {
        name: "Kopi Robusta Bubuk 250 Gram",
        slug: "berkah-sembako-kopi-robusta-bubuk-250-gram",
        description:
          "Kopi robusta bubuk untuk diseduh di rumah atau tempat kerja.",
        category: "Minuman",
        price: "32000",
        stock: 35,
        unit: "bungkus",
        weight: 250,
        thumbnailUrl: "https://placehold.co/600x600?text=Kopi+Robusta",
      },
      {
        name: "Beras Premium 5 Kg",
        slug: "berkah-sembako-beras-premium-5-kg",
        description:
          "Beras untuk kebutuhan makan keluarga sehari-hari.",
        category: "Pertanian",
        price: "85000",
        stock: 20,
        unit: "karung",
        weight: 5000,
        thumbnailUrl: "https://placehold.co/600x600?text=Beras+Premium",
      },
      {
        name: "Minyak Kelapa 500 ml",
        slug: "berkah-sembako-minyak-kelapa-500-ml",
        description:
          "Minyak kelapa untuk kebutuhan memasak di rumah.",
        category: "Makanan",
        price: "25000",
        stock: 30,
        unit: "botol",
        weight: 550,
        thumbnailUrl: "https://placehold.co/600x600?text=Minyak+Kelapa",
      },
      {
        name: "Garam Dapur 500 Gram",
        slug: "berkah-sembako-garam-dapur-500-gram",
        description:
          "Garam dapur untuk melengkapi kebutuhan bumbu masakan.",
        category: "Makanan",
        price: "8000",
        stock: 50,
        unit: "bungkus",
        weight: 500,
        thumbnailUrl: "https://placehold.co/600x600?text=Garam+Dapur",
      },
    ],
  },

  // =========================================================
  // 5. TOKO ALAM NATURAL STORE
  // =========================================================
  {
    id: "dummy-seller-005",
    email: "dewi@example.com",
    username: "dewi.natural",
    fullname: "Dewi Anggraini",
    phone: "081200000005",
    gender: "Perempuan",
    birthDate: new Date("1993-05-25"),
    bio: "Mendukung produk lokal dan kerajinan berbahan alami.",
    province: "Jawa Tengah",
    regency: "Kabupaten Kebumen",
    district: "Gombong",
    village: "Gombong",
    detailAddress: "Jl. Alam Natural No. 5",
    avatarUrl: "https://placehold.co/400x400?text=Dewi",
    store: {
      name: "Alam Natural Store",
      slug: "alam-natural-store",
      description:
        "Produk alami, hasil bumi, dan kerajinan lokal.",
      phone: "081200000015",
      email: "natural@example.com",
      province: "Jawa Tengah",
      regency: "Kabupaten Kebumen",
      district: "Gombong",
      village: "Gombong",
      address: "Jl. Alam Natural No. 5, Gombong",
      logoUrl: "https://placehold.co/400x400?text=Alam+Natural",
      bannerUrl: "https://placehold.co/1200x400?text=Alam+Natural",
      shopeeUrl: "https://shopee.co.id/ISI_USERNAME_ALAM_NATURAL",
      tiktokUrl: "https://www.tiktok.com/@ISI_USERNAME_ALAM_NATURAL",
    },
    products: [
      {
        name: "Kopi Robusta Organik 250 Gram",
        slug: "alam-natural-kopi-robusta-organik-250-gram",
        description:
          "Kopi robusta lokal dalam kemasan praktis.",
        category: "Minuman",
        price: "40000",
        stock: 25,
        unit: "bungkus",
        weight: 250,
        thumbnailUrl: "https://placehold.co/600x600?text=Kopi+Organik",
      },
      {
        name: "Gula Aren Cair 500 ml",
        slug: "alam-natural-gula-aren-cair-500-ml",
        description:
          "Gula aren cair untuk pelengkap minuman dan makanan.",
        category: "Makanan",
        price: "30000",
        stock: 25,
        unit: "botol",
        weight: 600,
        thumbnailUrl: "https://placehold.co/600x600?text=Gula+Aren+Cair",
      },
      {
        name: "Sapu Bambu Tradisional",
        slug: "alam-natural-sapu-bambu-tradisional",
        description:
          "Sapu berbahan alami untuk membantu membersihkan rumah.",
        category: "Kerajinan",
        price: "22000",
        stock: 20,
        unit: "pcs",
        weight: 700,
        thumbnailUrl: "https://placehold.co/600x600?text=Sapu+Bambu",
      },
      {
        name: "Keranjang Bambu Anyaman",
        slug: "alam-natural-keranjang-bambu-anyaman",
        description:
          "Keranjang anyaman bambu untuk penyimpanan atau dekorasi.",
        category: "Kerajinan",
        price: "35000",
        stock: 15,
        unit: "pcs",
        weight: 500,
        thumbnailUrl: "https://placehold.co/600x600?text=Keranjang+Bambu",
      },
      {
        name: "Sabun Herbal 100 Gram",
        slug: "alam-natural-sabun-herbal-100-gram",
        description:
          "Sabun berbahan herbal untuk kebutuhan mandi sehari-hari.",
        category: "Lainnya",
        price: "15000",
        stock: 30,
        unit: "pcs",
        weight: 100,
        thumbnailUrl: "https://placehold.co/600x600?text=Sabun+Herbal",
      },
    ],
  },
];

async function main() {
  console.log("🌱 Memulai seed data dummy...\n");

  // ---------------------------------------------------------
  // 1. Ambil kategori yang SUDAH ADA
  // Tidak membuat kategori baru.
  // ---------------------------------------------------------
  const existingCategories = await prisma.product_categories.findMany({
    where: {
      name: {
        in: [...productCategories],
      },
    },
  });

  const categoryMap = new Map(
    existingCategories.map((category) => [category.name, category.id]),
  );

  const missingCategories = productCategories.filter(
    (name) => !categoryMap.has(name),
  );

  if (missingCategories.length > 0) {
    throw new Error(
      [
        "Kategori berikut belum ditemukan di database:",
        ...missingCategories.map((name) => `- ${name}`),
        "Pastikan nama kategori sama persis dengan kategori aplikasi.",
      ].join("\n"),
    );
  }

  console.log(`✅ ${existingCategories.length} kategori tersedia.`);

  // ---------------------------------------------------------
  // 2. Hash password untuk semua akun dummy
  // ---------------------------------------------------------
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 12);

  // ---------------------------------------------------------
  // 3. Buat akun, profil, toko, marketplace, dan produk
  // ---------------------------------------------------------
  for (const seller of sellers) {
    console.log(`\n👤 Memproses ${seller.fullname}...`);

    // Akun pengguna
    const user = await prisma.users.upsert({
      where: {
        id: seller.id,
      },
      update: {
        email: seller.email,
        username: seller.username,
        password_hash: passwordHash,
        role: "user",
        is_active: true,
      },
      create: {
        id: seller.id,
        email: seller.email,
        username: seller.username,
        password_hash: passwordHash,
        role: "user",
        is_active: true,
      },
    });

    // Profil lengkap
    await prisma.profiles.upsert({
      where: {
        user_id: user.id,
      },
      update: {
        fullname: seller.fullname,
        phone: seller.phone,
        bio: seller.bio,
        gender: seller.gender,
        birth_date: seller.birthDate,
        avatar_url: seller.avatarUrl,
        province: seller.province,
        regency: seller.regency,
        district: seller.district,
        village: seller.village,
        detail_address: seller.detailAddress,
        is_completed: true,
      },
      create: {
        user_id: user.id,
        fullname: seller.fullname,
        phone: seller.phone,
        bio: seller.bio,
        gender: seller.gender,
        birth_date: seller.birthDate,
        avatar_url: seller.avatarUrl,
        province: seller.province,
        regency: seller.regency,
        district: seller.district,
        village: seller.village,
        detail_address: seller.detailAddress,
        is_completed: true,
      },
    });

    // Toko milik pengguna
    const store = await prisma.stores.upsert({
      where: {
        owner_id: user.id,
      },
      update: {
        name: seller.store.name,
        slug: seller.store.slug,
        description: seller.store.description,
        logo_url: seller.store.logoUrl,
        banner_url: seller.store.bannerUrl,
        phone: seller.store.phone,
        email: seller.store.email,
        province: seller.store.province,
        regency: seller.store.regency,
        district: seller.store.district,
        village: seller.store.village,
        address: seller.store.address,
        is_store_complete: true,
        is_verified: false,
        is_active: true,
      },
      create: {
        owner_id: user.id,
        name: seller.store.name,
        slug: seller.store.slug,
        description: seller.store.description,
        logo_url: seller.store.logoUrl,
        banner_url: seller.store.bannerUrl,
        phone: seller.store.phone,
        email: seller.store.email,
        province: seller.store.province,
        regency: seller.store.regency,
        district: seller.store.district,
        village: seller.store.village,
        address: seller.store.address,
        is_store_complete: true,
        is_verified: false,
        is_active: true,
      },
    });

    // Link marketplace: Shopee dan TikTok
    const marketplaces = [
      {
        platform: "shopee",
        url: seller.store.shopeeUrl,
      },
      {
        platform: "tiktok",
        url: seller.store.tiktokUrl,
      },
    ];

    for (const marketplace of marketplaces) {
      await prisma.store_marketplaces.upsert({
        where: {
          store_id_platform: {
            store_id: store.id,
            platform: marketplace.platform,
          },
        },
        update: {
          url: marketplace.url,
        },
        create: {
          store_id: store.id,
          platform: marketplace.platform,
          url: marketplace.url,
        },
      });
    }

    // Produk toko
    for (const product of seller.products) {
      const categoryId = categoryMap.get(product.category);

      if (categoryId === undefined) {
        throw new Error(
          `Kategori "${product.category}" tidak ditemukan untuk produk "${product.name}".`,
        );
      }

      await prisma.products.upsert({
        where: {
          slug: product.slug,
        },
        update: {
          store_id: store.id,
          category_id: categoryId,
          name: product.name,
          description: product.description,
          thumbnail_url: product.thumbnailUrl,
          price: product.price,
          stock: product.stock,
          unit: product.unit,
          weight: product.weight,
          is_featured: false,
          is_active: true,
        },
        create: {
          store_id: store.id,
          category_id: categoryId,
          name: product.name,
          slug: product.slug,
          description: product.description,
          thumbnail_url: product.thumbnailUrl,
          price: product.price,
          stock: product.stock,
          unit: product.unit,
          weight: product.weight,
          is_featured: false,
          is_active: true,
        },
      });
    }

    console.log(`   ✅ Akun: ${seller.email}`);
    console.log(`   ✅ Toko: ${seller.store.name}`);
    console.log(`   ✅ Produk: ${seller.products.length}`);
    console.log("   ✅ Profil lengkap");
    console.log("   ✅ Link Shopee dan TikTok");
  }

  console.log("\n========================================");
  console.log("🎉 SEED BERHASIL!");
  console.log("========================================");
  console.log("Jumlah akun dummy : 5");
  console.log("Jumlah toko       : 5");
  console.log("Jumlah produk     : 25");
  console.log("Produk per toko   : 5");
  console.log("Password akun     :", DEFAULT_PASSWORD);
  console.log("========================================\n");
}

main()
  .catch((error) => {
    console.error("\n❌ Seed gagal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });