// core/auth/hooks/useResetPassword.ts

import { useState } from "react";
import { resetPasswordService } from "../services/user.service";

export const useResetPassword = () => {
  const [isResetting, setIsResetting] = useState(false);

  const resetPassword = async (userId: string, newPassword: string) => {
    setIsResetting(true);
    try {
      await resetPasswordService(userId, newPassword);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsResetting(false);
    }
  };

  return { resetPassword, isResetting };
};