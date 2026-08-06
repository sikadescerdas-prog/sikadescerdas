// components/auth/LayoutAuth.tsx

import HeroAuth from "./HeroAuth";

interface LayoutAuthProps {
  children: React.ReactNode;
  reverse?: boolean;
}

export default function LayoutAuth({ children, reverse = false }: LayoutAuthProps) {
  return (
    <div className="grid min-h-screen w-full grid-cols-1 overflow-hidden lg:h-screen lg:grid-cols-2">
      {/* MOBILE HERO */}
      <div className="lg:hidden">
        <HeroAuth reverse={reverse} />
      </div>

      {/* DESKTOP HERO */}
      <div className={`hidden h-full lg:block ${reverse ? "order-last" : "order-first"}`}>
        <HeroAuth reverse={reverse} />
      </div>

      {/* FORM CONTAINER */}
      <main className="flex h-full items-center justify-center bg-white px-6 py-8 lg:px-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}