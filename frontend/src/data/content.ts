import type { IconType } from "react-icons";
import {
  FiTarget,
  FiWind,
  FiShield,
  FiTrendingUp,
  FiMoon,
  FiEye,
  FiUser,
} from "react-icons/fi";
import { PiBrainDuotone, PiHeartbeatDuotone } from "react-icons/pi";

/**
 * این فایل فقط «ساختار» لندینگ را نگه می‌دارد (شناسه، آیکون، لوگو، لینک،
 * عدد آمار و ...). تمام متن‌ها در src/locales/fa.json و en.json هستند و با
 * همان `id` به این داده‌ها وصل می‌شوند.
 */

export const navLinks: { id: string; href: string }[] = [
  { id: "why", href: "#why" },
  { id: "services", href: "#services" },
  { id: "process", href: "#process" },
  { id: "stats", href: "#stats" },
  { id: "testimonials", href: "#testimonials" },
  { id: "faq", href: "#faq" },
  { id: "lines", href: "#" },
  { id: "staff", href: "/publicStaff" },
];

export interface ServiceMeta {
  icon: IconType;
  logo?: string;
  layout: "stacked" | "inline" | "framed" | "overlap";
}

export const serviceMeta: Record<string, ServiceMeta> = {
  "performance-anxiety": { icon: FiWind, logo: "/yogbal.jpg", layout: "stacked" },
  "stress-management": { icon: PiHeartbeatDuotone, logo: "/music.jpg", layout: "inline" },
  "competition-prep": { icon: FiTarget, logo: "/ravan.jpg", layout: "framed" },
  "confidence-building": { icon: FiTrendingUp, logo: "/hogh.jpg", layout: "overlap" },
  "mental-recovery": { icon: FiMoon, logo: "/poshtiban.jpg", layout: "stacked" },
};

export const processIcons: Record<string, IconType> = {
  "step-1": FiUser,
  "step-2": PiBrainDuotone,
  "step-3": FiTarget,
  "step-4": FiTrendingUp,
};

export const benefitIcons: Record<string, IconType> = {
  clarity: FiEye,
  resilience: FiShield,
  consistency: PiHeartbeatDuotone,
  growth: FiTrendingUp,
};

export const statValues: Record<string, number> = {
  athletes: 420,
  years: 12,
  satisfaction: 96,
  federations: 8,
};
