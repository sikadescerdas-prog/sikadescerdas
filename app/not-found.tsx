// app/not-found.tsx

"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mt-[-70px] relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-6">
      {/* ================= ANIMATED BACKGROUND ================= */}
      <div className="absolute -left-40 -top-40 h-[500px] w-[500px] animate-pulse rounded-full bg-gradient-to-br from-[#7AF3AE]/40 to-[#25C95F]/20 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] animate-pulse rounded-full bg-gradient-to-br from-emerald-300/40 to-green-400/20 blur-3xl [animation-delay:1s]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(122,243,174,0.15),transparent_40%)]" />

      {/* ================= CONTENT ================= */}
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
        {/* ================= TEXT ================= */}
        <div className="order-2 animate-[fadeIn_0.8s_ease-out] md:order-1">
          <div className="inline-flex animate-bounce items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-600">
            <span className="flex h-2 w-2 rounded-full bg-amber-500" />
            404 Error
          </div>

          <h1 className="mt-6 text-4xl font-black leading-tight text-slate-800 md:text-6xl">
            Halaman tidak
            <br />
            <span className="bg-gradient-to-r from-[#7AF3AE] to-[#25C95F] bg-clip-text text-transparent">
              ditemukan
            </span>
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-slate-500">
            Link yang kamu buka tidak tersedia, mungkin sudah dipindahkan atau alamat yang dimasukkan salah.
          </p>

          <Link
            href="/"
            className="group mt-8 inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#7AF3AE] to-[#25C95F] px-6 py-3 font-semibold text-white shadow-lg shadow-green-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-95"
          >
            <svg className="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>

        {/* ================= 404 VISUAL ================= */}
        <div className="order-1 flex justify-center md:order-2">
          <div className="relative animate-[float_4s_ease-in-out_infinite]">
            {/* Glow */}
            <div className="absolute inset-0 rounded-full bg-green-400/20 blur-3xl" />

            {/* Number */}
            <div className="relative select-none text-[150px] font-black leading-none text-[#7AF3AE] drop-shadow-xl md:text-[220px]">
              404
            </div>

            {/* Warning Card */}
            <div className="absolute left-5 top-10 flex h-16 w-16 animate-[float_3s_ease-in-out_infinite] items-center justify-center rounded-2xl bg-white shadow-xl">
              <svg className="h-8 w-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 4h.01M10.3 3.8L2.9 17a2 2 0 001.7 3h14.8a2 2 0 001.7-3L13.7 3.8a2 2 0 00-3.4 0z" />
              </svg>
            </div>

            {/* Search Card */}
            <div className="absolute bottom-10 right-5 flex h-16 w-16 animate-[float_5s_ease-in-out_infinite] items-center justify-center rounded-2xl bg-white shadow-xl">
              <svg className="h-8 w-8 text-[#25C95F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.2-5.2m2.2-5.3a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CUSTOM ANIMATION ================= */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}