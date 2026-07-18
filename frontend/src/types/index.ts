import type { IconType } from "react-icons";

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: IconType;
  layout: "stacked" | "inline" | "framed" | "overlap";
}

export interface ProcessStep {
  id: string;
  order: string;
  title: string;
  description: string;
  icon: IconType;
}

export interface BenefitItem {
  id: string;
  title: string;
  description: string;
  icon: IconType;
}

export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  sport: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface NavLink {
  id: string;
  label: string;
  href: string;
}
