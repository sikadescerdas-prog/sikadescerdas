// core/auth/server/username.ts

import prisma from "@/lib/prisma";
import { sanitizeUsername } from "../helpers/username";

/* =========================
   CHECK USERNAME EXISTENCE
========================= */
export async function isUsernameExists(
  username: string,
  currentUserId?: string
): Promise<boolean> {
  const cleanUsername = sanitizeUsername(username);

  const user = await prisma.users.findUnique({
    where: {
      username: cleanUsername,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    return false;
  }

  if (currentUserId && user.id === currentUserId) {
    return false;
  }

  return true;
}