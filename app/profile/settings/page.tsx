// app/profile/settings/page.tsx

import { Suspense } from "react";
import ProfileSettingsPage from "@/components/profile/settings/ProfileSettingsPage";

function ProfileSettingsLoading() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <p className="text-sm text-gray-500">
        Memuat pengaturan profil...
      </p>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<ProfileSettingsLoading />}>
      <ProfileSettingsPage />
    </Suspense>
  );
}