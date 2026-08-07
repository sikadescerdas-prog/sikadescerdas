// core/auth/services/user.service.ts

export const deleteUserService = async (userId: string) => {
  const response = await fetch(`/api/users/${userId}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message ?? "Gagal menghapus akun.");
  }

  return result;
};

export const resetPasswordService = async (userId: string, newPassword: string) => {
  const response = await fetch(`/api/users/${userId}/reset-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newPassword }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message ?? "Gagal mereset sandi.");
  }

  return result;
};