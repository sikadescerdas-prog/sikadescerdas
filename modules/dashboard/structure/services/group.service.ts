// modules/dashboard/structure/services/group.service.ts

import { prisma } from "@/lib/prisma";

// =========================
// GET ALL GROUPS
// =========================
export async function getGroups() {
  return await prisma.village_structure_groups.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      village_structure_categories: true,
    },
  });
}

// =========================
// CREATE GROUP
// =========================
export async function createGroup(category_id: string, name: string) {
  return await prisma.village_structure_groups.create({
    data: {
      category_id: BigInt(category_id),
      name,
    },
  });
}

// =========================
// UPDATE GROUP
// =========================
export async function updateGroup(
  id: string,
  name: string,
  category_id?: string
) {
  return await prisma.village_structure_groups.update({
    where: {
      id: BigInt(id),
    },
    data: {
      name,
      ...(category_id && { category_id: BigInt(category_id) }),
    },
  });
}

// =========================
// DELETE GROUP
// =========================
export async function deleteGroup(id: string) {
  return await prisma.village_structure_groups.delete({
    where: {
      id: BigInt(id),
    },
  });
}