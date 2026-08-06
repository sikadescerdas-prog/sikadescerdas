// app/api/test-db/route.ts
// =========================================================
// DATABASE CONNECTION TEST
// =========================================================

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.users.findMany();

    return Response.json({
      status: "success",
      message: "Database connected",
      total_users: users.length,
    });

  } catch (error) {

    console.error(error);

    return Response.json(
      {
        status: "error",
        message: "Database connection failed",
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}