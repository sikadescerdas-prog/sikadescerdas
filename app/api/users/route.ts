// app/api/users/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;
    const skip = (page - 1) * limit;

    const whereCondition: any = {
      role: {
        not: "superadmin",
      },
    };

    if (search) {
      whereCondition.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
        {
          profiles: {
            fullname: { contains: search, mode: "insensitive" },
          },
        },
      ];
    }

    const [users, totalCount] = await Promise.all([
      prisma.users.findMany({
        where: whereCondition,
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          is_active: true,
          profiles: {
            select: {
              fullname: true,
            },
          },
        },
        orderBy: [
          { role: "asc" },
          { created_at: "desc" },
        ],
        skip,
        take: limit,
      }),
      prisma.users.count({ where: whereCondition }),
    ]);

    const formattedUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      username: user.username,
      fullname: user.profiles?.fullname || "-",
      role: user.role,
      isActive: user.is_active,
    }));

    return NextResponse.json(
      {
        success: true,
        data: formattedUsers,
        pagination: {
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit) || 1,
          currentPage: page,
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API GET USERS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Terjadi kesalahan pada server",
      },
      { status: 500 }
    );
  }
}