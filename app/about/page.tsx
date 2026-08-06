// app/about/page.tsx

"use client";

import HeroAbout from "@/components/about/HeroAbout";
import AboutIntro from "@/components/about/AboutIntro";
import AboutGoals from "@/components/about/AboutGoals";
import AboutTeam from "@/components/about/AboutTeam";
import AboutCTA from "@/components/about/AboutCTA";

export default function AboutPage() {
  return (
    <main className="overflow-hidden bg-white">
      <HeroAbout />
      <AboutIntro />
      <AboutGoals />
      <AboutTeam />
      <AboutCTA />
    </main>
  );
}