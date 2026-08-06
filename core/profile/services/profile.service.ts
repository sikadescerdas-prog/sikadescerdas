// core/profile/services/profile.service.ts

import type { AuthUser } from "@/core/auth/types/user.types";
import type { Profile, ProfileForm } from "@/core/profile/types/profile.types";

export type ProfileResponse = {
  user: AuthUser;
  profile: Profile;
};

export type ProfileStatusResponse = {
  code: string;
  is_completed: boolean;
};

export type UploadAvatarResponse = {
  avatarUrl: string;
  avatarPublicId: string | null;
};

class ProfileService {
  private readonly baseUrl = "/api/profile";

  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    const isFormData = options?.body instanceof FormData;

    const headers: HeadersInit = {
      ...(!isFormData && { "Content-Type": "application/json" }),
      ...(options?.headers ?? {}),
    };

    const response = await fetch(url, {
      credentials: "include",
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(
        data?.message ?? "Terjadi kesalahan pada server."
      );

      Object.assign(error, {
        code: data?.code,
      });

      throw error;
    }

    return data as T;
  }

  async getProfile(): Promise<ProfileResponse> {
    return this.request<ProfileResponse>(this.baseUrl);
  }

  async getStatus(): Promise<boolean> {
    const result = await this.request<ProfileStatusResponse>(
      `${this.baseUrl}/status`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return result.is_completed;
  }

  async updateProfile(payload: ProfileForm): Promise<ProfileResponse> {
    return this.request<ProfileResponse>(this.baseUrl, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  async checkUsername(username: string): Promise<boolean> {
    const result = await this.request<{ available: boolean }>(
      `${this.baseUrl}/username?username=${encodeURIComponent(username)}`
    );

    return result.available;
  }

  async uploadAvatar(file: File): Promise<UploadAvatarResponse> {
    const formData = new FormData();
    formData.append("file", file);

    return this.request<UploadAvatarResponse>(`${this.baseUrl}/avatar`, {
      method: "POST",
      body: formData,
    });
  }

  async deleteAvatar(): Promise<void> {
    await this.request<void>(`${this.baseUrl}/avatar`, {
      method: "DELETE",
    });
  }
}

export const profileService = new ProfileService();