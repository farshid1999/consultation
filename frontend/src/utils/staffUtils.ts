import { MEDIA_BASE_URL } from "@/lib/axios";

export function mediaUrl(path?: string | null) {
  if (!path) return null;
  return path.startsWith("http") ? path : `${MEDIA_BASE_URL}${path}`;
}

export function fullName(s: { first_name: string; last_name: string }) {
  return `${s.first_name} ${s.last_name}`.trim() || "بدون نام";
}

export function initials(s: { first_name: string; last_name: string }) {
  return ((s.first_name?.[0] ?? "") + (s.last_name?.[0] ?? "")).toUpperCase() || "؟";
}

/** حذف تگ‌های HTML برای خلاصه‌ی متن */
export function stripHtml(html?: string | null) {
  return (html ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}