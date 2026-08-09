// app/(auth)/login/page.tsx

import LayoutAuth from "@/components/auth/LayoutAuth";
import FormLogin from "@/components/auth/FormLogin";
import AuthGuard from "@/components/auth/AuthGuard";

export default function LoginPage(){
  return (
    <AuthGuard>
      <LayoutAuth>
        <FormLogin />
      </LayoutAuth>
    </AuthGuard>
  );
}