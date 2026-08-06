// modules/about/types/about.types.ts

import type { LucideIcon } from "lucide-react";

export interface AboutFeature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface AboutGoal {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface AboutPojok {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface AboutCollaboration {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface AboutStat {
  id: string;
  value: string;
  label: string;
}

export interface AboutData {
  name: string;
  logo: string;
  title: string;
  subtitle: string;
  description: string;
  background: string;
  stats: AboutStat[];
  features: AboutFeature[];
  goals: AboutGoal[];
  pojokLiterasi: AboutPojok[];
  collaboration: AboutCollaboration[];
  developer: {
    name: string;
    year: string;
    description: string;
    logo?: string;
  };
}