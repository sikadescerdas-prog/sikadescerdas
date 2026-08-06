// components/village/utils/populationHelper.ts

export interface PopulationDetailItem {
  total: number;
  population_master_items: {
    name: string;
    population_categories: {
      name: string;
    };
  };
}

export interface ProcessedCategoryItem {
  name: string;
  total: number;
  prevTotal?: number;
  diff?: number;
  percentageDiff?: number;
  percentage?: number;
}

/**
 * Fungsi untuk mengelompokkan detail populasi berdasarkan kategori,
 * menghitung persentase, dan membandingkannya dengan data tahun sebelumnya.
 */
export function groupPopulation(
  currentDetails: PopulationDetailItem[] = [],
  previousDetails: PopulationDetailItem[] = []
): Record<string, ProcessedCategoryItem[]> {
  // 1. Buat peta (map) data tahun lalu untuk pencarian cepat (O(1))
  const prevMap = new Map<string, number>();
  if (previousDetails && previousDetails.length > 0) {
    previousDetails.forEach((item) => {
      const categoryName = item.population_master_items?.population_categories?.name;
      const itemName = item.population_master_items?.name;
      if (categoryName && itemName) {
        const key = `${categoryName}_${itemName}`;
        prevMap.set(key, item.total || 0);
      }
    });
  }

  // 2. Kelompokkan data tahun berjalan berdasarkan kategori
  const grouped: Record<string, ProcessedCategoryItem[]> = {};

  currentDetails.forEach((detail) => {
    const categoryName = detail.population_master_items?.population_categories?.name;
    const itemName = detail.population_master_items?.name;

    if (!categoryName || !itemName) return;

    if (!grouped[categoryName]) {
      grouped[categoryName] = [];
    }

    const currentTotal = detail.total || 0;
    const key = `${categoryName}_${itemName}`;
    const prevTotal = prevMap.get(key);

    // Hitung selisih dan persentase perubahan dari tahun lalu
    const diff = prevTotal !== undefined ? currentTotal - prevTotal : undefined;
    const percentageDiff =
      prevTotal !== undefined && prevTotal > 0
        ? Number(((diff! / prevTotal) * 100).toFixed(1))
        : undefined;

    grouped[categoryName].push({
      name: itemName,
      total: currentTotal,
      prevTotal,
      diff,
      percentageDiff,
    });
  });

  // 3. Hitung persentase kontribusi sub-kategori terhadap total dalam satu kategori yang sama
  Object.keys(grouped).forEach((catKey) => {
    const items = grouped[catKey];
    const categoryTotalSum = items.reduce((sum, item) => sum + item.total, 0);

    grouped[catKey] = items
      .map((item) => ({
        ...item,
        percentage:
          categoryTotalSum > 0
            ? Number(((item.total / categoryTotalSum) * 100).toFixed(1))
            : 0,
      }))
      .sort((a, b) => b.total - a.total); // Urutkan dari jumlah terbesar ke terkecil
  });

  return grouped;
}