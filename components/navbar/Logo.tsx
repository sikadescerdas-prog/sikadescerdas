// components/navbar/Logo.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface LogoProps {
  isProfile?: boolean;
}

export default function Logo({ isProfile }: LogoProps) {
  const router = useRouter();

  if (isProfile) {
    return (
      <button onClick={() => router.back()} className="flex items-center gap-1 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100">
        <svg className="h-5 w-5 text-[#25C95F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-semibold text-[#25C95F]">Kembali</span>
      </button>
    );
  }

  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="relative h-10 w-10 shrink-0">
        <Image src="/logo-desa.png" alt="Logo Desa" width={40} height={40} sizes="40px" className="object-contain" />
      </div>

      <div className="flex flex-col">
        <span className="text-lg font-bold leading-none">
          <span className="text-slate-800">Desa </span>
          <span className="bg-gradient-to-r from-[#7AF3AE] to-[#25C95F] bg-clip-text text-transparent">Danasari</span>
        </span>
        <span className="text-[10px] tracking-wide text-slate-400">SIKADES Cerdas</span>
      </div>
    </Link>
  );
}