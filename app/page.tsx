// app/page.tsx

import HomeContent from "@/components/home/HomeContent";

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#f8faf8] via-[#f5f8f5] to-white py-6 text-gray-800 md:py-8">
      {/* BACKGROUND DECORATION */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-emerald-200/20 blur-3xl" />
        <div className="absolute top-[500px] -right-40 h-[450px] w-[450px] rounded-full bg-green-200/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-teal-100/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1500px] px-4 md:px-6 xl:px-8">
        <HomeContent />
      </div>
    </main>
  );
}