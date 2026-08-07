// app/api/users/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return NextResponse.json(
    { message: "Fitur penghapusan akun saat ini dinonaktifkan." },
    { status: 403 }
  );
}