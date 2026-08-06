// app/api/dashboard/structure/groups/route.ts

import { NextResponse } from "next/server";
import {
  getGroups,
  createGroup,
} from "@/modules/dashboard/structure/services/group.service";

// Helper untuk penanganan BigInt serialization
function serializeGroup(group: any) {
  return {
    ...group,
    id: group.id.toString(),
    category_id: group.category_id?.toString(),
    village_structure_categories: group.village_structure_categories
      ? {
          ...group.village_structure_categories,
          id: group.village_structure_categories.id.toString(),
        }
      : null,
  };
}

// =========================
// GET GROUPS
// =========================
export async function GET() {
  try {
    const rawGroups = await getGroups();
    const groups = rawGroups.map(serializeGroup);

    return NextResponse.json({
      groups,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Gagal mengambil data lembaga",
      },
      {
        status: 500,
      }
    );
  }
}

// =========================
// CREATE GROUP
// =========================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category_id, name } = body;

    if (!category_id || !name) {
      return NextResponse.json(
        {
          message: "Category dan nama wajib diisi",
        },
        {
          status: 400,
        }
      );
    }

    const rawGroup = await createGroup(category_id, name);
    const group = serializeGroup(rawGroup);

    return NextResponse.json({
      group,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Gagal menambah lembaga",
      },
      {
        status: 500,
      }
    );
  }
}