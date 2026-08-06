// modules/services/types/service.types.ts

import type { LucideIcon } from "lucide-react";

export interface ServiceRequirement {
  id: string;
  title: string;
}

export interface ServiceStep {
  id: string;
  title: string;
  description: string;
}

export interface ServiceFAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Service {
  id: string;

  title: string;

  subtitle: string;

  description: string;

  category: string;

  icon: LucideIcon;

  color: string;

  duration: string;

  fee: string;

  online: boolean;

  featured: boolean;

  requirements: ServiceRequirement[];

  steps: ServiceStep[];

  faq: ServiceFAQ[];
}