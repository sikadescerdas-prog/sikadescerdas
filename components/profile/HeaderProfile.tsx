// components/profile/HeaderProfile.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

import { getInitials } from "@/core/profile/helpers/getInitials";

type Props = {
  fullname: string;
  username: string;
  email: string;
  avatarUrl: string | null;
};

export function HeaderProfile({
  fullname,
  username,
  email,
  avatarUrl,
}: Props) {
  const displayName = fullname.trim() || username.trim() || "User";

  return (
    <div>
      
      {/* Back Button */}
      <div className="mb-6 flex">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-gray-200/10 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-green-50 hover:text-green-600"
        >
          <ArrowLeft size={18} />
          <span>Kembali</span>
        </Link>
      </div>

      {/* User Info Container */}
      <div className="flex flex-col items-center text-center">
        
        {/* Avatar */}
        {avatarUrl ? (
          <div className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-green-100 shadow-md">
            <Image
              src={avatarUrl}
              alt={displayName}
              fill
              sizes="96px"
              className="object-cover"
              priority
            />
          </div>
        ) : (
          <div className="flex h-24 w-24 select-none items-center justify-center rounded-full bg-gradient-to-br from-[#7AF3AE] to-[#25C95F] text-3xl font-bold text-white shadow-md ring-4 ring-green-100">
            {getInitials(displayName)}
          </div>
        )}

        {/* Fullname */}
        <h1 className="mt-4 text-xl font-bold text-gray-900">
          {displayName}
        </h1>

        {/* Username */}
        {username && (
          <p className="mt-1 text-sm font-medium text-green-600">
            @{username}
          </p>
        )}

        {/* Email */}
        {email && (
          <p className="mt-1 text-sm text-gray-400">
            {email}
          </p>
        )}

      </div>

    </div>
  );
}