// app/profile/settings/page.tsx

"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AvatarProfile from "@/components/profile/settings/AvatarProfile";
import PersonalProfile from "@/components/profile/settings/PersonalProfile";
import AddressProfile from "@/components/profile/settings/AddressProfile";
import SaveProfile from "@/components/profile/settings/SaveProfile";
import { useProfileSettings } from "@/core/profile/hooks/useProfileSettings";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const {
    loading,
    saving,
    form,
    setForm,
    currentUser,
    avatarPreview,
    progress,
    usernameError,
    fullnameError,
    phoneError,
    usernameAvailable,
    checkingUsername,
    setUsernameFocus,
    setUsernameBlur,
    setFullnameBlur,
    setPhoneFocus,
    setPhoneBlur,
    handleAvatarUpload,
    deleteAvatar,
    saveProfile,
  } = useProfileSettings();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 size={20} className="animate-spin text-green-600" />
          <span className="text-sm font-medium">Memuat data profil...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 via-white to-white px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white shadow-xl">
        <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
          <div className="p-6 pb-0">
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 rounded-full bg-gray-200/10 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-green-50 hover:text-green-600"
            >
              <ArrowLeft size={18} />
              <span>Kembali</span>
            </Link>
          </div>

          <div className="pb-6 pt-2">
            <AvatarProfile
              fullname={form.fullname}
              email={currentUser?.email ?? ""}
              avatarUrl={avatarPreview}
              progress={progress}
              onUpload={handleAvatarUpload}
              onDelete={deleteAvatar}
            />
          </div>

          <div className="border-t border-gray-100">
            <PersonalProfile
              form={form}
              setForm={setForm}
              usernameError={usernameError}
              fullnameError={fullnameError}
              phoneError={phoneError}
              usernameAvailable={usernameAvailable}
              checkingUsername={checkingUsername}
              currentUsername={currentUser?.username}
              onUsernameFocus={setUsernameFocus}
              onUsernameBlur={setUsernameBlur}
              onFullnameBlur={setFullnameBlur}
              onPhoneFocus={setPhoneFocus}
              onPhoneBlur={setPhoneBlur}
            />
          </div>

          <div className="border-t border-gray-100">
            <AddressProfile form={form} setForm={setForm} />
          </div>

          <div className="border-t border-gray-100 p-6 bg-gray-50/50">
            <SaveProfile loading={saving} onSave={saveProfile} />
          </div>
        </div>
      </div>
    </div>
  );
}