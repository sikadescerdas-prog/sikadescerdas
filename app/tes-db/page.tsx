// app/test-db/page.tsx

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TestDatabasePage() {
  let status = "Gagal";
  let message = "";
  let data = null;

  try {
    const village = await prisma.villages.findFirst({
      select: {
        id: true,
        name: true,
      },
    });

    status = "Berhasil";
    message = "Koneksi Prisma ke database berhasil";
    data = village;
  } catch (error) {
    console.error("DATABASE TEST ERROR:", error);

    message =
      error instanceof Error
        ? error.message
        : "Unknown database error";
  }

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow">
        <h1 className="mb-6 text-2xl font-bold">
          Test Database Prisma
        </h1>

        <div
          className={`rounded-xl p-4 ${
            status === "Berhasil"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          <p className="font-semibold">
            Status: {status}
          </p>

          <p className="mt-2 text-sm">
            {message}
          </p>
        </div>

        {data && (
          <div className="mt-6 rounded-xl bg-gray-100 p-4">
            <h2 className="font-semibold">
              Data Desa
            </h2>

            <pre className="mt-2 text-sm">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}