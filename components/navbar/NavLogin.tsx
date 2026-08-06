// components/navbar/NavLogin.tsx

"use client";

import Link from "next/link";

export default function NavLogin() {
  return (
    <Link href="/login" className="inline-flex h-9 items-center justify-center rounded-xl bg-[#25C95F] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1fb653] active:scale-95">
      Login
    </Link>
  );
}