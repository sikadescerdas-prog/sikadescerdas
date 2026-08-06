// components/navbar/AvatarNavbar.tsx

"use client";

import { getInitials } from "@/core/profile/helpers/getInitials";

interface AvatarNavbarProps {
  fullname?: string;
  avatar?: string;
  size?: "sm" | "md" | "lg";
}

export default function AvatarNavbar({ fullname, avatar, size = "md" }: AvatarNavbarProps) {
  const sizes = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-12 w-12 text-base" };
  const displayName = fullname?.trim() || "User";
  const initials = getInitials(displayName);

  return (
    <div className={`${sizes[size]} overflow-hidden rounded-full bg-gradient-to-r from-[#7AF3AE] to-[#25C95F] flex items-center justify-center text-white font-bold shrink-0`}>
      {avatar ? <img src={avatar} alt={displayName} className="h-full w-full object-cover" /> : initials}
    </div>
  );
}