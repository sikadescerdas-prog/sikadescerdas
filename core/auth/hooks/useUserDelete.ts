// core/auth/hooks/useUserDelete.ts

import { useState } from "react";
import { deleteUserService } from "../services/user.service";

export const useUserDelete = () => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteUser = async (userId: string) => {
    setIsDeleting(true);
    try {
      await deleteUserService(userId);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteUser, isDeleting };
};