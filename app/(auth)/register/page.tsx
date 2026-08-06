// app/register/page.tsx

import LayoutAuth from "@/components/auth/LayoutAuth";
import FormRegister from "@/components/auth/FormRegister";
import AuthGuard from "@/components/auth/AuthGuard";

export default function RegisterPage() {
  return (
    <AuthGuard>
      <LayoutAuth reverse={true}>
        <FormRegister />
      </LayoutAuth>
    </AuthGuard>
  );
}